with result as (
select 
worker_work.id,
worker_work.work_id,
worker_work.assigned_work_id,
worker_work.notes,
spk_no,
work.created_at,
assigned_work.assigned_at as assigned_at,
worker_work.done_at as done_at,
product.article_no,
product_category.name as product_category_name,
worker_work.position,
assigned_work.quantity as quantity_assigned,
worker_work.quantity as quantity_done
from worker_work join work on worker_work.work_id = work.work_id
join product on work.product_id = product.product_id
join product_category on product.product_category_id = product_category.id
join assigned_work on worker_work.assigned_work_id = assigned_work.id
where worker_work.worker_id = ${worker_id}
and ${date_filter_type:raw} between ${start_date} and ${end_date}
and (spk_no::text like ${search_keyword} or article_no::text like ${search_keyword})
${position_expression:raw}
order by ${sort_by:raw} ${sort_direction:raw}),

limited_result as (
select *, (select result.quantity_assigned - sum(quantity) from worker_work 
  where worker_work.assigned_work_id = result.assigned_work_id
  and worker_work.position = result.position) as quantity_remaining from result 
limit ${limit} offset ${offset})

select json_agg(limited_result) as data,
(select count(*) from result) from limited_result
