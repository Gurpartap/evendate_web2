create or replace function get_organization_search_score(int) returns table(score float) as
$$
begin
  return query
  select t.score::float
  from temp_organization_ratings as t
  where t.organization_id = $1;
  exception when undefined_table then
  return query select 0::float;
end
$$ language plpgsql stable;


create or replace function get_event_search_score(int) returns table(score float) as
$$
begin
  return query
  select t.score::float
  from temp_event_ratings as t
  where t.event_id = $1;
  exception when undefined_table then
  return query select 0::float;
end
$$ language plpgsql stable;
