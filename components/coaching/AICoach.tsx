"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getCoachingAdvice } from "@/lib/openai";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AICoachProps {
  gameState: any;
}

export function AICoach({ gameState }: AICoachProps) {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestAdvice = async () => {
    try {
      setLoading(true);
      setError(null);
      const newAdvice = await getCoachingAdvice(gameState);
      setAdvice(newAdvice);
    } catch (error) {
      setError("Failed to get coaching advice. Please try again.");
      console.error("Failed to get coaching advice:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameState) {
      requestAdvice();
    }
  }, [gameState]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">AI Coach</h2>
        <Button onClick={requestAdvice} disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Update Advice
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {advice && (
        <div className="prose dark:prose-invert">
          <p>{advice}</p>
        </div>
      )}
    </Card>
  );
}