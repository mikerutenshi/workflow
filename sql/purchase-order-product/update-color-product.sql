update purchase_order_product
set product_id = ${product_id}, color_id = ${body_color_id}
where purchase_order_id = ${purchase_order_id}
and product_id = ${product_id}
and color_id = ${query_color_id}
