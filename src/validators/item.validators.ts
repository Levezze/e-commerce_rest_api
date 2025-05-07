import { z } from "zod";
import type { components } from "../dtos/generated/openapi.js";

export const ItemMediaTypeEnum = z.enum(["image", "video"]);
export const ItemCategoryEnum = z.enum(["genericItem", "moduleItem", "accessoryItem"]);
export const ItemTypeEnum = z.enum(["basic", "auto", "general"]);
export const ItemFrameColorEnum = z.enum(["white", "black", "silver"]);
export const ItemMaterialEnum = z.enum([
  "whitePolymer", 
  "blackPolymer", 
  "woodOak", 
  "woodMaple", 
  "woodPine"
]);
export const ItemSizeEnum = z.enum(["small", "medium", "large"]);
export const ItemControllerEnum = z.enum(["remote", "app"]);

const mediaDtoSchema = z.object({
  id: z.number().int(),
  itemId: z.number().int(),
  url: z.string().url(),
  type: ItemMediaTypeEnum,
  order: z.number().int(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const itemInputSchema = z.object({
  itemName: z.string(),
  description: z.string().optional(),
  media: mediaDtoSchema.optional(),
  price: z.number(),
  itemCategory: ItemCategoryEnum,
  itemType: ItemTypeEnum,
  inStock: z.boolean(),
  frameColor: ItemFrameColorEnum.optional(),
  surfaceStyle: z.string().optional(),
  surfaceMaterial: ItemMaterialEnum.optional(),
  isFeatured: z.boolean().optional(),
  isHidden: z.boolean().optional(),
  size: ItemSizeEnum.optional(),
  color: z.string().optional(),
  style: z.string().optional(),
  controller: ItemControllerEnum.optional(),
}).strict();
