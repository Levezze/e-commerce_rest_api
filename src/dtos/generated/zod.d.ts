import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const UserAddress = z
  .object({
    id: z.number().int(),
    userId: z.number().int(),
    street: z.string(),
    city: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const UserInputBase = z.object({
  email: z.string().max(100).email(),
  username: z.string().min(3).max(20),
  userAddress: UserAddress.optional(),
});
const RegisterUser = UserInputBase.and(
  z.object({ password: z.string().min(8) }).passthrough()
);
const UserRole = z.enum(["customer", "manager", "admin"]);
const UserSelf = z.object({
  id: z.number().int().optional(),
  email: z.string().email(),
  username: z.string(),
  userAddress: UserAddress.optional(),
  isActive: z.boolean().optional(),
  lastLogin: z.string().datetime({ offset: true }).nullish(),
  userRole: UserRole.optional(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }).optional(),
});
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
    userAddress: UserAddress,
  })
  .partial();
const UserAdmin = UserSelf.and(
  z
    .object({
      passwordResetToken: z.string().nullable(),
      passwordResetExpires: z.string().datetime({ offset: true }),
    })
    .partial()
    .passthrough()
);
const CreateUser = UserInputBase.and(
  z.object({ password: z.string().min(8), userRole: UserRole }).passthrough()
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
const MediaParentType = z.enum(["item", "bundle"]);
const MediaType = z.enum(["image", "video"]);
const Media = z
  .object({
    id: z.number().int(),
    parentType: MediaParentType,
    itemId: z.number().int().nullish(),
    bundleId: z.number().int().nullish(),
    url: z.string().url(),
    mediaType: MediaType,
    displayOrder: z.number().int(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const Tag = z
  .object({
    id: z.number().int(),
    name: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const ItemCategory = z.enum(["generic", "module", "accessory", "bundle"]);
const ItemType = z.enum(["manual", "auto", "general"]);
const ItemBase = z
  .object({
    id: z.number().int().optional(),
    kind: z.string().optional(),
    itemName: z.string(),
    description: z.string(),
    price: z.number(),
    discount: z.number().nullish(),
    itemMedia: z.array(Media).optional(),
    tags: z.array(Tag).optional(),
    itemCategory: ItemCategory.optional(),
    itemType: ItemType.optional(),
    inStock: z.boolean(),
    isFeatured: z.boolean().optional(),
    isHidden: z.boolean().optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const FrameColor = z.enum(["white", "black", "bronze"]);
const ModulePackage = z.enum(["custom", "basic", "minimal"]);
const GenericItem = ItemBase.and(
  z
    .object({
      kind: z.literal("GenericItem"),
      frameColor: FrameColor,
      modulePackage: ModulePackage,
    })
    .passthrough()
);
const ModuleSize = z.enum(["1x1", "2x1", "3x2", "4x2"]);
const ControllerType = z.enum(["remote", "app"]);
const ModuleItem = ItemBase.and(
  z
    .object({
      kind: z.literal("ModuleItem"),
      moduleSize: ModuleSize,
      controllerType: ControllerType,
    })
    .passthrough()
);
const AccessoryItem = ItemBase.and(
  z
    .object({
      kind: z.literal("AccessoryItem"),
      moduleSize: ModuleSize,
      frameColor: FrameColor,
      color: z.string().nullable(),
    })
    .partial()
    .passthrough()
);
const ItemFetch = z.discriminatedUnion("kind", [
  GenericItem,
  ModuleItem,
  AccessoryItem,
]);
const BaseMaterial = z.enum([
  "white_polymer",
  "black_polymer",
  "wood_oak",
  "wood_maple",
  "wood_pine",
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
const GenericItemInput = BaseItemInput.and(
  z
    .object({
      kind: z.literal("GenericItem"),
      frameColor: FrameColor,
      modulePackage: ModulePackage,
    })
    .passthrough()
);
const ModuleItemInput = BaseItemInput.and(
  z
    .object({
      kind: z.literal("ModuleItem"),
      moduleSize: ModuleSize,
      controllerType: ControllerType,
    })
    .passthrough()
);
const AccessoryItemInput = BaseItemInput.and(
  z
    .object({
      kind: z.literal("AccessoryItem"),
      moduleSize: ModuleSize.optional(),
      frameColor: FrameColor.optional(),
      color: z.string().nullish(),
    })
    .passthrough()
);
const ItemInput = z.discriminatedUnion("kind", [
  GenericItemInput,
  ModuleItemInput,
  AccessoryItemInput,
]);
const BaseItemFields = z.object({
  itemName: z.string(),
  description: z.string(),
  price: z.number(),
});
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
const postItemsItemIdmedia_Body = z
  .object({
    url: z.string().url(),
    mediaType: MediaType,
    displayOrder: z.number().int(),
  })
  .passthrough();
const patchItemsItemIdmediaMediaId_Body = z
  .object({
    url: z.string().url(),
    mediaType: MediaType,
    displayOrder: z.number().int(),
  })
  .partial()
  .passthrough();
const BaseBundleFields = z.object({
  bundleName: z.string(),
  description: z.string(),
  price: z.number(),
});
const Bundle = BaseBundleFields.and(
  z
    .object({
      id: z.number().int(),
      itemIds: z.array(z.number().int()).optional(),
      discount: z.number().nullish(),
      inStock: z.boolean(),
      isFeatured: z.boolean().optional(),
      isHidden: z.boolean().optional(),
      media: z.array(Media).optional(),
      createdAt: z.string().datetime({ offset: true }).optional(),
      updatedAt: z.string().datetime({ offset: true }).optional(),
    })
    .passthrough()
);
const BundleInput = BaseBundleFields.and(
  z
    .object({
      itemIds: z.array(z.number().int()),
      discount: z.number().nullish(),
      inStock: z.boolean(),
      isFeatured: z.boolean().optional(),
      isHidden: z.boolean().optional(),
    })
    .passthrough()
);
const CartItem = z
  .object({
    id: z.number().int(),
    cartId: z.number().int(),
    userId: z.number().int(),
    itemId: z.number().int(),
    quantity: z.number().int().gte(1),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    itemDetails: ItemFetch.optional(),
  })
  .passthrough();
const Cart = z
  .object({
    id: z.number().int(),
    userId: z.number().int(),
    status: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    items: z.array(CartItem).optional(),
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
    id: z.number().int(),
    orderId: z.number().int(),
    itemId: z.number().int().nullish(),
    bundleId: z.number().int().nullish(),
    quantity: z.number().int().gte(1),
    priceAtPurchase: z.number().optional(),
    itemName: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const Order = z
  .object({
    id: z.number().int(),
    userId: z.number().int().nullable(),
    status: OrderStatus,
    total: z.number(),
    shippingAddress: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    items: z.array(OrderItem),
  })
  .partial()
  .passthrough();
const OrderItemInput = z
  .object({
    itemId: z.number().int().optional(),
    bundleId: z.number().int().optional(),
    quantity: z.number().int().gte(1),
  })
  .passthrough();
const NewOrder = z
  .object({
    shippingAddress: z.string(),
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
const Review = z
  .object({
    id: z.number().int(),
    userId: z.number().int().optional(),
    rating: z.number().int().gte(1).lte(5),
    review: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const postReviews_Body = z
  .object({ rating: z.number().int().gte(1).lte(5), review: z.string() })
  .passthrough();
const patchReviewsId_Body = z
  .object({ rating: z.number().int().gte(1).lte(5), review: z.string() })
  .partial()
  .passthrough();

export const schemas = {
  UserAddress,
  UserInputBase,
  RegisterUser,
  UserRole,
  UserSelf,
  UserWithToken,
  ErrorResponse,
  LoginRequest,
  UpdateMe,
  UserAdmin,
  CreateUser,
  UpdateUser,
  MediaParentType,
  MediaType,
  Media,
  Tag,
  ItemCategory,
  ItemType,
  ItemBase,
  FrameColor,
  ModulePackage,
  GenericItem,
  ModuleSize,
  ControllerType,
  ModuleItem,
  AccessoryItem,
  ItemFetch,
  BaseMaterial,
  BaseItemInput,
  GenericItemInput,
  ModuleItemInput,
  AccessoryItemInput,
  ItemInput,
  BaseItemFields,
  ItemUpdate,
  postItemsItemIdmedia_Body,
  patchItemsItemIdmediaMediaId_Body,
  BaseBundleFields,
  Bundle,
  BundleInput,
  CartItem,
  Cart,
  CartInsert,
  OrderStatus,
  OrderItem,
  Order,
  OrderItemInput,
  NewOrder,
  patchOrdersIdstatus_Body,
  Review,
  postReviews_Body,
  patchReviewsId_Body,
};

const endpoints = makeApi([
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
    method: "post",
    path: "/bundles/:bundleId/media",
    alias: "postBundlesBundleIdmedia",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postItemsItemIdmedia_Body,
      },
      {
        name: "bundleId",
        type: "Path",
        schema: z.number().int(),
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
    path: "/bundles/:bundleId/media/:mediaId",
    alias: "patchBundlesBundleIdmediaMediaId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchItemsItemIdmediaMediaId_Body,
      },
      {
        name: "bundleId",
        type: "Path",
        schema: z.number().int(),
      },
      {
        name: "mediaId",
        type: "Path",
        schema: z.number().int(),
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
    path: "/bundles/:bundleId/media/:mediaId",
    alias: "deleteBundlesBundleIdmediaMediaId",
    requestFormat: "json",
    parameters: [
      {
        name: "bundleId",
        type: "Path",
        schema: z.number().int(),
      },
      {
        name: "mediaId",
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
    response: Cart,
    errors: [
      {
        status: 404,
        description: `User has no active cart`,
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
    description: `Only authenticated users can add items to their own cart. Creates a new cart if the user doesn&#x27;t have an active one.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CartInsert,
      },
    ],
    response: CartItem,
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
        description: `Item not found`,
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
    description: `Only authenticated users can clear their own cart. This removes all items but keeps the cart with status &#x27;active&#x27;.`,
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
    path: "/cart/items/:cartItemId",
    alias: "patchCartitemsCartItemId",
    description: `Only authenticated users can update items in their own cart.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ quantity: z.number().int().gte(1) }).passthrough(),
      },
      {
        name: "cartItemId",
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
    path: "/cart/items/:cartItemId",
    alias: "deleteCartitemsCartItemId",
    description: `Only authenticated users can remove items from their own cart.`,
    requestFormat: "json",
    parameters: [
      {
        name: "cartItemId",
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
    method: "post",
    path: "/items/:itemId/media",
    alias: "postItemsItemIdmedia",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postItemsItemIdmedia_Body,
      },
      {
        name: "itemId",
        type: "Path",
        schema: z.number().int(),
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
    path: "/items/:itemId/media/:mediaId",
    alias: "patchItemsItemIdmediaMediaId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchItemsItemIdmediaMediaId_Body,
      },
      {
        name: "itemId",
        type: "Path",
        schema: z.number().int(),
      },
      {
        name: "mediaId",
        type: "Path",
        schema: z.number().int(),
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
    path: "/items/:itemId/media/:mediaId",
    alias: "deleteItemsItemIdmediaMediaId",
    requestFormat: "json",
    parameters: [
      {
        name: "itemId",
        type: "Path",
        schema: z.number().int(),
      },
      {
        name: "mediaId",
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
    path: "/items/:itemId/tags",
    alias: "getItemsItemIdtags",
    requestFormat: "json",
    parameters: [
      {
        name: "itemId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.array(Tag),
    errors: [
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
    path: "/items/:itemId/tags",
    alias: "postItemsItemIdtags",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ tagId: z.number().int() }).passthrough(),
      },
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
        status: 409,
        description: `Tag already added to item`,
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
    path: "/items/:itemId/tags/:tagId",
    alias: "deleteItemsItemIdtagsTagId",
    requestFormat: "json",
    parameters: [
      {
        name: "itemId",
        type: "Path",
        schema: z.number().int(),
      },
      {
        name: "tagId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
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
    path: "/reviews",
    alias: "getReviews",
    requestFormat: "json",
    response: z.array(Review),
    errors: [
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/reviews",
    alias: "postReviews",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postReviews_Body,
      },
    ],
    response: Review,
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
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/reviews/:id",
    alias: "getReviewsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: Review,
    errors: [
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
    path: "/reviews/:id",
    alias: "patchReviewsId",
    description: `Users can only update their own reviews. Admins can update any review.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchReviewsId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: Review,
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
    path: "/reviews/:id",
    alias: "deleteReviewsId",
    description: `Users can only delete their own reviews. Admins can delete any review.`,
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
    path: "/tags",
    alias: "getTags",
    requestFormat: "json",
    response: z.array(Tag),
    errors: [
      {
        status: 500,
        description: `Common error responses`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/tags",
    alias: "postTags",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ name: z.string() }).passthrough(),
      },
    ],
    response: Tag,
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
        status: 409,
        description: `Tag already exists`,
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
    path: "/tags/:id",
    alias: "getTagsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: Tag,
    errors: [
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
    path: "/tags/:id",
    alias: "deleteTagsId",
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
    method: "post",
    path: "/users",
    alias: "postUsers",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateUser,
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
