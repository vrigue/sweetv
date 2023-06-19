SELECT quantity, notes, address, alt, item_name
FROM order_item_xref
JOIN orders
	ON order_item_xref.order_id = orders.order_id
JOIN item
	ON order_item_xref.item_id = item.item_id
JOIN item_pic_xref
	ON item_pic_xref.item_id = item.item_id
JOIN picture
	on picture.picture_id = item_pic_xref.picture_id
WHERE
	orders.user_id = ?
AND
	order_item_xref.order_id = ?
AND
	order_item_xref.item_id = ?