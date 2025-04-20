# README

```bash
e-commerce_rest_api
├─ db
│  └─ schema.sql
├─ docs
│  ├─ Erin_Wong_Jewlery_dbdiagram-io.pdf
│  └─ openapi.yaml
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ server
│  │  ├─ app.ts
│  │  ├─ auth
│  │  ├─ controllers
│  │  ├─ index.ts
│  │  ├─ middlewares
│  │  ├─ models
│  │  ├─ routes
│  │  ├─ services
│  │  ├─ utils
│  │  │  └─ logger.ts
│  │  └─ validators
│  └─ tests
├─ tsconfig.json
└─ tsconfig.tsbuildinfo
```

```
e-commerce_rest_api
├─ db
│  └─ schema.sql
├─ docs
│  ├─ Erin_Wong_Jewlery_dbdiagram-io.pdf
│  └─ openapi.yaml
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ db
│  │  ├─ index.ts
│  │  └─ types.ts
│  ├─ interfaces
│  │  ├─ authChangePasswordPutRequest.ts
│  │  ├─ authSession.ts
│  │  ├─ cartCheckoutPost200Response.ts
│  │  ├─ cartInsert.ts
│  │  ├─ cartItem.ts
│  │  ├─ cartItemsItemIdPatchRequest.ts
│  │  ├─ colors.ts
│  │  ├─ earringDetails.ts
│  │  ├─ errorResponse.ts
│  │  ├─ gemShape.ts
│  │  ├─ gemSize.ts
│  │  ├─ item.ts
│  │  ├─ itemBase.ts
│  │  ├─ itemEarring.ts
│  │  ├─ itemNecklace.ts
│  │  ├─ itemRing.ts
│  │  ├─ itemsGet200Response.ts
│  │  ├─ jewelryType.ts
│  │  ├─ loginRequest.ts
│  │  ├─ necklaceDetails.ts
│  │  ├─ newItemInput.ts
│  │  ├─ newOrder.ts
│  │  ├─ order.ts
│  │  ├─ orderItem.ts
│  │  ├─ orderItemInput.ts
│  │  ├─ orderItemItemSnapshot.ts
│  │  ├─ ordersIdStatusPatchRequest.ts
│  │  ├─ orderStatus.ts
│  │  ├─ partialItemUpdate.ts
│  │  ├─ partialUserUpdate.ts
│  │  ├─ ringDetails.ts
│  │  ├─ user.ts
│  │  └─ userAddress.ts
│  ├─ server
│  │  ├─ app.ts
│  │  ├─ auth
│  │  ├─ controllers
│  │  │  └─ item.controller.ts
│  │  ├─ index.ts
│  │  ├─ middlewares
│  │  ├─ models
│  │  ├─ routes
│  │  │  └─ item.routes.ts
│  │  ├─ services
│  │  │  └─ item.service.ts
│  │  ├─ utils
│  │  │  └─ logger.ts
│  │  └─ validators
│  └─ tests
├─ tsconfig.json
└─ tsconfig.tsbuildinfo

```