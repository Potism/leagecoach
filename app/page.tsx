import { SummonerSearch } from "@/components/summoner/SummonerSearch";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">LoL AI Coach</h1>
            <p className="text-muted-foreground">
              Get real-time AI coaching for your League of Legends games
            </p>
          </div>
          
          <SummonerSearch />
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Enter your Riot ID (including tag) to start</p>
            <p>Example: PlayerName#TAG</p>
          </div>
        </div>
      </div>
    </main>
  );
}