import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const getAllVedio = query({
  args: {},
  handler: async (ctx:any) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("inject").collect();
    // Reverse the list so that it's in a chronological order.
    return messages;
  },
});



export const create = mutation({
  args: { user: v.any(), url: v.string() ,prompt:v.string() },
  handler: async (ctx:any, args) => {
    await ctx.db.insert("inject", { user:args.user, text:args.url ,timestamp: Date.now() ,prompt:args.prompt});
  },
});