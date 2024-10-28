const RIOT_API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;

const REGION_ROUTES = {
  na1: "americas",
  euw1: "europe",
  eun1: "europe",
  kr: "asia",
  br1: "americas",
};

const BASE_URLS = {
  na1: "https://na1.api.riotgames.com",
  euw1: "https://euw1.api.riotgames.com",
  eun1: "https://eun1.api.riotgames.com",
  kr: "https://kr.api.riotgames.com",
  br1: "https://br1.api.riotgames.com",
};

export class RiotAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'RiotAPIError';
  }
}

function parseRiotId(summonerName: string) {
  // Remove any whitespace and split by #
  const [gameName, tagLine] = summonerName.trim().split('#');
  if (!gameName || !tagLine) {
    throw new RiotAPIError('Invalid Riot ID format. Please use format: gameName#tagLine');
  }
  return { 
    gameName: gameName.trim(), 
    tagLine: tagLine.trim() 
  };
}

export async function getSummonerByName(region: string, summonerName: string) {
  try {
    if (!RIOT_API_KEY) {
      throw new RiotAPIError('Riot API key is not configured');
    }

    const baseUrl = BASE_URLS[region as keyof typeof BASE_URLS];
    const routingValue = REGION_ROUTES[region as keyof typeof REGION_ROUTES];
    
    if (!baseUrl || !routingValue) {
      throw new RiotAPIError(`Unsupported region: ${region}`);
    }

    const { gameName, tagLine } = parseRiotId(summonerName);

    // First get account by Riot ID using the Account-V1 API
    const accountUrl = `https://${routingValue}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
    console.log('Fetching account:', accountUrl);
    
    const accountResponse = await fetch(
      `${accountUrl}?api_key=${RIOT_API_KEY}`
    );

    if (!accountResponse.ok) {
      const status = accountResponse.status;
      if (status === 404) {
        throw new RiotAPIError('Account not found. Please check your Riot ID and region.', status);
      } else if (status === 403) {
        throw new RiotAPIError('Invalid API key. Please check your configuration.', status);
      } else {
        throw new RiotAPIError(`API request failed with status ${status}`, status);
      }
    }

    const accountData = await accountResponse.json();
    console.log('Account data:', accountData);

    // Then get summoner by PUUID
    const summonerUrl = `${baseUrl}/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}`;
    console.log('Fetching summoner:', summonerUrl);
    
    const summonerResponse = await fetch(
      `${summonerUrl}?api_key=${RIOT_API_KEY}`
    );

    if (!summonerResponse.ok) {
      throw new RiotAPIError(`Failed to fetch summoner data (${summonerResponse.status})`);
    }

    const summonerData = await summonerResponse.json();
    return {
      ...summonerData,
      riotId: {
        gameName,
        tagLine,
        puuid: accountData.puuid
      }
    };
  } catch (error) {
    console.error('Error in getSummonerByName:', error);
    if (error instanceof RiotAPIError) {
      throw error;
    }
    throw new RiotAPIError('Failed to fetch summoner data');
  }
}

export async function getActiveGame(region: string, summonerName: string) {
  try {
    const summoner = await getSummonerByName(region, summonerName);
    if (!summoner) {
      throw new RiotAPIError('Summoner not found');
    }

    const baseUrl = BASE_URLS[region as keyof typeof BASE_URLS];
    const response = await fetch(
      `${baseUrl}/lol/spectator/v4/active-games/by-summoner/${summoner.id}?api_key=${RIOT_API_KEY}`
    );

    if (!response.ok) {
      const status = response.status;
      if (status === 404) {
        throw new RiotAPIError('Summoner is not in an active game', status);
      }
      throw new RiotAPIError(`Failed to fetch active game (${status})`, status);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getActiveGame:', error);
    if (error instanceof RiotAPIError) {
      throw error;
    }
    throw new RiotAPIError('Failed to fetch active game data');
  }
}