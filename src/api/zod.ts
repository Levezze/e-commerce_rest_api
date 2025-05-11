import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const UserAddress = z
  .object({
    street: z.string(),
    city: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string().min(10).max(15).optional(),
  })
  .passthrough();
const UserInputBase = z
  .object({
    email: z.string().max(100).email(),
    username: z.string().min(3).max(20),
    address: UserAddress,
  })
  .partial();
const RegisterUser = UserInputBase.and(
  z
    .object({ username: z.string(), password: z.string().min(8) })
    .partial()
    .passthrough()
);
const UserSelf = z
  .object({
    id: z.number().int(),
    email: z.string().email(),
    username: z.string(),
    address: UserAddress.optional(),
    lastLogin: z.string().datetime({ offset: true }).nullish(),
    createdAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const UserWithToken = z
  .object({ user: UserSelf, token: z.string() })
  .passthrough();
const ErrorResponse = z
  .object({ message: z.string(), code: z.number().int() })
  .passthrough();
const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const UpdateMe = z
  .object({
    username: z.string(),
    email: z.string().email(),
    address: UserAddress,
  })
  .partial()
  .passthrough();
const UserRole = z.enum(["customer", "manager", "admin"]);
const UserAdmin = UserSelf.and(
  z
    .object({
      userRole: UserRole,
      isActive: z.boolean(),
      isVerified: z.boolean(),
      passwordResetToken: z.string().nullable(),
    })
    .partial()
    .passthrough()
);
const UpdateUser = UpdateMe.and(
  z
    .object({
      password: z.string().min(8),
      userRole: UserRole,
      isActive: z.boolean(),
    })
    .partial()
    .passthrough()
);
const Media = z
  .object({
    id: z.number().int(),
    itemId: z.number().int(),
    url: z.string().url(),
    type: z.string(),
    order: z.number().int(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const ItemCategory = z.enum(["generic", "module", "accessory", "bundle"]);
const ItemType = z.enum(["manual", "auto", "general"]);
const FrameColor = z.enum(["white", "black", "silver"]);
const BaseMaterial = z.enum([
  "whitePolymer",
  "blackPolymer",
  "woodOak",
  "woodMaple",
  "woodPine",
]);
const ItemBase = z
  .object({
    id: z.number().int().optional(),
    kind: z.string().optional(),
    itemName: z.string(),
    description: z.string().optional(),
    price: z.number(),
    itemMedia: z.array(Media).optional(),
    itemCategory: ItemCategory,
    itemType: ItemType,
    inStock: z.boolean(),
    frameColor: FrameColor.optional(),
    baseStyle: z.string().optional(),
    baseMaterial: BaseMaterial.optional(),
    isFeatured: z.boolean().optional(),
    isHidden: z.boolean().optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const GenericItem = ItemBase.merge(
  z.object({ kind: z.literal("GenericItem") }).passthrough()
);
const ModuleSize = z.enum(["small", "medium", "large"]);
const ControllerType = z.enum(["remote", "app"]);
const ModuleItem = ItemBase.merge(
  z
    .object({
      kind: z.literal("ModuleItem"),
      moduleSize: ModuleSize.optional(),
      moduleColor: z.string().optional(),
      moduleController: ControllerType.optional(),
    })
    .passthrough()
);
const AccessoryItem = ItemBase.merge(
  z
    .object({
      kind: z.literal("AccessoryItem"),
      accessorySize: ModuleSize,
      accessoryMaterial: z.string(),
      accessoryColor: z.string(),
      accessoryStyle: z.string(),
    })
    .partial()
    .passthrough()
);
const ItemFetch = z.discriminatedUnion("kind", [
  GenericItem,
  ModuleItem,
  AccessoryItem,
]);
const BaseItemInput = z
  .object({
    itemName: z.string(),
    description: z.string().optional(),
    price: z.number(),
    itemMedia: z.array(Media).optional(),
    itemCategory: ItemCategory,
    itemType: ItemType,
    inStock: z.boolean(),
    frameColor: FrameColor.optional(),
    baseStyle: z.string().optional(),
    baseMaterial: BaseMaterial.optional(),
    isFeatured: z.boolean().optional(),
    isHidden: z.boolean().optional(),
  })
  .passthrough();
const GenericItemInput = BaseItemInput.merge(
  z.object({ kind: z.literal("GenericItem") }).passthrough()
);
const ModuleItemInput = BaseItemInput.merge(
  z
    .object({
      kind: z.literal("ModuleItem"),
      moduleSize: ModuleSize.optional(),
      moduleColor: z.string().optional(),
      moduleController: ControllerType.optional(),
    })
    .passthrough()
);
const AccessoryItemInput = BaseItemInput.merge(
  z
    .object({
      kind: z.literal("AccessoryItem"),
      accessorySize: ModuleSize.optional(),
      accessoryMaterial: z.string().optional(),
      accessoryColor: z.string(),
      accessoryStyle: z.string().optional(),
    })
    .passthrough()
);
const ItemInput = z.discriminatedUnion("kind", [
  GenericItemInput,
  ModuleItemInput,
  AccessoryItemInput,
]);
const BaseItemFields = z
  .object({ itemName: z.string(), description: z.string(), price: z.number() })
  .partial()
  .passthrough();
const ItemUpdate = BaseItemFields.and(
  z
    .object({
      inStock: z.boolean(),
      isFeatured: z.boolean(),
      isHidden: z.boolean(),
      frameColor: FrameColor,
      surfaceMaterial: z.string(),
      size: ModuleSize,
      material: z.string(),
      color: z.string(),
      style: z.string(),
      controller: ControllerType,
    })
    .partial()
    .passthrough()
);
const postAdminitemsItemIdmedia_Body = z
  .object({ url: z.string().url(), type: z.string(), order: z.number().int() })
  .passthrough();
const patchAdminitemsItemIdmediaMediaId_Body = z
  .object({ url: z.string().url(), type: z.string(), order: z.number().int() })
  .partial()
  .passthrough();
const BaseBundleFields = z
  .object({
    bundleName: z.string(),
    description: z.string(),
    price: z.number(),
  })
  .partial()
  .passthrough();
const Bundle = BaseBundleFields.and(
  z
    .object({
      id: z.number().int(),
      itemIds: z.array(z.number().int()),
      createdAt: z.string().datetime({ offset: true }).optional(),
      updatedAt: z.string().datetime({ offset: true }).optional(),
    })
    .passthrough()
);
const BundleInput = BaseBundleFields.and(
  z.object({ itemIds: z.array(z.number().int()) }).passthrough()
);
const CartItem = z
  .object({
    itemId: z.number().int(),
    quantity: z.number().int().gte(1),
    addedAt: z.string().datetime({ offset: true }).optional(),
    itemDetails: ItemFetch.optional(),
  })
  .passthrough();
const CartInsert = z
  .object({ itemId: z.number().int(), quantity: z.number().int().gte(1) })
  .passthrough();
const OrderStatus = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);
const OrderItem = z
  .object({
    itemId: z.number().int(),
    quantity: z.number().int().gte(1),
    priceAtPurchase: z.number(),
    itemName: z.string(),
    itemSnapshot: z
      .object({ itemName: z.string(), price: z.number() })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const Order = z
  .object({
    id: z.number().int(),
    userId: z.number().int(),
    status: OrderStatus,
    total: z.number(),
    shippingAddress: UserAddress,
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    items: z.array(OrderItem),
  })
  .partial()
  .passthrough();
const OrderItemInput = z
  .object({ itemId: z.number().int(), quantity: z.number().int().gte(1) })
  .passthrough();
const NewOrder = z
  .object({
    shippingAddress: UserAddress,
    items: z.array(OrderItemInput).min(1),
  })
  .passthrough();
const patchOrdersIdstatus_Body = z
  .object({
    status: z.enum([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]),
  })
  .passthrough();

export const schemas = {
  UserAddress,
  UserInputBase,
  RegisterUser,
  UserSelf,
  UserWithToken,
  ErrorResponse,
  LoginRequest,
  UpdateMe,
  UserRole,
  UserAdmin,
  UpdateUser,
  Media,
  ItemCategory,
  ItemType,
  FrameColor,
  BaseMaterial,
  ItemBase,
  GenericItem,
  ModuleSize,
  ControllerType,
  ModuleItem,
  AccessoryItem,
  ItemFetch,
  BaseItemInput,
  GenericItemInput,
  ModuleItemInput,
  AccessoryItemInput,
  ItemInput,
  BaseItemFields,
  ItemUpdate,
  postAdminitemsItemIdmedia_Body,
  patchAdminitemsItemIdmediaMediaId_Body,
  BaseBundleFields,
  Bundle,
  BundleInput,
  CartItem,
  CartInsert,
  OrderStatus,
  OrderItem,
  Order,
  OrderItemInput,
  NewOrder,
  patchOrdersIdstatus_Body,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/admin/items/:itemId/media",
    alias: "postAdminitemsItemIdmedia",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postAdminitemsItemIdmedia_Body,
      },
    ],
    response: Media,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/admin/items/:itemId/media/:mediaId",
    alias: "patchAdminitemsItemIdmediaMediaId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchAdminitemsItemIdmediaMediaId_Body,
      },
    ],
    response: Media,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/admin/items/:itemId/media/:mediaId",
    alias: "deleteAdminitemsItemIdmediaMediaId",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/auth/login",
    alias: "postAuthlogin",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: LoginRequest,
      },
    ],
    response: UserWithToken,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/auth/logout",
    alias: "postAuthlogout",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/auth/me",
    alias: "getAuthme",
    requestFormat: "json",
    response: UserSelf,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/auth/me",
    alias: "patchAuthme",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateMe,
      },
    ],
    response: UserSelf,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/auth/register",
    alias: "postAuthregister",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RegisterUser,
      },
    ],
    response: UserWithToken,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/bundles",
    alias: "getBundles",
    requestFormat: "json",
    response: z.array(Bundle),
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/bundles",
    alias: "postBundles",
    description: `Only users with the &#x27;admin&#x27; or &#x27;manager&#x27; role can create bundles.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: BundleInput,
      },
    ],
    response: Bundle,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/bundles/:id",
    alias: "getBundlesId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: Bundle,
    errors: [
      {
        status: 404,
        description: `Not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/bundles/:id",
    alias: "patchBundlesId",
    description: `Only users with the &#x27;admin&#x27; or &#x27;manager&#x27; role can update bundles.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: BundleInput,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: Bundle,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/bundles/:id",
    alias: "deleteBundlesId",
    description: `Only users with the &#x27;admin&#x27; role can delete bundles.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/cart",
    alias: "getCart",
    description: `Only authenticated users can view their own cart.`,
    requestFormat: "json",
    response: z.array(CartItem),
    errors: [
      {
        status: 404,
        description: `Not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/cart",
    alias: "postCart",
    description: `Only authenticated users can add items to their own cart.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CartInsert,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/cart",
    alias: "deleteCart",
    description: `Only authenticated users can clear their own cart.`,
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/cart/items/:itemId",
    alias: "patchCartitemsItemId",
    description: `Only authenticated users can update items in their own cart.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ quantity: z.number().int().gte(1) }).passthrough(),
      },
      {
        name: "itemId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: CartItem,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/cart/items/:itemId",
    alias: "deleteCartitemsItemId",
    description: `Only authenticated users can remove items from their own cart.`,
    requestFormat: "json",
    parameters: [
      {
        name: "itemId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/items",
    alias: "getItems",
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(20),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().int().gte(0).optional().default(0),
      },
      {
        name: "featured",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "sort",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z
      .object({ totalCount: z.number().int(), items: z.array(ItemFetch) })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/items",
    alias: "postItems",
    description: `Only users with the &#x27;admin&#x27; or &#x27;manager&#x27; role can add items.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ItemInput,
      },
    ],
    response: ItemFetch,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/items/:id",
    alias: "getItemsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: ItemFetch,
    errors: [
      {
        status: 404,
        description: `Not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/items/:id",
    alias: "patchItemsId",
    description: `Only users with the &#x27;admin&#x27; or &#x27;manager&#x27; role can update items.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ItemUpdate,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: ItemFetch,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/items/:id",
    alias: "deleteItemsId",
    description: `Only users with the &#x27;admin&#x27; role can delete items.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/orders",
    alias: "getOrders",
    description: `Only users with the &#x27;admin&#x27; or &#x27;manager&#x27; role can view all orders.`,
    requestFormat: "json",
    response: z.array(Order),
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/orders",
    alias: "postOrders",
    description: `Place a new order. Requires authentication. Payment is processed via an external service (e.g., Stripe).
Customers can only place orders for themselves. Admins and managers may place orders on behalf of any user.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: NewOrder,
      },
    ],
    response: Order,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/orders/:id",
    alias: "getOrdersId",
    description: `Customers may only access their own orders. Admins and managers can access any order.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: Order,
    errors: [
      {
        status: 404,
        description: `Not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/orders/:id/status",
    alias: "patchOrdersIdstatus",
    description: `Only users with the &#x27;admin&#x27; or &#x27;manager&#x27; role can update order status.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchOrdersIdstatus_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: Order,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/users",
    alias: "getUsers",
    requestFormat: "json",
    response: z.array(UserAdmin),
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/users/:id",
    alias: "getUsersId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: UserAdmin,
    errors: [
      {
        status: 404,
        description: `Not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/users/:id",
    alias: "patchUsersId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateUser,
      },
    ],
    response: UserAdmin,
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/users/:id",
    alias: "deleteUsersId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 401,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
