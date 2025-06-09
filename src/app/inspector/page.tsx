
// src/app/inspector/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import GeoInspectorForm from '@/components/geo-inspector-form';
import ResponseDisplay from '@/components/response-display';
import AnalysisDisplay from '@/components/analysis-display';
import { inspectEndpointAction, type SingleLocationInspectionResult } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Clock, MapPinned, CheckCircle, AlertTriangle, ServerCrash, Share2, Download, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


// TODO: Replace with your actual base64 encoded logo (e.g., a 100x30px transparent PNG)
// You can use an online converter to get the base64 string of your image.
// Example placeholder (a small transparent png):
const appLogoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAeCAYAAADvLsomAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVHja7cExAQAAAMKg9U9tCU+gAAAAAAAAAADAZgN9AAGfG2xCAAAAAElFTkSuQmCC';


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
    if (status >= 300 && status < 400) return <Badge variant="secondary" className="bg-blue-500/20 border-blue-500 text-blue-300">{status}</Badge>; 
    return <Badge variant="secondary" className="bg-yellow-500/20 border-yellow-500 text-yellow-300">{status}</Badge>;
  };

  const handleCopyResults = () => {
    if (!inspectionResults || inspectionResults.length === 0) return;
    const resultsJson = JSON.stringify(inspectionResults, null, 2);
    navigator.clipboard.writeText(resultsJson)
      .then(() => toast({ title: "Success", description: "Results copied to clipboard as JSON!" }))
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast({ variant: "destructive", title: "Error", description: "Failed to copy results to clipboard." })
      });
  };

  const handleDownloadPdfResults = () => {
    if (!inspectionResults || inspectionResults.length === 0) {
      toast({ variant: "destructive", title: "Error", description: "No results to download." });
      return;
    }

    const doc = new jsPDF();
    
    // Add logo - Adjust x, y, width, height as needed
    try {
      const logoWidth = 30; // Adjust as needed
      const logoHeight = 10; // Adjust as needed
      doc.addImage(appLogoBase64, 'PNG', 15, 10, logoWidth, logoHeight);
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
      // Continue without logo if it fails
    }

    doc.setFontSize(18);
    doc.text("Geo Inspector API Results", 15, 28); // Positioned below logo
    doc.setFontSize(10);
    doc.text(`Report generated on: ${new Date().toLocaleString()}`, 15, 33);

    const tableColumn = ["Location", "Status", "Time (ms)", "Content-Type", "Server", "AI Analysis Snippet"];
    const tableRows = [];

    inspectionResults.forEach(result => {
      const analysisSnippet = result.analysis ? result.analysis.substring(0, 70) + (result.analysis.length > 70 ? "..." : "") : "N/A";
      const rowData = [
        result.location.countryName || "Unknown",
        result.apiResponse ? result.apiResponse.status.toString() : "Error",
        result.responseTimeMs !== undefined ? result.responseTimeMs.toString() : "N/A",
        result.apiResponse?.headers['content-type'] || result.apiResponse?.headers['Content-Type'] || "N/A",
        result.apiResponse?.headers['server'] || result.apiResponse?.headers['Server'] || "N/A",
        analysisSnippet
      ];
      tableRows.push(rowData);
    });

    // Need to tell TypeScript that autoTable exists on jsPDF instance
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Start table below the title and logo
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }, // Example: Teal header
      margin: { top: 30 },
    });
    
    doc.save(`geo-inspector-results-${new Date().toISOString().slice(0,10)}.pdf`);
    toast({ title: "Success", description: "Results download started (PDF)!" });
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-headline text-primary">Inspection Results</CardTitle>
                <CardDescription>Click on a location to see detailed response and analysis.</CardDescription>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0 self-start sm:self-center">
                <Button variant="outline" size="icon" onClick={handleCopyResults} title="Copy Results as JSON">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleDownloadPdfResults} title="Download Results as PDF">
                  <FileText className="h-5 w-5" /> {/* Changed icon to FileText for PDF */}
                </Button>
              </div>
            </div>
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

