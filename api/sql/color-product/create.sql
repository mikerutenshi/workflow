insert into product(article_no, product_category_id) values (
  ${article_no}, ${product_category_id}) 
returning product_id
