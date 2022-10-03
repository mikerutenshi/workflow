select work_purchase_order_product.product_id,
work_purchase_order_product.color_id,
work_purchase_order_product.size_id,
work.spk_no,
work.work_id
from work join work_purchase_order_product
on work.work_id = work_purchase_order_product.work_id
where work_purchase_order_product.product_id = ${product_id}
and color_id = ${color_id}
and purchase_order_id = ${purchase_order_id}
