select *,
(
  select json_agg(products) as products from
  (select * from assigned_work_product
  where assigned_work_id = assigned_works.id) as products
)
from assigned_work as assigned_works
