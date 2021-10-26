CREATE OR REPLACE VIEW worker_costs AS
SELECT 
  subQuery.worker_id,
  worker.name,
  sum(subQuery.worker_subtotal_cost) AS worker_total_cost,
  sum(subQuery.product_quantity) AS worker_total_quantity,
  subQuery.position
FROM
  (
    SELECT
      worker.worker_id,
      (
        CASE worker_work.position
        WHEN 'drawer' THEN
          work.product_quantity * product.drawing_cost
        WHEN 'sewer' THEN
          work.product_quantity * product.sewing_cost
        WHEN 'assembler' THEN
          work.product_quantity * product.assembling_cost
        WHEN 'sole_stitcher' THEN
          work.product_quantity * product.sole_stitching_cost
        WHEN 'lining_drawer' THEN
          work.product_quantity * product.lining_drawing_cost
        WHEN 'insole_stitcher' THEN
          work.product_quantity * product.insole_stitching_cost
        ELSE
          0
        END
      ) AS worker_subtotal_cost,
      work.product_quantity,
      worker_work.position
    FROM 
      work 
      JOIN worker_work ON work.work_id = worker_work.work_id
      JOIN worker ON worker.worker_id = worker_work.worker_id
      JOIN product ON work.product_id = product.product_id
    WHERE
      worker_work.created_at BETWEEN $1 AND $2
  ) subQuery
JOIN worker ON subQuery.worker_id = worker.worker_id
GROUP BY
  subQuery.worker_id,
  worker.name,
  subQuery.position
