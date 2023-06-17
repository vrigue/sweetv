DELETE
FROM order_item_xref 
WHERE 
    item_id = ?
AND
    order_id = ?