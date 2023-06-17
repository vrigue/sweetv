SELECT order_id
FROM orders
WHERE
	user_id = ?
AND
	date IS NULL