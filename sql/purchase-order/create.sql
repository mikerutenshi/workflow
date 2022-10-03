insert into purchase_order(customer_id, date)
values (${customer_id}, ${date})
returning id
