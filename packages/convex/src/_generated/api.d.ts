/* prettier-ignore-start */

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
import type * as adventureLogBlocks from "../adventureLogBlocks.js";
import type * as adventureLogCompanions from "../adventureLogCompanions.js";
import type * as adventureLogTags from "../adventureLogTags.js";
import type * as adventureLogs from "../adventureLogs.js";
import type * as cartItems from "../cartItems.js";
import type * as carts from "../carts.js";
import type * as comments from "../comments.js";
import type * as crons from "../crons.js";
import type * as feedback from "../feedback.js";
import type * as feedbackActions from "../feedbackActions.js";
import type * as fileActions from "../fileActions.js";
import type * as files from "../files.js";
import type * as follows from "../follows.js";
import type * as galleries from "../galleries.js";
import type * as http from "../http.js";
import type * as lib_authorization from "../lib/authorization.js";
import type * as lib_email from "../lib/email.js";
import type * as lib_stripe from "../lib/stripe.js";
import type * as lib_tiptap from "../lib/tiptap.js";
import type * as lib_transactional from "../lib/transactional.js";
import type * as lib_utils from "../lib/utils.js";
import type * as likes from "../likes.js";
import type * as me from "../me.js";
import type * as optimizerActions from "../optimizerActions.js";
import type * as orderActions from "../orderActions.js";
import type * as orders from "../orders.js";
import type * as paymentActions from "../paymentActions.js";
import type * as payments from "../payments.js";
import type * as printables from "../printables.js";
import type * as shopProductActions from "../shopProductActions.js";
import type * as shopProductImages from "../shopProductImages.js";
import type * as shopProductOptions from "../shopProductOptions.js";
import type * as shopProducts from "../shopProducts.js";
import type * as stripeActions from "../stripeActions.js";
import type * as tags from "../tags.js";
import type * as userActions from "../userActions.js";
import type * as userAlerts from "../userAlerts.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  adventureLogBlocks: typeof adventureLogBlocks;
  adventureLogCompanions: typeof adventureLogCompanions;
  adventureLogTags: typeof adventureLogTags;
  adventureLogs: typeof adventureLogs;
  cartItems: typeof cartItems;
  carts: typeof carts;
  comments: typeof comments;
  crons: typeof crons;
  feedback: typeof feedback;
  feedbackActions: typeof feedbackActions;
  fileActions: typeof fileActions;
  files: typeof files;
  follows: typeof follows;
  galleries: typeof galleries;
  http: typeof http;
  "lib/authorization": typeof lib_authorization;
  "lib/email": typeof lib_email;
  "lib/stripe": typeof lib_stripe;
  "lib/tiptap": typeof lib_tiptap;
  "lib/transactional": typeof lib_transactional;
  "lib/utils": typeof lib_utils;
  likes: typeof likes;
  me: typeof me;
  optimizerActions: typeof optimizerActions;
  orderActions: typeof orderActions;
  orders: typeof orders;
  paymentActions: typeof paymentActions;
  payments: typeof payments;
  printables: typeof printables;
  shopProductActions: typeof shopProductActions;
  shopProductImages: typeof shopProductImages;
  shopProductOptions: typeof shopProductOptions;
  shopProducts: typeof shopProducts;
  stripeActions: typeof stripeActions;
  tags: typeof tags;
  userActions: typeof userActions;
  userAlerts: typeof userAlerts;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
