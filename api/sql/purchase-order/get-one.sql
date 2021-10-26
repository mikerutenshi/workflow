select *,
( select json_agg(products) as products from
  ( select * from purchase_order_product 
    where purchase_order_id = m_purchase_order.id) as products
)
from ( 
  select purchase_order.id, date, purchase_order.created_at, name from purchase_order 
  join customer on purchase_order.customer_id = customer.id
  where purchase_order.id = ${id}
) as m_purchase_order
