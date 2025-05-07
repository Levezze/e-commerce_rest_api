import { sql, Selectable } from "kysely";
import { logger } from "../../../utils/logger.js";
import { Items as ItemTableInterface } from "../../../database/types.js";
import { db } from '../../../database/index.js';
import { NotFoundError } from "../../../utils/errors.js";
import type { components } from "../../../dtos/generated/openapi.js";
import { Media as MediaTableInterface } from "../../../database/types.js";
import camelcaseKeys from "camelcase-keys";

type ItemFromDb = Selectable<ItemTableInterface>;
type ItemResponse = components["schemas"]["ItemFetch"];
type MediaResponse = components['schemas']['Media']

export const getAllItems = async (admin: boolean, mediaType: string): Promise<ItemResponse> => {
  logger.debug(`Service: Attempting to fetch all items`);
  try {
    const queryResult = await sql<ItemFromDb>`
    SELECT *
    FROM items;
    `.execute(db);

    if (queryResult.rows.length === 0) {
      throw new NotFoundError(`No items found in database.`);
    };

    const dbItems = queryResult.rows.map(row =>
      camelcaseKeys(row, { deep: true })
    );

    if (admin) return dbItems;

    const itemsDto: ItemResponse = dbItems.map(dbItem => {
      return {
        id: dbItem.id,
        itemName: dbItem.item_name,
        price: dbItem.price,
        inStock: dbItem.in_stock,
        imgUrls: dbItem.img_urls,
      }
    });

    // Fetch all media records related to items in one query
    const allMediaQueryResult = await sql<MediaTableInterface>`
      SELECT *
      FROM media
      WHERE parent_type = ${mediaType};
    `.execute(db);

    if (allMediaQueryResult.rows.length === 0) {
      throw new NotFoundError(`No media found in database.`);
    };


    /*
    // Group media by parent_id
    const mediaGroupedByItemId = allMediaQueryResult.rows.reduce((acc, mediaRow) => {
      const itemId = mediaRow.parent_id;
      if (!acc[itemId]) {
        acc[itemId] = [];
      }
      acc[itemId].push({
        id: mediaRow.id,
        itemId: itemId,
        url: mediaRow.url,
        // Add additional properties if necessary
      });
      return acc;
    }, {});
    */

    /*
    In this code:

    A single query is made to fetch all media for items.
    The results are then grouped by parent_id using the reduce method to create a map where each key is an item_id and each value is an array of media objects.
    When mapping the items to their return format, the associated media array is included based on the item_id.
    By doing this, you're reducing the number of database queries, which will improve performance, especially when dealing with a large number of items.

    Remember that if the media table is large, this approach might still be inefficient, as it loads all media records into memory. If performance becomes an issue, consider alternative strategies such as paginating the items and fetching media in batches, or using a more complex SQL query to fetch all the necessary information in a joined format.
    */

    // Now map the items with their associated media
    return queryResult.rows.map(dbItem => {
      const media = mediaGroupedByItemId[dbItem.id] || [];

      return {
        id: dbItem.id,
        itemName: dbItem.item_name,
        price: dbItem.price,
        inStock: dbItem.in_stock,
        createdAt: dbItem.created_at,
        updatedAt: dbItem.updated_at,
        isFeatured: dbItem.is_featured,
        isHidden: dbItem.is_hidden,
        // Include additional properties from dbItem if necessary
        media: media,
      };
    });

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