// src/app/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import GeoInspectorForm from '@/components/geo-inspector-form';
import ResponseDisplay from '@/components/response-display';
import AnalysisDisplay from '@/components/analysis-display';
import { inspectEndpointAction, type InspectionResult } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Info } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<InspectionResult | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setInspectionResult(null); 

    try {
      const result = await inspectEndpointAction(formData);
      setInspectionResult(result);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Inspection Error",
          description: result.error,
          duration: 5000,
        });
      } else if (result.apiResponse) {
         toast({
          title: "Inspection Complete",
          description: "API response fetched and analyzed.",
          className: "bg-primary text-primary-foreground border-primary/50",
          duration: 3000,
        });
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : 'An unexpected error occurred.';
      toast({
        variant: "destructive",
        title: "Client Error",
        description: error,
        duration: 5000,
      });
      setInspectionResult({ error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 space-y-8">
      <header className="text-center space-y-2 mt-4 mb-4">
        <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary tracking-tight">
          Geo Inspector
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Test your API responses from different geolocations and analyze for clues.
        </p>
      </header>

      <GeoInspectorForm onSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 rounded-lg bg-card w-full max-w-lg shadow-xl">
            <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl text-primary/90">Inspecting endpoint... Please wait.</p>
             <Image 
                src="https://placehold.co/400x200.png" 
                alt="Loading illustration of network activity"
                width={400}
                height={200}
                className="rounded-md opacity-50 shadow-md"
                data-ai-hint="network data"
            />
        </div>
      )}

      {inspectionResult?.error && !isLoading && (
        <div className="w-full max-w-2xl p-6 bg-destructive/10 border border-destructive text-destructive rounded-lg flex items-start gap-3 shadow-lg">
          <AlertCircle className="h-6 w-6 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Inspection Failed</h3>
            <p>{inspectionResult.error}</p>
          </div>
        </div>
      )}

      {inspectionResult?.apiResponse && !isLoading && (
        <div className="w-full max-w-4xl space-y-8">
          <ResponseDisplay response={inspectionResult.apiResponse} />
          {inspectionResult.analysis && (
            <AnalysisDisplay analysisText={inspectionResult.analysis} />
          )}
        </div>
      )}

      {!inspectionResult && !isLoading && (
         <div className="w-full max-w-2xl p-8 bg-card border border-border text-foreground rounded-lg flex flex-col items-center gap-6 text-center shadow-xl">
          <Info className="h-12 w-12 text-primary" />
          <div>
            <h3 className="font-semibold text-2xl font-headline text-primary/90">Ready to Inspect</h3>
            <p className="text-muted-foreground mt-2">
              Enter an API endpoint and target geolocation above, then click "Inspect Endpoint" to see the results.
            </p>
          </div>
          <Image 
            src="https://placehold.co/600x300.png" 
            alt="Placeholder image of a world map with data points"
            width={600}
            height={300}
            className="rounded-md mt-4 opacity-70 shadow-lg"
            data-ai-hint="world map"
            />
        </div>
      )}
      <footer className="w-full text-center py-8 mt-auto">
        <p className="text-sm text-muted-foreground">
          Geo Inspector &copy; {new Date().getFullYear()}. Powered by Next.js & GenAI.
        </p>
      </footer>
    </div>
  );
}
