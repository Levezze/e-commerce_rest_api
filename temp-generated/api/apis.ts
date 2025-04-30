export * from './authApi';
import { AuthApi } from './authApi';
export * from './cartApi';
import { CartApi } from './cartApi';
export * from './itemsApi';
import { ItemsApi } from './itemsApi';
export * from './ordersApi';
import { OrdersApi } from './ordersApi';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models';

export const APIS = [AuthApi, CartApi, ItemsApi, OrdersApi];
