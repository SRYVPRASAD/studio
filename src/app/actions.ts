// src/app/actions.ts
'use server';

import { z } from 'zod';
import { analyzeGeoClues, type AnalyzeGeoCluesInput } from '@/ai/flows/analyze-geo-clues';
import type { performance } from 'perf_hooks'; // For Node.js performance

export interface ApiResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface LocationInput {
  latitude: number;
  longitude: number;
}

const locationInputSchema = z.object({
  latitude: z.coerce.number().min(-90, {message: "Latitude must be between -90 and 90."}).max(90, {message: "Latitude must be between -90 and 90."}),
  longitude: z.coerce.number().min(-180, {message: "Longitude must be between -180 and 180."}).max(180, {message: "Longitude must be between -180 and 180."}),
});

const inspectMultiEndpointSchema = z.object({
  endpoint: z.string().url({ message: 'Invalid API endpoint URL.' }),
  locations: z.array(locationInputSchema).min(1, { message: 'At least one location is required.' })
});

export interface SingleLocationInspectionResult {
  location: LocationInput;
  apiResponse?: ApiResponse;
  analysis?: string;
  responseTimeMs?: number;
  error?: string;
}


// Mock function to simulate fetching from a geo-proxy
async function fetchViaGeoProxy(endpoint: string, latitude: number, longitude: number): Promise<ApiResponse> {
  console.log(`Simulating API call to ${endpoint} via proxy at Lat: ${latitude}, Lon: ${longitude}`);
  
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  if (endpoint.includes("error")) {
    return {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'X-Proxy-Location': `${latitude}, ${longitude}`, 'X-Served-By': 'mock-error-server' },
      body: JSON.stringify({ error: 'Internal Server Error from mock proxy' }),
    };
  }
  
  if (endpoint.includes("empty")) {
    return {
      status: 204,
      headers: { 'X-Proxy-Location': `${latitude}, ${longitude}`, 'X-Served-By': 'mock-empty-server' },
      body: '',
    };
  }

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Proxy-Location': `${latitude}, ${longitude}`,
      'X-Custom-Header': 'MockValue',
      'Date': new Date().toUTCString(),
      'Server': 'MockNginx/1.2.3',
      'Via': '1.1 someproxy.geo',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({
      message: `Mock response from ${endpoint} for location ${latitude}, ${longitude}`,
      requestLocation: { lat: latitude, lon: longitude },
      data: { id: Math.floor(Math.random()*1000), name: "Test Data", value: Math.random() * 100 },
      timestamp: new Date().toISOString(),
    }, null, 2),
  };
}


export async function inspectEndpointAction(formData: FormData): Promise<{results?: SingleLocationInspectionResult[], error?: string}> {
  const endpoint = formData.get('endpoint') as string;
  const locationCount = parseInt(formData.get('locationCount') as string || '0', 10);
  const locationsData: any[] = [];

  for (let i = 0; i < locationCount; i++) {
    locationsData.push({
      latitude: formData.get(`latitude_${i}`),
      longitude: formData.get(`longitude_${i}`),
    });
  }
  
  const validationResult = inspectMultiEndpointSchema.safeParse({
    endpoint,
    locations: locationsData,
  });

  if (!validationResult.success) {
    return { error: validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ') };
  }

  const { endpoint: validatedEndpoint, locations: validatedLocations } = validationResult.data;
  const results: SingleLocationInspectionResult[] = [];

  // Ensure performance is available (Node.js global or imported)
  const { performance: nodePerformance } = await import('perf_hooks');

  for (const loc of validatedLocations) {
    let singleResult: SingleLocationInspectionResult = { location: loc };
    try {
      const startTime = nodePerformance.now();
      const apiResponse = await fetchViaGeoProxy(validatedEndpoint, loc.latitude, loc.longitude);
      const endTime = nodePerformance.now();
      singleResult.responseTimeMs = Math.round(endTime - startTime);
      singleResult.apiResponse = apiResponse;

      if (apiResponse.status >= 200 && apiResponse.status < 400 && apiResponse.body) { 
        const analysisInput: AnalyzeGeoCluesInput = {
          httpStatus: apiResponse.status,
          headers: apiResponse.headers,
          body: apiResponse.body,
          targetGeolocation: {
            latitude: loc.latitude,
            longitude: loc.longitude,
          },
        };
        const analysisResult = await analyzeGeoClues(analysisInput);
        singleResult.analysis = analysisResult.analysis;
      } else if (apiResponse.status >=400) {
        singleResult.error = `API returned status ${apiResponse.status}. Body: ${apiResponse.body.substring(0,100)}`;
      } else if (!apiResponse.body) {
         singleResult.analysis = "Response body was empty, no content to analyze.";
      }
    } catch (e) {
      console.error(`Error inspecting endpoint for location ${loc.latitude},${loc.longitude}:`, e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      singleResult.error = `Failed to inspect for ${loc.latitude},${loc.longitude}: ${errorMessage}`;
    }
    results.push(singleResult);
  }
  return { results };
}