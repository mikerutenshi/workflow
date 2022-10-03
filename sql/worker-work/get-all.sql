select *,
(
  select json_agg(products) as products from
  (select * from worker_work_product
  where worker_work_id = worker_works.id) as products
) 
from worker_work as worker_works
