/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_chats from "../functions/chats.js";
import type * as functions_createVedio from "../functions/createVedio.js";
import type * as functions_index from "../functions/index.js";
import type * as functions_inject from "../functions/inject.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/chats": typeof functions_chats;
  "functions/createVedio": typeof functions_createVedio;
  "functions/index": typeof functions_index;
  "functions/inject": typeof functions_inject;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
