SELECT email
FROM view_privileges
INNER JOIN users ON users.id = view_privileges.user_id
WHERE name = 'admin' AND view_privileges.organization_id = $1;