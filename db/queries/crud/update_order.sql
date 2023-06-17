UPDATE orders
SET
    date = ?
WHERE 
    order_id = ?
AND
    user_id = ?