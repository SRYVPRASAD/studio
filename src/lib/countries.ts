
// src/lib/countries.ts
export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  latitude: number;
  longitude: number;
}

export const countries: Country[] = [
  { name: "United States", code: "US", latitude: 38.9637, longitude: -95.7129 },
  { name: "Canada", code: "CA", latitude: 56.1304, longitude: -106.3468 },
  { name: "United Kingdom", code: "GB", latitude: 55.3781, longitude: -3.4360 },
  { name: "Germany", code: "DE", latitude: 51.1657, longitude: 10.4515 },
  { name: "France", code: "FR", latitude: 46.2276, longitude: 2.2137 },
  { name: "Japan", code: "JP", latitude: 36.2048, longitude: 138.2529 },
  { name: "Australia", code: "AU", latitude: -25.2744, longitude: 133.7751 },
  { name: "Brazil", code: "BR", latitude: -14.2350, longitude: -51.9253 },
  { name: "India", code: "IN", latitude: 20.5937, longitude: 78.9629 },
  { name: "South Africa", code: "ZA", latitude: -30.5595, longitude: 22.9375 },
  { name: "Singapore", code: "SG", latitude: 1.3521, longitude: 103.8198 },
  { name: "Netherlands", code: "NL", latitude: 52.1326, longitude: 5.2913 },
  { name: "Sweden", code: "SE", latitude: 60.1282, longitude: 18.6435 },
  { name: "Switzerland", code: "CH", latitude: 46.8182, longitude: 8.2275 },
  { name: "Ireland", code: "IE", latitude: 53.4129, longitude: -8.2439 },
  // Add more countries as needed
];

export function getCoordinatesByCountryCode(countryCode: string): { latitude: number; longitude: number } | undefined {
  const country = countries.find(c => c.code === countryCode);
  return country ? { latitude: country.latitude, longitude: country.longitude } : undefined;
}

export function getCountryByCode(countryCode: string): Country | undefined {
    return countries.find(c => c.code === countryCode);
}
