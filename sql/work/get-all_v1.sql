with full_result as (
select
source.work_id,
source.spk_no,
source.created_at,
source.product_quantity,
source.notes,
source.product_id,
source.article_no,
source.product_category_id,
source.product_category_name,
source.drawing_cost,
source.lining_drawing_cost,
source.sewing_cost,
source.assembling_cost,
source.sole_stitching_cost,
source.insole_stitching_cost,
(select coalesce(json_agg(wip), '[]') from (select position from assigned_work where assigned_work.work_id = source.work_id group by position) as wip) as work_in_progress,
(select coalesce(json_agg(wd), '[]') from (select position, sum(quantity) from worker_work where worker_work.work_id = source.work_id group by position) as wd) as work_done
from
( 
  select
  work.work_id,
  work.spk_no,
  work.created_at,
  work.product_quantity,
  work.notes,
  product.product_id,
  product.article_no,
  product.drawing_cost,
  product.lining_drawing_cost,
  product.sewing_cost,
  product.assembling_cost,
  product.sole_stitching_cost,
  product.insole_stitching_cost,
  product_category.id as product_category_id,
  product_category.name as product_category_name
  from work
  join product on product.product_id = work.product_id
  join product_category on product.product_category_id = product_category.id
  where work.created_at between ${start_date} and ${end_date}
  and (work.spk_no::text like ${search_keyword} or product.article_no::text like ${search_keyword})
  order by ${sort_by:raw} ${sort_direction:raw}
) as source
),
limited_result as (
select * from full_result
limit ${limit} offset ${offset}
)

select coalesce(json_agg(limited_result), '[]') as data,
(select ceil(count(*)::real / ${limit}::real) from full_result) as total_page
from limited_result 
