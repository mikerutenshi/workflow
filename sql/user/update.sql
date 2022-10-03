UPDATE app_user SET username = $2,
first_name = $3,
last_name = $4,
role = $5,
is_active = $6:raw
WHERE id = $1
