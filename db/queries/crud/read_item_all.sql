SELECT item_name, price, address, alt, slide_order
FROM item_pic_xref as x
JOIN item
	ON x.item_id = item.item_id
JOIN picture 
	ON x.picture_id = picture.picture_id
ORDER BY slide_order DESC