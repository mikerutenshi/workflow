with list as (
select *, (unit_cost * quantity) as sub_total_cost from
  (
    select
    worker_work.id,
    work.spk_no,
    work.created_at,
    product.article_no,
    product_category.name as product_category_name,
    worker_work.position,
    worker_work.quantity,
    worker_work.done_at,
    (
      CASE worker_work.position
      WHEN 'drawer' THEN
        product.drawing_cost
      WHEN 'sewer' THEN
        product.sewing_cost
      WHEN 'assembler' THEN
        product.assembling_cost
      WHEN 'sole_stitcher' THEN
        product.sole_stitching_cost
      WHEN 'lining_drawer' THEN
        product.lining_drawing_cost
      WHEN 'insole_stitcher' THEN
        product.insole_stitching_cost
      ELSE
        0
      END
    ) as unit_cost
    from worker_work
    join work on worker_work.work_id = work.work_id
    join product on work.product_id = product.product_id
    join product_category on product.product_category_id = product_category.id
    where worker_work.worker_id = ${worker_id}
    and worker_work.done_at between ${start_date} and ${end_date}
    ${position_expression:raw}
    order by ${sort_by:raw} ${sort_direction:raw}
  ) as initial_result
),
limited_list as (
select * from list limit ${limit} offset ${offset}
)

select coalesce(sum(list.quantity)::integer, 0) as total_quantity,
coalesce(sum(list.sub_total_cost)::integer, 0) as total_cost,
json_agg(list) as data,
(select coalesce(json_agg(limited_list), '[]') from limited_list) as data,
ceil(count(*)::real / ${limit}::real) as total_page
from list
