insert into worker_work(
  work_id, worker_id, position, quantity, assigned_work_id, notes, done_at)
values (
  ${work_id}, ${worker_id}, ${position},
  ${quantity}, ${assigned_work_id}, ${notes}, ${done_at})
