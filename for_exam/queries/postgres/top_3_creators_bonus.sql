update "Users"
set balance=balance+10
from (select id from "Users"
      where role='creator' and rating>0
      order by rating desc
      LIMIT 3) as "SQ"
where "Users".id="SQ".id;
