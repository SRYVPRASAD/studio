// src/components/analysis-display.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrainCircuit } from 'lucide-react';

interface AnalysisDisplayProps {
  analysisText: string;
}

export default function AnalysisDisplay({ analysisText }: AnalysisDisplayProps) {
  return (
    <Card className="w-full shadow-xl bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline text-primary">
            <BrainCircuit className="h-7 w-7" /> Geo Clue Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 rounded-md border border-border/70 p-4 bg-input/50">
          <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
            {analysisText}
          </p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
