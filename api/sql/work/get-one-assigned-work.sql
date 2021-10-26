with full_result as (
select assigned_work.id,
worker.name,
assigned_work.position,
assigned_work.quantity,
assigned_work.assigned_at,
work.product_quantity as quantity_initial,
(select sum(worker_work.quantity) from worker_work 
  where worker_work.assigned_work_id = assigned_work.id) as sum_done
from assigned_work
join worker on assigned_work.worker_id = worker.worker_id
join work on assigned_work.work_id = work.work_id
where assigned_work.work_id = ${id}
order by ${sort_by:raw} ${sort_direction:raw}
),
limited_result as (
select * from full_result
limit ${limit} offset ${offset}
)

select coalesce(json_agg(limited_result), '[]') as data,
(select ceil(count(*)::real / ${limit}::real) as total_page from full_result) from limited_result
