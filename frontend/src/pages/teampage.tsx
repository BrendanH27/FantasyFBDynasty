import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { URLS, SecureFetch } from '../constants';
import { Link } from 'react-router-dom';

type Player = {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
};

type Team = {
  id: number;
  name: string;
  location: string;
  owner_id: number;
};

const TeamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      const teamRes = await SecureFetch(URLS.API_GET_TEAM_BY_ID(Number(id)));
      const teamData = await teamRes.json();
      setTeam(teamData);

      const playersRes = await SecureFetch(URLS.API_GET_TEAM_PLAYERS_BY_TEAM(Number(id)));
      const playersData = await playersRes.json();
      setPlayers(playersData);
    };

    fetchTeamData();
  }, [id]);

  if (!team) return <div>Loading team info...</div>;

  return (
    <div>
      <h1>{team.location} {team.name}</h1>
      <p><strong>Owner ID:</strong> {team.owner_id}</p>

      <h2>Roster</h2>
      <ul>
        {players.map(player => (
            <li key={player.id}>
            <Link to={`/player/${player.id}`}>
                {player.first_name} {player.last_name} – {player.position}
            </Link>
            </li>
        ))}
        </ul>
    </div>
  );
};

export default TeamPage;
