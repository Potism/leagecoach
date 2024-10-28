"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { getSummonerByName, getActiveGame, RiotAPIError } from "@/lib/riot-api";
import { LiveGameTracker } from "@/components/game-state/LiveGameTracker";
import { AICoach } from "@/components/coaching/AICoach";
import { BuildRecommendation } from "@/components/coaching/BuildRecommendation";

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summoner, setSummoner] = useState<any>(null);
  const [activeGame, setActiveGame] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const summonerParam = searchParams.get("summoner");
        const regionParam = searchParams.get("region");

        if (!summonerParam || !regionParam) {
          throw new Error("Missing summoner or region parameters");
        }

        console.log('Fetching data for:', summonerParam, 'in region:', regionParam);
        
        const summonerData = await getSummonerByName(regionParam, summonerParam);
        console.log('Summoner data:', summonerData);
        setSummoner(summonerData);

        try {
          const gameData = await getActiveGame(regionParam, summonerParam);
          console.log('Game data:', gameData);
          setActiveGame(gameData);
        } catch (gameError) {
          if (gameError instanceof RiotAPIError && gameError.status === 404) {
            // Not in game is okay, just set activeGame to null
            setActiveGame(null);
          } else {
            throw gameError;
          }
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        if (error instanceof RiotAPIError) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!summoner) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertDescription>No summoner data found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">
            {summoner.riotId?.gameName || summoner.name}
            {summoner.riotId?.tagLine && <span className="text-muted-foreground">#{summoner.riotId.tagLine}</span>}
          </h1>
          <div className="space-y-2">
            <p className="text-muted-foreground">Level: {summoner.summonerLevel}</p>
            <p className="text-muted-foreground">Region: {searchParams.get("region")?.toUpperCase()}</p>
          </div>
        </Card>

        <LiveGameTracker 
          region={searchParams.get("region") || ""} 
          summonerName={searchParams.get("summoner") || ""}
        />

        {activeGame && (
          <>
            <AICoach />
            <BuildRecommendation />
          </>
        )}
      </div>
    </div>
  );
}