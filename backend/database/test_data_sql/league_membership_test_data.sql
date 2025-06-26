INSERT INTO league_memberships (user_id, league_id, role, team_id)
VALUES
  -- League One
  (1, 1, 'owner', 1), -- user1 owns League 1 and is on team 1
  (2, 1, 'member', 2), -- user2 is a member with team 2

  -- League Two
  (2, 2, 'owner', 3), -- user2 owns League 2 and is on team 3
  (1, 2, 'member', 4); -- user1 is a member with team 4