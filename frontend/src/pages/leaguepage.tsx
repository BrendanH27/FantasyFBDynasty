import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { URLS, SecureFetch } from '../constants';

type Team = {
  id: number;
  name: string;
  location: string;
  owner_id: number;
};

const LeaguePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [leagueName, setLeagueName] = useState('');

  useEffect(() => {
    const fetchLeagueData = async () => {
      const leagueRes = await SecureFetch(URLS.API_GET_LEAGUE_BY_ID(Number(id)));
      const league = await leagueRes.json();
      setLeagueName(league.name);

      const teamRes = await SecureFetch(URLS.API_GET_TEAMS_IN_LEAGUE(Number(id)));
      const teamsData = await teamRes.json();
      setTeams(teamsData);
    };

    fetchLeagueData();
  }, [id]);

  return (
    <div>
      <h1>{leagueName}</h1>
      <h2>Teams</h2>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            <Link to={`/team/${team.id}`}>
              {team.location} {team.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaguePage;
