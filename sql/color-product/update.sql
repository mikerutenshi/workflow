update product set article_no = ${article_no},
product_category_id = ${product_category_id}, 
updated_at = now()
where product_id = ${product_id}
