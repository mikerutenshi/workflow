with init_result as (
select
work_id,
spk_no,
article_no,
product_category.name as product_category_name,
work.created_at,
work.product_quantity as quantity_initial,
work.notes,
(work.product_quantity - (select coalesce(sum(assigned_work.quantity)::integer, 0)
  from assigned_work 
  where position = ${position}
  and assigned_work.work_id = work.work_id)) as quantity_remaining
from work 
join product on work.product_id = product.product_id
join product_category on product.product_category_id = product_category.id
where work.created_at between ${start_date} and ${end_date}
and (spk_no::text like ${search_keyword} or article_no::text like ${search_keyword})
and ${price_column:raw} != 0
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
