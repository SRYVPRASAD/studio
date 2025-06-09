
// src/app/inspector/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import GeoInspectorForm from '@/components/geo-inspector-form';
import ResponseDisplay from '@/components/response-display';
import AnalysisDisplay from '@/components/analysis-display';
import { inspectEndpointAction, type SingleLocationInspectionResult } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Clock, MapPinned, CheckCircle, AlertTriangle, ServerCrash } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';

// It's good practice to define metadata for specific pages if needed
// export const metadata: Metadata = {
//   title: 'Geo Inspector Tool | API Geolocation & Latency Testing',
//   description: 'Use the Geo Inspector tool to test API responses and measure latency from multiple global geolocations. Analyze geo-clues and verify geo-targeting.',
// };


export default function InspectorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [inspectionResults, setInspectionResults] = useState<SingleLocationInspectionResult[] | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const { toast } = useToast();
  const [clientInitialized, setClientInitialized] = useState(false);

  useEffect(() => {
    setClientInitialized(true);
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setInspectionResults(null);
    setGlobalError(null);

    try {
      const response = await inspectEndpointAction(formData);
      
      if (response.error) {
        setGlobalError(response.error);
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: response.error,
          duration: 7000,
        });
      } else if (response.results) {
        setInspectionResults(response.results);
        const successfulInspections = response.results.filter(r => !r.error && r.apiResponse).length;
        const erroredInspections = response.results.filter(r => r.error).length;
        const totalInspections = response.results.length;
        
        let toastTitle = "Inspection Complete";
        let toastDescription = `${successfulInspections}/${totalInspections} locations inspected successfully.`;
        if (erroredInspections > 0) {
            toastTitle = "Inspection Partially Complete";
            toastDescription = `${successfulInspections}/${totalInspections} locations succeeded, ${erroredInspections} failed.`;
        }

        toast({
          title: toastTitle,
          description: toastDescription,
          className: erroredInspections > 0 && successfulInspections > 0 ? "bg-yellow-500/20 border-yellow-500 text-yellow-300" : "bg-primary text-primary-foreground border-primary/50",
          duration: 5000,
        });
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'An unexpected error occurred processing the request.';
      setGlobalError(errorMsg);
      toast({
        variant: "destructive",
        title: "Client-side Error",
        description: errorMsg,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (result: SingleLocationInspectionResult) => {
    if (result.error && !result.apiResponse && result.location.countryName === "Unknown") return <Badge variant="destructive" className="bg-red-700/30 border-red-700 text-red-200"><ServerCrash className="h-4 w-4 mr-1"/>Invalid Location</Badge>;
    if (result.error && !result.apiResponse) return <Badge variant="destructive" className="bg-red-700/30 border-red-700 text-red-200"><ServerCrash className="h-4 w-4 mr-1"/>Fetch Error</Badge>;
    if (!result.apiResponse) return <Badge variant="secondary">No Response</Badge>;
    
    const status = result.apiResponse.status;
    if (status >= 200 && status < 300) return <Badge className="bg-green-500/20 border-green-500 text-green-300"><CheckCircle className="h-4 w-4 mr-1"/>{status}</Badge>;
    if (status >= 400) return <Badge variant="destructive" className="bg-red-500/20 border-red-500 text-red-300"><AlertTriangle className="h-4 w-4 mr-1"/>{status}</Badge>;
    if (status >= 300 && status < 400) return <Badge variant="secondary" className="bg-blue-500/20 border-blue-500 text-blue-300">{status}</Badge>; // For redirects
    return <Badge variant="secondary" className="bg-yellow-500/20 border-yellow-500 text-yellow-300">{status}</Badge>;
  };


  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 space-y-8">
      <header className="text-center space-y-2 mt-4 mb-4">
        <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary tracking-tight">
          Geo Inspector Tool
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Input an API endpoint and select target geolocations for inspection.
        </p>
      </header>

      <GeoInspectorForm onSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 rounded-lg bg-card w-full max-w-lg shadow-xl">
            <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl text-primary/90">Inspecting endpoints... Please wait.</p>
             {clientInitialized && <Image 
                src="https://placehold.co/400x200.png" 
                alt="Loading illustration of network activity"
                width={400}
                height={200}
                className="rounded-md opacity-50 shadow-md"
                data-ai-hint="network data"
                key={`loading-${clientInitialized ? 'client' : 'server'}`}
            />}
        </div>
      )}

      {globalError && !isLoading && (
        <div className="w-full max-w-2xl p-6 bg-destructive/10 border border-destructive text-destructive rounded-lg flex items-start gap-3 shadow-lg">
          <AlertCircle className="h-6 w-6 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Inspection Problem</h3>
            <p>{globalError}</p>
          </div>
        </div>
      )}

      {inspectionResults && inspectionResults.length > 0 && !isLoading && !globalError && (
        <Card className="w-full max-w-4xl shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Inspection Results</CardTitle>
            <CardDescription>Click on a location to see detailed response and analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {inspectionResults.map((result, index) => (
                <AccordionItem value={`item-${index}`} key={`result-${index}-${result.location.countryCode}-${clientInitialized ? 'client' : 'server'}`}>
                  <AccordionTrigger className="hover:bg-input/30 px-4 rounded-t-md data-[state=open]:bg-input/40 data-[state=open]:rounded-b-none">
                    <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center gap-2 md:gap-4 text-left">
                        <div className="flex items-center gap-2 font-medium text-base text-foreground/90">
                            <MapPinned className="h-5 w-5 text-primary/80 shrink-0" />
                            <span>{result.location.countryName || `Location ${index + 1}`} ({result.location.countryCode})</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 shrink-0 pl-6 md:pl-0">
                            {getStatusBadge(result)}
                            {result.responseTimeMs !== undefined && (
                                <Badge variant="outline" className="flex items-center gap-1 text-sm border-border/70">
                                    <Clock className="h-4 w-4" /> {result.responseTimeMs} ms
                                </Badge>
                            )}
                        </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 space-y-6 bg-input/20 rounded-b-md border-x border-b border-border/50">
                    {result.error && (!result.apiResponse || result.location.countryName === "Unknown") && ( 
                       <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
                         <p className="font-semibold">Error for this location:</p> 
                         <p>{result.error}</p>
                       </div>
                    )}
                    {result.apiResponse && (
                      <>
                        {result.error && result.location.countryName !== "Unknown" && <p className="text-sm text-yellow-400 px-1 py-2 rounded-md bg-yellow-600/10 border border-yellow-500/30 mb-2"><AlertTriangle className="inline h-4 w-4 mr-1" /> Note: {result.error}</p>}
                        <ResponseDisplay response={result.apiResponse} />
                      </>
                    )}
                    {result.analysis && (
                      <AnalysisDisplay analysisText={result.analysis} />
                    )}
                    {!result.apiResponse && !result.analysis && !result.error && (
                        <p className="text-muted-foreground text-center py-4">No data or analysis available for this location.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
      
      {!inspectionResults && !globalError && !isLoading && (
         <Card className="w-full max-w-3xl shadow-xl bg-card">
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary/90">
                    No Results Yet
                </CardTitle>
                <CardDescription className="text-base">
                    Enter an API endpoint and select locations above, then click "Inspect Endpoints" to see results.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">
                Your inspection results will appear here.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
