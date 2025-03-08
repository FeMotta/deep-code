import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  ...authTables,
  challenges: defineTable({
    title: v.string(),
    description: v.string(),
    difficulty: v.string(),
    status: v.string(),
    topics: v.array(v.string()),
    estimatedTime: v.string(),
    successRate: v.number(),
    updatedAt: v.number(),
    starterCode: v.optional(v.string()),
    solutionCode: v.optional(v.string()),
    testCases: v.optional(v.array(v.object({
      input: v.string(),
      output: v.string(),
      explanation: v.optional(v.string()),
    }))),
    constraints: v.optional(v.array(v.string())),
    hints: v.optional(v.array(v.string())),
    timeComplexity: v.optional(v.string()),
    spaceComplexity: v.optional(v.string()),
  }),
  submissions: defineTable({
    userId: v.id("users"),
    challengeId: v.id("challenges"),
    code: v.string(),
    language: v.string(),
    status: v.string(), // "accepted", "wrong_answer", "time_limit_exceeded", "runtime_error", etc.
    executionTime: v.optional(v.number()),
    memoryUsed: v.optional(v.number()),
    testResults: v.optional(v.array(v.object({
      testCaseId: v.number(),
      passed: v.boolean(),
      executionTime: v.optional(v.number()),
      output: v.optional(v.string()),
      error: v.optional(v.string()),
    }))),
    timestamp: v.number(),
  }).index("by_user", ["userId"])
    .index("by_challenge", ["challengeId"])
    .index("by_user_challenge", ["userId", "challengeId"]),
  codeExecutions: defineTable({
    userId: v.id("users"),
    challengeId: v.id("challenges"),
    code: v.string(),
    language: v.string(),
    status: v.string(),
    results: v.optional(v.array(v.object({
      testCaseId: v.number(),
      passed: v.boolean(),
      executionTime: v.optional(v.number()),
      output: v.optional(v.string()),
      error: v.optional(v.string()),
    }))),
    timestamp: v.number(),
  }).index("by_user", ["userId"]),
});
 
export default schema;