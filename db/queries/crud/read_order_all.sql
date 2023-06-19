SELECT orders.order_id, item.item_id, item_name, quantity, price, price_dozen, notes
FROM order_item_xref as x
JOIN item
	ON x.item_id = item.item_id
JOIN orders
	ON x.order_id = orders.order_id
WHERE
	user_id = ?
AND
	date IS NULL