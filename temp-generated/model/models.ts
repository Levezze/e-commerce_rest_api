import localVarRequest from 'request';

export * from './authChangePasswordPutRequest';
export * from './authSession';
export * from './cartCheckoutPost200Response';
export * from './cartInsert';
export * from './cartItem';
export * from './cartItemsItemIdPatchRequest';
export * from './colors';
export * from './earringDetails';
export * from './errorResponse';
export * from './gemShape';
export * from './gemSize';
export * from './itemBase';
export * from './itemBaseInput';
export * from './itemEarring';
export * from './itemEarringInput';
export * from './itemFetch';
export * from './itemNecklace';
export * from './itemNecklaceInput';
export * from './itemPost';
export * from './itemRing';
export * from './itemRingInput';
export * from './itemsGet200Response';
export * from './jewelryType';
export * from './loginRequest';
export * from './necklaceDetails';
export * from './newOrder';
export * from './order';
export * from './orderItem';
export * from './orderItemInput';
export * from './orderItemItemSnapshot';
export * from './orderStatus';
export * from './ordersIdStatusPatchRequest';
export * from './partialItemUpdate';
export * from './partialUserUpdate';
export * from './registerUser';
export * from './ringDetails';
export * from './user';
export * from './userAddress';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { AuthChangePasswordPutRequest } from './authChangePasswordPutRequest';
import { AuthSession } from './authSession';
import { CartCheckoutPost200Response } from './cartCheckoutPost200Response';
import { CartInsert } from './cartInsert';
import { CartItem } from './cartItem';
import { CartItemsItemIdPatchRequest } from './cartItemsItemIdPatchRequest';
import { Colors } from './colors';
import { EarringDetails } from './earringDetails';
import { ErrorResponse } from './errorResponse';
import { GemShape } from './gemShape';
import { GemSize } from './gemSize';
import { ItemBase } from './itemBase';
import { ItemBaseInput } from './itemBaseInput';
import { ItemEarring } from './itemEarring';
import { ItemEarringInput } from './itemEarringInput';
import { ItemFetch } from './itemFetch';
import { ItemNecklace } from './itemNecklace';
import { ItemNecklaceInput } from './itemNecklaceInput';
import { ItemPost } from './itemPost';
import { ItemRing } from './itemRing';
import { ItemRingInput } from './itemRingInput';
import { ItemsGet200Response } from './itemsGet200Response';
import { JewelryType } from './jewelryType';
import { LoginRequest } from './loginRequest';
import { NecklaceDetails } from './necklaceDetails';
import { NewOrder } from './newOrder';
import { Order } from './order';
import { OrderItem } from './orderItem';
import { OrderItemInput } from './orderItemInput';
import { OrderItemItemSnapshot } from './orderItemItemSnapshot';
import { OrderStatus } from './orderStatus';
import { OrdersIdStatusPatchRequest } from './ordersIdStatusPatchRequest';
import { PartialItemUpdate } from './partialItemUpdate';
import { PartialUserUpdate } from './partialUserUpdate';
import { RegisterUser } from './registerUser';
import { RingDetails } from './ringDetails';
import { User } from './user';
import { UserAddress } from './userAddress';

/* tslint:disable:no-unused-variable */
let primitives = [
                    "string",
                    "boolean",
                    "double",
                    "integer",
                    "long",
                    "float",
                    "number",
                    "any"
                 ];

let enumsMap: {[index: string]: any} = {
        "Colors": Colors,
        "GemShape": GemShape,
        "GemSize": GemSize,
        "JewelryType": JewelryType,
        "OrderStatus": OrderStatus,
}

let typeMap: {[index: string]: any} = {
    "AuthChangePasswordPutRequest": AuthChangePasswordPutRequest,
    "AuthSession": AuthSession,
    "CartCheckoutPost200Response": CartCheckoutPost200Response,
    "CartInsert": CartInsert,
    "CartItem": CartItem,
    "CartItemsItemIdPatchRequest": CartItemsItemIdPatchRequest,
    "EarringDetails": EarringDetails,
    "ErrorResponse": ErrorResponse,
    "ItemBase": ItemBase,
    "ItemBaseInput": ItemBaseInput,
    "ItemEarring": ItemEarring,
    "ItemEarringInput": ItemEarringInput,
    "ItemFetch": ItemFetch,
    "ItemNecklace": ItemNecklace,
    "ItemNecklaceInput": ItemNecklaceInput,
    "ItemPost": ItemPost,
    "ItemRing": ItemRing,
    "ItemRingInput": ItemRingInput,
    "ItemsGet200Response": ItemsGet200Response,
    "LoginRequest": LoginRequest,
    "NecklaceDetails": NecklaceDetails,
    "NewOrder": NewOrder,
    "Order": Order,
    "OrderItem": OrderItem,
    "OrderItemInput": OrderItemInput,
    "OrderItemItemSnapshot": OrderItemItemSnapshot,
    "OrdersIdStatusPatchRequest": OrdersIdStatusPatchRequest,
    "PartialItemUpdate": PartialItemUpdate,
    "PartialUserUpdate": PartialUserUpdate,
    "RegisterUser": RegisterUser,
    "RingDetails": RingDetails,
    "User": User,
    "UserAddress": UserAddress,
}

