// src/components/response-display.tsx
import type { ApiResponse } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Server, FileText, ListOrdered } from 'lucide-react';

interface ResponseDisplayProps {
  response: ApiResponse;
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
  const statusType = response.status >= 200 && response.status < 300 ? 'success' : 
                        response.status >= 400 ? 'error' : 'warning';
  
  const statusBadgeVariant = statusType === 'success' ? 'default' :
                             statusType === 'error' ? 'destructive' : 'secondary';
  const statusBadgeClass = statusType === 'success' ? 'bg-green-500/20 border-green-500 text-green-300' :
                           statusType === 'error' ? 'bg-destructive/20 border-destructive text-red-300' :
                           'bg-yellow-500/20 border-yellow-500 text-yellow-300';


  return (
    <Card className="w-full shadow-xl bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline text-primary">
            <Server className="h-7 w-7" /> API Response
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 font-headline text-foreground/90">Status Code</h3>
          <Badge variant={statusBadgeVariant} className={`text-lg px-3 py-1 ${statusBadgeClass}`}>
            {response.status}
          </Badge>
        </div>
        <Separator className="bg-border/50" />
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 font-headline text-foreground/90">
            <ListOrdered className="h-5 w-5"/> Headers
          </h3>
          <ScrollArea className="h-48 rounded-md border border-border/70 p-3 bg-input/50">
            <ul className="space-y-1">
              {Object.entries(response.headers).map(([key, value]) => (
                <li key={key} className="font-code text-sm break-all text-foreground/80">
                  <span className="font-semibold text-primary/90">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
        <Separator className="bg-border/50" />
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 font-headline text-foreground/90">
            <FileText className="h-5 w-5"/> Raw Body
          </h3>
          <ScrollArea className="h-72 rounded-md border border-border/70 p-3 bg-input/50">
            <pre className="font-code text-sm whitespace-pre-wrap break-all text-foreground/80">
              {response.body || '(Empty Response Body)'}
            </pre>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
