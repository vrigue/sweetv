UPDATE order_item_xref 
SET
    quantity = ?,
    notes = ?
WHERE 
    item_id = ?
AND
    order_id = ?