select product_id, article_no, created_at, updated_at, 
  product_category_id, name as product_category_name, (
  select json_agg(labour_costs) as labour_costs
  from (
    select id, name, cost from labour_cost where product_id = products.product_id
  ) as labour_costs
  ), ( 
    select json_agg(product_colors) as product_colors
    from (
      select id, name, created_at from color
      join color_product on id = color_product.color_id
      where color_product.product_id = products.product_id
      ) as product_colors
    ) 
from (product join product_category
  on product_category.id = product.product_category_id) as products;
