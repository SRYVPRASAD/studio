// src/components/geo-inspector-form.tsx
'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, MapPin, Send } from 'lucide-react';

interface GeoInspectorFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  initialValues?: {
    endpoint?: string;
    latitude?: string;
    longitude?: string;
  }
}

export default function GeoInspectorForm({ onSubmit, isLoading, initialValues }: GeoInspectorFormProps) {
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-lg shadow-xl bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline text-primary">
          <Globe className="h-7 w-7" />
          Endpoint & Geo Target
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="endpoint" className="flex items-center gap-1 text-base text-foreground/90">
              <Globe className="h-4 w-4" /> API Endpoint
            </Label>
            <Input
              id="endpoint"
              name="endpoint"
              type="url"
              placeholder="https://api.example.com/data"
              required
              disabled={isLoading}
              defaultValue={initialValues?.endpoint || 'https://jsonplaceholder.typicode.com/todos/1'}
              className="text-base bg-input text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="flex items-center gap-1 text-base text-foreground/90">
                <MapPin className="h-4 w-4" /> Latitude
              </Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                placeholder="e.g., 34.0522"
                required
                disabled={isLoading}
                defaultValue={initialValues?.latitude || '34.0522'}
                className="text-base bg-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude" className="flex items-center gap-1 text-base text-foreground/90">
                <MapPin className="h-4 w-4" /> Longitude
              </Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                placeholder="e.g., -118.2437"
                required
                disabled={isLoading}
                defaultValue={initialValues?.longitude || '-118.2437'}
                className="text-base bg-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 h-auto rounded-md shadow-md transition-colors duration-150">
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-accent-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Send className="h-5 w-5 mr-2" />
            )}
            {isLoading ? 'Inspecting...' : 'Inspect Endpoint'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
