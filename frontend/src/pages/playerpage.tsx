import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { URLS, SecureFetch } from '../constants';

type Player = {
  id: number;
  first_name: string;
  last_name: string;
  nflverse_id: string;
  position: string;
  nfl_team: string;
  age: number;
};

const PlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await SecureFetch(URLS.API_GET_PLAYER_BY_ID(Number(id)));
        const data = await res.json();
        setPlayer(data);
      } catch (err) {
        console.error('Failed to fetch player:', err);
      }
    };

    fetchPlayer();
  }, [id]);

  if (!player) return <div>Loading player info...</div>;

  return (
    <div>
      <h1>{player.first_name} {player.last_name}</h1>
      <p><strong>Position:</strong> {player.position}</p>
      <p><strong>NFL Team:</strong> {player.nfl_team}</p>
      <p><strong>Age:</strong> {player.age}</p>
      <p><strong>NFLVerse ID:</strong> {player.nflverse_id}</p>
    </div>
  );
};

export default PlayerPage;
