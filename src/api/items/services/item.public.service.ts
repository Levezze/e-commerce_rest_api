import { sql, Selectable, Insertable, Updateable } from "kysely";
import { Item as ItemTableInterface } from "../../../dtos/generated/item.js";
import { logger } from "../../../utils/logger.js";
import { Items } from "../../../database/types.js";
import { Item } from "../../../dtos/generated/item.js";
import { db } from '../../../database/index.js';
import { NotFoundError } from "../../../utils/errors.js";

type ItemFromDb = Selectable<ItemTableInterface>;
type ItemForDb = Insertable<ItemTableInterface>;

export const getAllItems = async (admin: boolean) => {
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
      const itemsDto = queryResult.rows.map(dbItem => {
        return {
          id: dbItem.id,
          itemName: dbItem.item_name,
          price: dbItem.price,
          inStock: dbItem.in_stock,
          imgUrl: dbItem.img_url,
          createdAt: dbItem.created_at,
          updatedAt: dbItem.updated_at,
          isFeatured: dbItem.is_featured,
          isHidden: dbItem.is_hidden,
        }
      });
      return itemsDto;
    };

    const itemsDto = queryResult.rows.map(dbItem => {
      return {
        id: dbItem.id,
        itemName: dbItem.item_name,
        price: dbItem.price,
        inStock: dbItem.in_stock,
        imgUrl: dbItem.img_url,
      }
    });
    return itemsDto;

  } catch (error) {
    if (error instanceof NotFoundError) {
      throw (error);
    }
    logger.error(`Service: Error fetching items from database}`, error);
    throw new Error('Database error while fetching items.');
  }
};
