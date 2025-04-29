import { z } from "zod";
import { GemSize } from "../dtos/generated/gemSize.js";
import { GemShape } from "../dtos/generated/gemShape.js";
import { JewelryType } from "../dtos/generated/jewelryType.js";
import { Colors } from "../dtos/generated/colors.js";

export const newItemSchema = z.object({
  gem_size: z.nativeEnum(GemSize),
  gem_shape: z.nativeEnum(GemShape),
  gem_name: z.string(),
  jewelry_type: z.nativeEnum(JewelryType),
  price: z.number(),
  img_url: z.string().url(),
  is_featured: z.boolean(),
}).strict();

export const newRingSchema = newItemSchema.extend({
  ring_size: z.number(),
  ring_color: z.nativeEnum(Colors),
  ring_style: z.string(),
}).strict();

export const newNecklaceSchema = newItemSchema.extend({
  necklace_length: z.number(),
  necklace_color: z.nativeEnum(Colors),
  necklace_style: z.string(),
}).strict();

export const newEarringSchema = newItemSchema.extend({
  earring_size: z.number(),
  earring_color: z.nativeEnum(Colors),
  earring_style: z.string(),
}).strict();
