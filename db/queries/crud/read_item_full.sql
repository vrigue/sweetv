SELECT item_id, item_name, ingredients, allergens, description, price, price_dozen
FROM item
WHERE 
    item_id = ?