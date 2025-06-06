// src/ai/flows/analyze-geo-clues.ts
'use server';

/**
 * @fileOverview Analyzes API responses for geolocation clues.
 *
 * - analyzeGeoClues - A function that analyzes API responses for geolocation clues.
 * - AnalyzeGeoCluesInput - The input type for the analyzeGeoClues function.
 * - AnalyzeGeoCluesOutput - The return type for the analyzeGeoClues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeGeoCluesInputSchema = z.object({
  httpStatus: z.number().describe('The HTTP status code of the API response.'),
  headers: z.record(z.string()).describe('The headers of the API response.'),
  body: z.string().describe('The raw body of the API response.'),
  targetGeolocation: z
    .object({
      latitude: z.number().describe('The latitude of the target geolocation.'),
      longitude: z.number().describe('The longitude of the target geolocation.'),
    })
    .optional()
    .describe('The target geolocation for the API request.'),
});
export type AnalyzeGeoCluesInput = z.infer<typeof AnalyzeGeoCluesInputSchema>;

const AnalyzeGeoCluesOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the API response for geolocation clues.'),
});
export type AnalyzeGeoCluesOutput = z.infer<typeof AnalyzeGeoCluesOutputSchema>;

export async function analyzeGeoClues(input: AnalyzeGeoCluesInput): Promise<AnalyzeGeoCluesOutput> {
  return analyzeGeoCluesFlow(input);
}

const analyzeGeoCluesPrompt = ai.definePrompt({
  name: 'analyzeGeoCluesPrompt',
  input: {schema: AnalyzeGeoCluesInputSchema},
  output: {schema: AnalyzeGeoCluesOutputSchema},
  prompt: `You are an expert at analyzing API responses for geolocation clues.

You will be provided with the HTTP status code, headers, and body of an API response, as well as the target geolocation that the API was called from.

Your goal is to analyze the API response and highlight potential geolocation clues in the headers and content.

Consider common patterns, third-party resources utilized, and any inconsistencies that might indicate the actual geolocation of the server.

Here is the information about the API response:

HTTP Status Code: {{{httpStatus}}}
Headers: {{#each headers key="headerName"}}
  {{headerName}}: {{{this}}}
{{/each}}

Body:
{{{body}}}

Target Geolocation:
{{#if targetGeolocation}}
  Latitude: {{{targetGeolocation.latitude}}}
  Longitude: {{{targetGeolocation.longitude}}}
{{else}}
  Not provided.
{{/if}}

Analyze the API response for geolocation clues:
`,
});

const analyzeGeoCluesFlow = ai.defineFlow(
  {
    name: 'analyzeGeoCluesFlow',
    inputSchema: AnalyzeGeoCluesInputSchema,
    outputSchema: AnalyzeGeoCluesOutputSchema,
  },
  async input => {
    const {output} = await analyzeGeoCluesPrompt(input);
    return output!;
  }
);
