with salary_list as (
select 
worker.worker_id,
worker.name,
worker.position,
(sum
(
  CASE worker_work.position
  WHEN 'drawer' THEN
    worker_work.quantity * product.drawing_cost
  WHEN 'sewer' THEN
    worker_work.quantity * product.sewing_cost
  WHEN 'assembler' THEN
    worker_work.quantity * product.assembling_cost
  WHEN 'sole_stitcher' THEN
    worker_work.quantity * product.sole_stitching_cost
  WHEN 'lining_drawer' THEN
    worker_work.quantity * product.lining_drawing_cost
  WHEN 'insole_stitcher' THEN
    worker_work.quantity * product.insole_stitching_cost
  ELSE
    0
  END
)) as worker_total_cost,
(sum(worker_work.quantity)) as worker_total_quantity
from worker_work
join work on worker_work.work_id = work.work_id
join product on work.product_id = product.product_id
join worker on worker_work.worker_id = worker.worker_id
where worker_work.done_at between ${start_date} and ${end_date}
group by worker.name, worker.worker_id, worker.position
order by ${sort_by:raw} ${sort_direction:raw}
),
quantities as (
select position, sum(quantity) as quantity from worker_work 
where worker_work.done_at between ${start_date} and ${end_date}
group by position
),
limited_salary_list as (
select * from salary_list limit ${limit} offset ${offset}
)

select 
(select coalesce(json_agg(quantities), '[]') from quantities) as quantities,
(coalesce(sum(worker_total_cost)::integer, 0)) as total_cost,
(select coalesce(json_agg(limited_salary_list), '[]') from limited_salary_list) as list,
ceil(count(*)::real / ${limit}::real) as total_page
from salary_list
