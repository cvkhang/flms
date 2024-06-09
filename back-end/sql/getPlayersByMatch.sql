select *
from _flms.player_match
where match_id = $1 and club_name = $2 and event in ('start','sub')
order by player_id asc, "event" asc