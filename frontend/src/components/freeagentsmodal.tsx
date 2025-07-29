import React, { useEffect, useState } from 'react';
import { SecureFetch, URLS } from '../constants';

type Player = {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  nfl_team: string;
};

type Props = {
  leagueId: number;
  onClose: () => void;
};

type SortKey = keyof Pick<Player, 'first_name' | 'last_name' | 'position' | 'nfl_team'>;

const FreeAgentsModal: React.FC<Props> = ({ leagueId, onClose }) => {
  const [freeAgents, setFreeAgents] = useState<Player[]>([]);

  // Filter states
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  const [sortKey, setSortKey] = useState<SortKey>('last_name');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchFreeAgents = async () => {
      const res = await SecureFetch(URLS.API_GET_FREE_AGENTS_BY_LEAGUE(leagueId));
      const data = await res.json();
      setFreeAgents(data);
    };

    fetchFreeAgents();
  }, [leagueId]);

  // Unique dropdown options
  const allTeams = Array.from(new Set(freeAgents.map(p => p.nfl_team))).sort();
  const allPositions = Array.from(new Set(freeAgents.map(p => p.position))).sort();

  // Filtering logic
  const filtered = freeAgents
    .filter(p =>
      p.first_name.toLowerCase().includes(firstNameFilter.toLowerCase()) &&
      p.last_name.toLowerCase().includes(lastNameFilter.toLowerCase()) &&
      (positionFilter ? p.position === positionFilter : true) &&
      (teamFilter ? p.nfl_team === teamFilter : true)
    )
    .sort((a, b) => {
      const aVal = a[sortKey].toLowerCase();
      const bVal = b[sortKey].toLowerCase();
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-content bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Free Agents</h2>
          <button onClick={onClose} className="text-red-600 hover:underline">Close</button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[80vh]">
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Filter by Position</label>
              <select
                className="border p-2 rounded"
                value={positionFilter}
                onChange={e => setPositionFilter(e.target.value)}
              >
                <option value="">All</option>
                {allPositions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Filter by NFL Team</label>
              <select
                className="border p-2 rounded"
                value={teamFilter}
                onChange={e => setTeamFilter(e.target.value)}
              >
                <option value="">All</option>
                {allTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>

          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 cursor-pointer" onClick={() => toggleSort('first_name')}>
                  First Name {sortKey === 'first_name' ? (sortAsc ? '↑' : '↓') : ''}
                  <input
                    className="mt-1 w-full text-sm border rounded p-1"
                    placeholder="Search..."
                    value={firstNameFilter}
                    onChange={e => setFirstNameFilter(e.target.value)}
                  />
                </th>
                <th className="p-2 cursor-pointer" onClick={() => toggleSort('last_name')}>
                  Last Name {sortKey === 'last_name' ? (sortAsc ? '↑' : '↓') : ''}
                  <input
                    className="mt-1 w-full text-sm border rounded p-1"
                    placeholder="Search..."
                    value={lastNameFilter}
                    onChange={e => setLastNameFilter(e.target.value)}
                  />
                </th>
                <th className="p-2 cursor-pointer" onClick={() => toggleSort('position')}>
                  Position {sortKey === 'position' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th className="p-2 cursor-pointer" onClick={() => toggleSort('nfl_team')}>
                  NFL Team {sortKey === 'nfl_team' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(player => (
                <tr key={player.id} className="hover:bg-gray-50 border-b">
                  <td className="p-2">{player.first_name}</td>
                  <td className="p-2">{player.last_name}</td>
                  <td className="p-2">{player.position}</td>
                  <td className="p-2">{player.nfl_team}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No free agents match the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FreeAgentsModal;
