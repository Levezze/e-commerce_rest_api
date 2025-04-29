import { sql, Selectable, Insertable, Updateable } from "kysely";
import { Item as ItemTableInterface } from "../../../dtos/generated/item.js";
import { logger } from "../../../utils/logger.js";
import { Items } from "../../../database/types.js";
import { Item } from "../../../dtos/generated/item.js";
import { db } from '../../../database/index.js';
import { NotFoundError } from "../../../utils/errors.js";

type ItemFromDb = Selectable<ItemTableInterface>;
type ItemForDb = Insertable<ItemTableInterface>;

export const getAllItems = async (newItem: Item, admin: boolean) => {
  logger.debug(`Service: Attempting to fetch all items`);
  try {
    const QueryResult = await sql<Items>`
    SELECT *
    FROM items;
    `.execute(db);

    if (QueryResult.rows.length > 0) {
      throw new NotFoundError('No items found in database.');
    };

    if (admin) {
      const itemsDto = {

      }
    }
  }
}
