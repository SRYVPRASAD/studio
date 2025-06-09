
// src/app/page.tsx (New Landing Page)
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, HelpCircle, Route, BarChart3, ServerCog, Telescope } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Geo Inspector: Global API Performance & Geolocation Insights',
  description: 'Discover how your API performs across the globe. Test latency, verify geo-targeting, and uncover hidden behaviors with Geo Inspector. Start analyzing your API from multiple geolocations today.',
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background to-card/30">
        <div className="container mx-auto px-4 text-center">
          <Telescope className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold font-headline text-primary tracking-tight mb-6">
            Geo Inspector
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Pinpoint API performance, measure latency from global regions, and analyze geolocation-specific responses with unparalleled clarity.
          </p>
          <Link href="/inspector">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-8 h-auto rounded-md shadow-lg transition-transform transform hover:scale-105">
              Launch Inspector <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features/Info Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            <InfoCard
              icon={<Route className="h-8 w-8 text-accent" />}
              title="How to Use Geo Inspector"
              description="Navigate the world of API testing with ease."
            >
              <ol className="list-decimal list-inside space-y-2 text-foreground/80 mt-3">
                <li>Go to the <Link href="/inspector" className="text-primary hover:underline">Inspector Tool</Link>.</li>
                <li><strong>Enter API Endpoint:</strong> Input the full URL of the API you want to test.</li>
                <li><strong>Select Locations:</strong> Choose one or more countries.</li>
                <li><strong>Inspect:</strong> Click the "Inspect Endpoints" button.</li>
                <li><strong>Analyze Results:</strong> Review API response (status, headers, body), latency, and AI-powered geo-clue analysis for each location.</li>
              </ol>
            </InfoCard>

            <InfoCard
              icon={<BarChart3 className="h-8 w-8 text-accent" />}
              title="Why Geo Inspector is Useful"
              description="Gain critical insights into your API's global footprint."
            >
              <ul className="list-disc list-inside space-y-2 text-foreground/80 mt-3">
                <li><strong>Measure Latency:</strong> Understand API response times from various global regions.</li>
                <li><strong>Verify Geo-Targeting:</strong> Confirm region-specific content delivery or restrictions.</li>
                <li><strong>Optimize CDN Performance:</strong> Check if your CDN effectively routes requests.</li>
                <li><strong>Enhance Security Analysis:</strong> Uncover unexpected server behaviors or third-party services with geographical implications.</li>
              </ul>
            </InfoCard>

            <InfoCard
              icon={<ServerCog className="h-8 w-8 text-accent" />}
              title="Achieving Accurate Insights"
              description="Understand the mechanics behind Geo Inspector."
            >
              <p className="text-foreground/80 mt-3">
                Geo Inspector simulates API requests from diverse geographical locations by (currently) routing them through mock proxy servers representative of the selected countries.
                It captures the complete HTTP response—status, headers, and body—while measuring round-trip time.
                An advanced Generative AI model then scrutinizes these responses for subtle patterns and clues indicating server geolocation or geographically-aware behaviors.
              </p>
            </InfoCard>
          </div>
        </div>
      </section>
      
      <section className="py-12 md:py-16 bg-card/50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-headline text-primary mb-4">Ready to Explore Your API's Global Reach?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Stop guessing and start knowing. Geo Inspector provides the data you need to optimize, secure, and understand your API from a global perspective.
            </p>
            <Link href="/inspector">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-8 h-auto rounded-md shadow-md transition-transform transform hover:scale-105">
              Start Inspecting Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Placeholder for illustrative image if desired */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 flex justify-center">
           <Image 
              src="https://placehold.co/800x400.png" 
              alt="Abstract representation of global network connections and data analysis"
              width={800}
              height={400}
              className="rounded-lg opacity-70 shadow-xl border border-border"
              data-ai-hint="global network analytics"
              priority
          />
        </div>
      </section>

      <footer className="w-full text-center py-8 mt-auto border-t border-border/30">
        <p className="text-sm text-muted-foreground">
          Geo Inspector &copy; {new Date().getFullYear()}. Powered by Next.js, ShadCN UI & GenAI.
        </p>
      </footer>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function InfoCard({ icon, title, description, children }: InfoCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <CardTitle className="text-2xl font-headline text-primary/90">{title}</CardTitle>
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm flex-grow">
        {children}
      </CardContent>
    </Card>
  );
}
