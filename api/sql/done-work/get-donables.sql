with init_result as (
select
assigned_work.id,
assigned_work.work_id,
work.spk_no,
work.created_at,
product.article_no,
product_category.name as product_category_name,
assigned_work.notes,
assigned_work.position,
assigned_work.assigned_at,
assigned_work.quantity as quantity_assigned,
(assigned_work.quantity - (select coalesce(sum(worker_work.quantity)::integer, 0)
  from worker_work 
  where assigned_work_id = assigned_work.id)) as quantity_remaining
from assigned_work 
join work on  work.work_id = assigned_work.work_id
join product on product.product_id = work.product_id
join product_category on product.product_category_id = product_category.id
where assigned_work.worker_id = ${worker_id}
and assigned_work.position = ${position}
and assigned_work.assigned_at between ${start_date} and ${end_date}
and (spk_no::text like ${search_keyword} or article_no::text like ${search_keyword})
order by ${sort_by:raw} ${sort_direction:raw}
),
result as (
select * from init_result
where quantity_remaining != 0
),
limited_result as (
  select * from result
  limit ${limit} offset ${offset}
)

select json_agg(limited_result) as data,
(select count(*) from result) from limited_result
