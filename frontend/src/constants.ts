export const BASE_API_URL = 'http://localhost:3001'; // Needs to be moved to a .env

type FetchOptions = RequestInit & {
  showError?: boolean;
};

export const SecureFetch = async (
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> => {
  try {
    const response = await fetch(`${endpoint}`, {
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({
        error: 'Unknown error',
        statusCode: response.status,
      }));

      if (options.showError !== false) {
        sessionStorage.setItem(
          'errorDetails',
          JSON.stringify({
            error: data.error || 'Unknown error',
            statusCode: response.status,
            url: endpoint,
            timestamp: new Date().toISOString(),
          })
        );
        console.error('API Error:', data);
        window.location.replace('/error');
      }

      throw new Error(data.error || 'API request failed');
    }

    console.log('API Response:', response);
    return response;
  } catch (err) {
    console.error('Fetch failed:', err);
    throw err;
  }
};

//ROUTES MIGHT BE WRONG RIGHT NOW
export const URLS = {
  BASE_API_URL,

  // League routes
  API_GET_LEAGUES: `${BASE_API_URL}/leagues`,
  API_GET_LEAGUE_BY_ID: (id: number) => `${BASE_API_URL}/leagues/${id}`,
  API_CREATE_LEAGUE: `${BASE_API_URL}/leagues`,

  // User routes
  API_GET_USERS: `${BASE_API_URL}/users`,
  API_GET_USER_BY_ID: (id: number) => `${BASE_API_URL}/users/${id}`,

  // Player routes
  API_GET_PLAYERS: `${BASE_API_URL}/players`,
  API_GET_PLAYERS_BY_TEAM: (team: string) => `${BASE_API_URL}/players/nfl/${team}`,
  API_GET_PLAYERS_BY_POSITION: (position: string) => `${BASE_API_URL}/players/position/${position}`,
  API_GET_PLAYERS_BY_LAST_NAME: (name: string) => `${BASE_API_URL}/players/name/${name}`,
  API_GET_PLAYER_BY_ID: (playerId: number) => `${BASE_API_URL}/players/${playerId}`,

  // Draft picks
  API_GET_DRAFT_PICKS: `${BASE_API_URL}/draft_picks`,
  API_GET_DRAFT_PICKS_BY_LEAGUE: (leagueId: number) => `${BASE_API_URL}/draft_picks/league/${leagueId}`,

  // League Memberships
  API_GET_MEMBERSHIPS: `${BASE_API_URL}/memberships`,
  API_GET_MEMBERSHIPS_BY_LEAGUE: (leagueId: number) => `${BASE_API_URL}/memberships/league/${leagueId}`,

  // Team Players
  API_GET_TEAM_PLAYERS: `${BASE_API_URL}/team_players`,
  API_GET_TEAM_PLAYERS_BY_TEAM: (teamId: number) => `${BASE_API_URL}/team_players/team/${teamId}`,

  // Teams
  API_GET_TEAMS: `${BASE_API_URL}/teams`,
  API_GET_TEAM_BY_ID: (teamId: number) => `${BASE_API_URL}/teams/${teamId}`,
  API_GET_TEAMS_IN_LEAGUE: (leagueId: number) => `${BASE_API_URL}/teams/league/${leagueId}`,
};
