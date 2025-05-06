import { sql, Selectable } from "kysely";
import { logger } from "../../../utils/logger.js";
import { Items as ItemTableInterface } from "../../../database/types.js";
import { db } from '../../../database/index.js';
import { NotFoundError } from "../../../utils/errors.js";
import type { components } from "../../../dtos/generated/openapi.js";
import camelcaseKeys from "camelcase-keys";

type ItemFromDb = Selectable<ItemTableInterface>;
type ItemResponse = components["schemas"]["ItemFetch"];

export const getAllItems = async (admin: boolean): Promise<ItemResponse> => {
  logger.debug(`Service: Attempting to fetch all items`);
  try {
    const queryResult = await sql<ItemFromDb>`
    SELECT *
    FROM items;
    `.execute(db);

    if (queryResult.rows.length === 0) {
      throw new NotFoundError('No items found in database.');
    };

    if (admin) {
      return queryResult.rows.map(row => 
        camelcaseKeys(row, { deep: true })
      );
    };

    return queryResult.rows.map(dbItem => {
      return {
        id: dbItem.id,
        itemName: dbItem.item_name,
        price: dbItem.price,
        inStock: dbItem.in_stock,
        imgUrls: dbItem.img_urls,
      }
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw (error);
    }
    logger.error(`Service: Error fetching items from database}`, error);
    throw new Error('Database error while fetching items.');
  }
};

export const getItemById = async (id: number, admin: boolean) => {
  logger.debug(`Service: Getting item by ID ${id}`);
  try {
    const queryResult = await sql<ItemFromDb>`
    SELECT * FROM items
    WHERE id = ${id};
    `.execute(db);

    if (queryResult.rows.length === 0) {
      throw new NotFoundError(`Item with ID ${id} not found in database.`);
    };
    const dbItem = queryResult.rows[0];

    if (admin) return camelcaseKeys(queryResult.rows, { deep: true });
    return {
      id: dbItem.id,
      itemName: dbItem.item_name,
      price: dbItem.price,
      inStock: dbItem.in_stock,
      imgUrls: dbItem.img_urls,
    };
  } catch (error) {
    logger.error(`Service: Error fetching item by ID ${id}`);
    throw new Error('Database error while fetching item.');
  }
}