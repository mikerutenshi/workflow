insert into assigned_work(work_id, worker_id, position)
values (${work_id}, ${worker_id}, ${position})
returning id;
