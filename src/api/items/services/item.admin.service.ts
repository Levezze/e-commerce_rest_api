import { sql } from "kysely";
import { db } from '../../../database/index.js';
import { Items } from "../../../database/types.js";
import { logger } from "../../../utils/logger.js";
import { ConflictError } from "../../../utils/errors.js";
import type { components } from "../../../dtos/generated/openapi.js";

type NewItemInput = components["schemas"]["ItemInput"];

export const createNewItem = async (newItem: NewItemInput) => {
  logger.debug(`Service: Attempting to create new item`);
  try {
    const itemName = `${newItem.item_name}`;

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
};


