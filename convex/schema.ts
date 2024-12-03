import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values"
export default defineSchema({
  chats: defineTable({
    user: v.string(),
    text: v.string(),
    timestamp: v.any(),
  }),
  inject: defineTable({
    user: v.string(),
    text: v.string(),
    timestamp: v.any(),
  }),
  createVedio: defineTable({
    user: v.string(),
    url: v.string(),
    prompt: v.string(),
    timestamp: v.any(),
  })
});