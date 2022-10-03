SELECT
sum(sub.product_quantity)
FROM (
  SELECT
    spk_no,
    product_quantity
  FROM
    work
  JOIN
    worker_work
  ON
    work.work_id = worker_work.work_id
  WHERE worker_work.created_at BETWEEN $1 AND $2
  GROUP BY spk_no, product_quantity) sub
