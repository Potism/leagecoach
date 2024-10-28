"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const REGIONS = [
  { value: "euw1", label: "EUW" },
  { value: "eun1", label: "EUNE" },
  { value: "na1", label: "NA" },
  { value: "kr", label: "KR" },
  { value: "br1", label: "BR" },
];

export function SummonerSearch() {
  const router = useRouter();
  const [summonerName, setSummonerName] = useState("");
  const [region, setRegion] = useState("euw1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summonerName.trim()) return;

    router.push(`/analysis?summoner=${encodeURIComponent(summonerName)}&region=${region}`);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summonerName">Summoner Name (with #tag)</Label>
          <Input
            id="summonerName"
            placeholder="Example: Riot Phreak#Riot"
            value={summonerName}
            onChange={(e) => setSummonerName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Start Coaching
        </Button>
      </form>
    </Card>
  );
}