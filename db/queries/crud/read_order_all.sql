SELECT item_name, price, price_dozen, quantity
FROM order_item_xref as x
JOIN item
	ON x.item_id = item.item_id
JOIN orders
	ON x.order_id = orders.order_id
WHERE
	user_id = ?
AND
	date IS NULL