update "Users"
set balance=balance+"SQ".sum/10
from (select "Users".id, sum(prize) from "Users" join "Contests" C on "Users".id = C."userId"
      where "createdAt" between '2019-12-25' and '2020-01-14'
      group by "Users".id) as "SQ"
where "Users".id="SQ".id