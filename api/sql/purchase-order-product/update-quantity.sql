update purchase_order_product
set quantity = ${quantity}
where purchase_order_id = ${purchase_order_id}
and product_id = ${product_id}
and color_id = ${color_id}
and size_id = ${size_id}
