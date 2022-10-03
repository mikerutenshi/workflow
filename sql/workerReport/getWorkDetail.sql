SELECT 
  work.spk_no,
  product.article_no,
  worker_work.position,
  (
    CASE worker_work.position
      WHEN 'drawer' THEN product.drawing_cost
      WHEN 'sewer' THEN product.sewing_cost
      WHEN 'assembler' THEN product.assembling_cost
      WHEN 'sole_stitcher' THEN product.sole_stitching_cost
      WHEN 'lining_drawer' THEN product.lining_drawing_cost
      WHEN 'insole_stitcher' THEN product.insole_stitching_cost
      ELSE 0
    END
  ) AS unit_cost,
  work.product_quantity,
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
  worker_work.created_at
FROM 
  work 
  JOIN worker_work ON work.work_id = worker_work.work_id
  JOIN worker ON worker.worker_id = worker_work.worker_id
  JOIN product ON work.product_id = product.product_id
WHERE
  worker.worker_id = $1 AND
  worker_work.position = $4 AND
  worker_work.created_at BETWEEN $2 AND $3
ORDER BY
  worker_work.position,
  work.spk_no
