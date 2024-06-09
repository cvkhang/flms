SELECT 
  club_name,
  player_id,
  "event",
  event_half,
  event_time
FROM _flms.player_match
WHERE match_id = $1
ORDER BY event_half asc,event_time asc,club_name,"event",player_id;
