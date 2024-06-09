UPDATE _flms.player_match
SET player_id = $1
WHERE match_id = $2 and club_name = $3 and event = $4
LIMIT 1;
