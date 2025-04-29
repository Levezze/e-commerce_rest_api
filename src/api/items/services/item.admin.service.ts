import { sql, Selectable, Insertable, Updateable } from "kysely";
import { Item as ItemTableInterface } from "../../dtos/item.js";
import { NewItemInput } from "../../dtos/newItemInput.js";
import { logger } from "../../utils/logger.js";
import { Items } from "../../database/types.js";
import { db } from '../../database/index.js';

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
      
    }
  }
}
