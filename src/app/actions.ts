// src/app/actions.ts
'use server';

import { z } from 'zod';
import { analyzeGeoClues, type AnalyzeGeoCluesInput } from '@/ai/flows/analyze-geo-clues';

const inspectEndpointSchema = z.object({
  endpoint: z.string().url({ message: 'Invalid API endpoint URL.' }),
  latitude: z.coerce.number().min(-90, {message: "Latitude must be between -90 and 90."}).max(90, {message: "Latitude must be between -90 and 90."}),
  longitude: z.coerce.number().min(-180, {message: "Longitude must be between -180 and 180."}).max(180, {message: "Longitude must be between -180 and 180."}),
});

export interface ApiResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface InspectionResult {
  apiResponse?: ApiResponse;
  analysis?: string;
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
      message: `Mock response from ${endpoint}`,
      requestLocation: { lat: latitude, lon: longitude },
      data: { id: 123, name: "Test Data", value: Math.random() * 100 },
      timestamp: new Date().toISOString(),
    }, null, 2),
  };
}


export async function inspectEndpointAction(formData: FormData): Promise<InspectionResult> {
  const rawFormData = {
    endpoint: formData.get('endpoint'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
  };

  const validationResult = inspectEndpointSchema.safeParse(rawFormData);

  if (!validationResult.success) {
    return { error: validationResult.error.errors.map(e => e.message).join(', ') };
  }

  const { endpoint, latitude, longitude } = validationResult.data;

  try {
    const apiResponse = await fetchViaGeoProxy(endpoint, latitude, longitude);

    const analysisInput: AnalyzeGeoCluesInput = {
      httpStatus: apiResponse.status,
      headers: apiResponse.headers,
      body: apiResponse.body,
      targetGeolocation: {
        latitude,
        longitude,
      },
    };
    const analysisResult = await analyzeGeoClues(analysisInput);

    return {
      apiResponse,
      analysis: analysisResult.analysis,
    };
  } catch (e) {
    console.error('Error during inspection:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to inspect endpoint: ${errorMessage}` };
  }
}
