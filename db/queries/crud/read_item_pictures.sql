SELECT item.item_id, address, alt, slide_order
FROM picture
JOIN item_pic_xref
	ON picture.picture_id = item_pic_xref.picture_id
JOIN item
	ON item_pic_xref.item_id = item.item_id
WHERE 
    item.item_id = ?
ORDER BY slide_order