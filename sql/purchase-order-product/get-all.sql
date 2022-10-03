select * from purchase_order_product
join size on size_id = size.id
where purchase_order_id = ${purchase_order_id}
and product_id = ${product_id}
and color_id = ${color_id}
