import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const getChats = query({
  args: {agent: v.string()},
  handler: async (ctx:any, args:any) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("agentChat").filter((q:any) => q.eq(q.field("agent"), args.agent)).collect();
    // Reverse the list so that it's in a chronological order.
    return messages;
  },
});



export const send = mutation({
  args: { user: v.any(), text: v.string() ,agent: v.string()},
  handler: async (ctx:any, args) => {
    // Send a new message.
    await ctx.db.insert("agentChat", { user:args.user, text:args.text ,timestamp: Date.now(), agent:args.agent });
  },
});