// Check if a string starts with another string without using es6 features
function startsWith(str: string, match: string): boolean {
    return str.substring(0, match.length) === match;
}

// Check if a string ends with another string without using es6 features
function endsWith(str: string, match: string): boolean {
    return str.length >= match.length && str.substring(str.length - match.length) === match;
}

const nullableSuffix = " | null";
const optionalSuffix = " | undefined";
const arrayPrefix = "Array<";
const arraySuffix = ">";
const mapPrefix = "{ [key: string]: ";
const mapSuffix = "; }";

export class ObjectSerializer {
    public static findCorrectType(data: any, expectedType: string) {
        if (data == undefined) {
            return expectedType;
        } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        } else if (expectedType === "Date") {
            return expectedType;
        } else {
            if (enumsMap[expectedType]) {
                return expectedType;
            }

            if (!typeMap[expectedType]) {
                return expectedType; // w/e we don't know the type
            }

            // Check the discriminator
            let discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType; // the type does not have a discriminator. use it.
            } else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    if(typeMap[discriminatorType]){
                        return discriminatorType; // use the type given in the discriminator
                    } else {
                        return expectedType; // discriminator did not map to a type
                    }
                } else {
                    return expectedType; // discriminator was not present (or an empty string)
                }
            }
        }
    }

    public static serialize(data: any, type: string): any {
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (endsWith(type, nullableSuffix)) {
            let subType: string = type.slice(0, -nullableSuffix.length); // Type | null => Type
            return ObjectSerializer.serialize(data, subType);
        } else if (endsWith(type, optionalSuffix)) {
            let subType: string = type.slice(0, -optionalSuffix.length); // Type | undefined => Type
            return ObjectSerializer.serialize(data, subType);
        } else if (startsWith(type, arrayPrefix)) {
            let subType: string = type.slice(arrayPrefix.length, -arraySuffix.length); // Array<Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.serialize(datum, subType));
            }
            return transformedData;
        } else if (startsWith(type, mapPrefix)) {
            let subType: string = type.slice(mapPrefix.length, -mapSuffix.length); // { [key: string]: Type; } => Type
            let transformedData: { [key: string]: any } = {};
            for (let key in data) {
                transformedData[key] = ObjectSerializer.serialize(
                    data[key],
                    subType,
                );
            }
            return transformedData;
        } else if (type === "Date") {
            return data.toISOString();
        } else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) { // in case we dont know the type
                return data;
            }

            // Get the actual type of this object
            type = this.findCorrectType(data, type);

            // get the map for the correct type.
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            let instance: {[index: string]: any} = {};
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type);
            }
            return instance;
        }
    }

    public static deserialize(data: any, type: string): any {
        // polymorphism may change the actual type.
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (endsWith(type, nullableSuffix)) {
            let subType: string = type.slice(0, -nullableSuffix.length); // Type | null => Type
            return ObjectSerializer.deserialize(data, subType);
        } else if (endsWith(type, optionalSuffix)) {
            let subType: string = type.slice(0, -optionalSuffix.length); // Type | undefined => Type
            return ObjectSerializer.deserialize(data, subType);
        } else if (startsWith(type, arrayPrefix)) {
            let subType: string = type.slice(arrayPrefix.length, -arraySuffix.length); // Array<Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.deserialize(datum, subType));
            }
            return transformedData;
        } else if (startsWith(type, mapPrefix)) {
            let subType: string = type.slice(mapPrefix.length, -mapSuffix.length); // { [key: string]: Type; } => Type
            let transformedData: { [key: string]: any } = {};
            for (let key in data) {
                transformedData[key] = ObjectSerializer.deserialize(
                    data[key],
                    subType,
                );
            }
            return transformedData;
        } else if (type === "Date") {
            return new Date(data);
        } else {
            if (enumsMap[type]) {// is Enum
                return data;
            }

            if (!typeMap[type]) { // dont know the type
                return data;
            }
            let instance = new typeMap[type]();
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type);
            }
            return instance;
        }
    }
}

export interface Authentication {
    /**
    * Apply authentication settings to header and query params.
    */
    applyToRequest(requestOptions: localVarRequest.Options): Promise<void> | void;
}

export class HttpBasicAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        requestOptions.auth = {
            username: this.username, password: this.password
        }
    }
}

export class HttpBearerAuth implements Authentication {
    public accessToken: string | (() => string) = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            const accessToken = typeof this.accessToken === 'function'
                            ? this.accessToken()
                            : this.accessToken;
            requestOptions.headers["Authorization"] = "Bearer " + accessToken;
        }
    }
}

export class ApiKeyAuth implements Authentication {
    public apiKey: string = '';

    constructor(private location: string, private paramName: string) {
    }

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (this.location == "query") {
            (<any>requestOptions.qs)[this.paramName] = this.apiKey;
        } else if (this.location == "header" && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        } else if (this.location == 'cookie' && requestOptions && requestOptions.headers) {
            if (requestOptions.headers['Cookie']) {
                requestOptions.headers['Cookie'] += '; ' + this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
            else {
                requestOptions.headers['Cookie'] = this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
        }
    }
}

export class OAuth implements Authentication {
    public accessToken: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
        }
    }
}

export class VoidAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(_: localVarRequest.Options): void {
        // Do nothing
    }
}

export type Interceptor = (requestOptions: localVarRequest.Options) => (Promise<void> | void);
