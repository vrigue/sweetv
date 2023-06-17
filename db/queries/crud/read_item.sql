SELECT item_name, address, alt
FROM item_pic_xref as x
JOIN item
	ON x.item_id = item.item_id
JOIN picture 
	ON x.picture_id = picture.picture_id
WHERE   
    item_id = ?