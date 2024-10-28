"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getBuildRecommendation } from "@/lib/openai";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BuildRecommendationProps {
  champion: string;
  enemyTeam: string[];
}

export function BuildRecommendation({ champion, enemyTeam }: BuildRecommendationProps) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);
      const newRecommendation = await getBuildRecommendation(champion, enemyTeam);
      setRecommendation(newRecommendation);
    } catch (error) {
      setError("Failed to get build recommendation. Please try again.");
      console.error("Failed to get build recommendation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (champion && enemyTeam.length > 0) {
      requestRecommendation();
    }
  }, [champion, enemyTeam]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Build Recommendation</h2>
        <Button onClick={requestRecommendation} disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Update Build
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {recommendation && (
        <div className="prose dark:prose-invert">
          <p>{recommendation}</p>
        </div>
      )}
    </Card>
  );
}