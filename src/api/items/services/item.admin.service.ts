import { sql, Selectable, Insertable, Updateable } from "kysely";
import { Item as ItemTableInterface } from "../../../dtos/generated/item.js";
import { NewItemInput } from "../../../dtos/generated/newItemInput.js";
import { logger } from "../../../utils/logger.js";
import { Items } from "../../../database/types.js";
import { db } from '../../../database/index.js';
import { ConflictError } from "../../../utils/errors.js";

type ItemFromDb = Selectable<ItemTableInterface>;
type ItemForDb = Insertable<ItemTableInterface>;

export const createNewItem = async (newItem: NewItemInput) => {
  logger.debug(`Service: Attempting to create new item: ${newItem.gem_name} ${newItem.jewelry_type}`);
  try {
    const itemName = `${newItem.gem_name} ${newItem.jewelry_type}`;

    const itemQueryResult = await sql<Items>`
    SELECT item_name
    FROM items
    WHERE item_name = ${itemName};
    `.execute(db);

    if (itemQueryResult.rows.length > 0) {
      throw new ConflictError(`Item with name '${itemName}' already exists.`);
    };

    const newItemQueryResult = await sql<NewItemInput>`
    INSERT INTO items (category, item_name, description, price, img_urls)
    VALUES (${newItem.category}, ${newItem.item_name}, ${newItem.description}, ${newItem.price}, ${newItem.img_urls})
    RETURNING id, category, item_name, description, price, img_urls;
    `.execute(db);

  } catch (error) {
    throw error;
  }
}
