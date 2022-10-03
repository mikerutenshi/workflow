with result as (
select 
assigned_work.id,
assigned_work.work_id,
work.spk_no,
work.created_at,
assigned_work.assigned_at,
assigned_work.notes,
product.article_no,
product_category.name as product_category_name,
assigned_work.position,
work.product_quantity as quantity_initial,
assigned_work.quantity as quantity_assigned,
(select sum(worker_work.quantity) from worker_work 
  where worker_work.assigned_work_id = assigned_work.id) as sum_done
from assigned_work join work on assigned_work.work_id = work.work_id
join product on work.product_id = product.product_id
join product_category on product.product_category_id = product_category.id
where assigned_work.worker_id = ${worker_id}
and ${date_filter_type:raw} between ${start_date} and ${end_date}
and (spk_no::text like ${search_keyword} or article_no::text like ${search_keyword})
${position_expression:raw}
order by ${sort_by:raw} ${sort_direction:raw}),

limited_result as (
select *, (select result.quantity_initial - sum(quantity) from assigned_work 
  where assigned_work.work_id = result.work_id
  and assigned_work.position = result.position) as quantity_remaining from result 
limit ${limit} offset ${offset})

select json_agg(limited_result) as data,
(select count(*) from result) from limited_result
