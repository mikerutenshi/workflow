with full_result as (
select worker_work.id,
worker.name,
worker_work.position,
worker_work.quantity,
worker_work.done_at,
(assigned_work.quantity - (select sum(quantity) from worker_work where
  worker_work.assigned_work_id = assigned_work.id)) as quantity_remaining
from worker_work
join worker on worker_work.worker_id = worker.worker_id
join assigned_work on assigned_work.id = worker_work.assigned_work_id
where worker_work.work_id = ${id}
order by ${sort_by:raw} ${sort_direction:raw}
),
limited_result as (
select * from full_result
limit ${limit} offset ${offset}
)

select coalesce(json_agg(limited_result), '[]') as data,
(select ceil(count(*)::real / ${limit}::real) as total_page from full_result) from limited_result
