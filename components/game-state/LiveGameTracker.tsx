"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { getActiveGame, RiotAPIError } from "@/lib/riot-api";

interface LiveGameTrackerProps {
  region: string;
  summonerName: string;
}

export function LiveGameTracker({ region, summonerName }: LiveGameTrackerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameData, setGameData] = useState<any>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function checkGameStatus() {
      try {
        const data = await getActiveGame(region, summonerName);
        setGameData(data);
        setError(null);
      } catch (error) {
        if (error instanceof RiotAPIError) {
          if (error.status === 404) {
            setError("Not currently in game");
          } else {
            setError(error.message);
          }
        } else {
          setError("Failed to fetch game data");
        }
        setGameData(null);
      } finally {
        setLoading(false);
      }
    }

    checkGameStatus();
    interval = setInterval(checkGameStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [region, summonerName]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Checking game status...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!gameData) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Live Game</h2>
      <div className="space-y-2">
        <p>Game Mode: {gameData.gameMode}</p>
        <p>Game Type: {gameData.gameType}</p>
        <p>Game Length: {Math.floor(gameData.gameLength / 60)} minutes</p>
      </div>
    </Card>
  );
}