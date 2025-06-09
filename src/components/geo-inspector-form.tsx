// src/components/geo-inspector-form.tsx
'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, MapPin, Send, PlusCircle, XCircle } from 'lucide-react';

interface LocationField {
  id: string; // For unique key in React rendering
  latitude: string;
  longitude: string;
}

interface GeoInspectorFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export default function GeoInspectorForm({ onSubmit, isLoading }: GeoInspectorFormProps) {
  const [endpoint, setEndpoint] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [locations, setLocations] = useState<LocationField[]>([
    { id: `loc-${Date.now()}`, latitude: '34.0522', longitude: '-118.2437' },
  ]);

  const handleAddLocation = () => {
    setLocations([...locations, { id: `loc-${Date.now()}`, latitude: '', longitude: '' }]);
  };

  const handleRemoveLocation = (id: string) => {
    if (locations.length > 1) { // Keep at least one location
      setLocations(locations.filter(loc => loc.id !== id));
    }
  };

  const handleLocationChange = (id: string, field: 'latitude' | 'longitude', value: string) => {
    setLocations(locations.map(loc => loc.id === id ? { ...loc, [field]: value } : loc));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newFormData = new FormData();
    newFormData.append('endpoint', endpoint);
    newFormData.append('locationCount', locations.length.toString());
    locations.forEach((loc, index) => {
      newFormData.append(`latitude_${index}`, loc.latitude);
      newFormData.append(`longitude_${index}`, loc.longitude);
    });
    await onSubmit(newFormData);
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline text-primary">
          <Globe className="h-7 w-7" />
          Endpoint & Geo Targets
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
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="text-base bg-input text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-4">
            {locations.map((loc, index) => (
              <div key={loc.id} className="space-y-3 p-4 border border-border/50 rounded-lg relative bg-background/20 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium text-primary/90">Location {index + 1}</Label>
                  {locations.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLocation(loc.id)}
                      disabled={isLoading}
                      className="text-muted-foreground hover:text-destructive h-7 w-7"
                      aria-label="Remove location"
                    >
                      <XCircle className="h-5 w-5" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`latitude_${index}`} className="flex items-center gap-1 text-sm text-foreground/90">
                      <MapPin className="h-4 w-4" /> Latitude
                    </Label>
                    <Input
                      id={`latitude_${index}`}
                      name={`latitude_${index}`}
                      type="number"
                      step="any"
                      placeholder="e.g., 34.0522"
                      required
                      disabled={isLoading}
                      value={loc.latitude}
                      onChange={(e) => handleLocationChange(loc.id, 'latitude', e.target.value)}
                      className="text-base bg-input text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`longitude_${index}`} className="flex items-center gap-1 text-sm text-foreground/90">
                      <MapPin className="h-4 w-4" /> Longitude
                    </Label>
                    <Input
                      id={`longitude_${index}`}
                      name={`longitude_${index}`}
                      type="number"
                      step="any"
                      placeholder="e.g., -118.2437"
                      required
                      disabled={isLoading}
                      value={loc.longitude}
                      onChange={(e) => handleLocationChange(loc.id, 'longitude', e.target.value)}
                      className="text-base bg-input text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button type="button" variant="outline" onClick={handleAddLocation} disabled={isLoading} className="w-full border-dashed hover:border-primary hover:text-primary bg-input/30 hover:bg-primary/10">
            <PlusCircle className="h-5 w-5 mr-2" /> Add Another Location
          </Button>

          <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 h-auto rounded-md shadow-md transition-colors duration-150">
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-accent-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Send className="h-5 w-5 mr-2" />
            )}
            {isLoading ? 'Inspecting...' : 'Inspect Endpoints'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
