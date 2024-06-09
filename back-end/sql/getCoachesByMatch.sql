select *
from _flms.coach_match
where match_id = $1 and club_name = $2 and event in ('participate')