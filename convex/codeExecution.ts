import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const executeCode = mutation({
  args: {
    challengeId: v.id("challenges"),
    code: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to execute code");
    }

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    const testCases = challenge.testCases || [];
    const results = testCases.map((testCase, index) => {
      let passed = Math.random() > 0.3;
      let executionTime = Math.floor(Math.random() * 100);
      
      return {
        testCaseId: index,
        passed,
        executionTime,
        output: passed ? testCase.output : "Unexpected output",
        error: passed ? undefined : "Sample error message",
      };
    });

    const executionId = await ctx.db.insert("codeExecutions", {
      userId,
      challengeId: args.challengeId,
      code: args.code,
      language: args.language,
      status: "completed",
      results,
      timestamp: Date.now(),
    });

    return {
      executionId,
      results,
      status: "completed"
    };
  }
});

export const submitSolution = mutation({
  args: {
    challengeId: v.id("challenges"),
    code: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to submit a solution");
    }

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    const testCases = challenge.testCases || [];
    const results = testCases.map((testCase, index) => {
      let passed = Math.random() > 0.2;
      let executionTime = Math.floor(Math.random() * 100);
      
      return {
        testCaseId: index,
        passed,
        executionTime,
        output: passed ? testCase.output : "Unexpected output",
        error: passed ? undefined : "Sample error message",
      };
    });

    const allPassed = results.every(result => result.passed);
    const status = allPassed ? "accepted" : "wrong_answer";

    const submissionId = await ctx.db.insert("submissions", {
      userId,
      challengeId: args.challengeId,
      code: args.code,
      language: args.language,
      status,
      executionTime: Math.max(...results.map(r => r.executionTime || 0)),
      memoryUsed: Math.floor(Math.random() * 200),
      testResults: results,
      timestamp: Date.now(),
    });

    return {
      submissionId,
      results,
      status,
      allPassed
    };
  }
});

export const getUserSubmissions = query({
  args: {
    challengeId: v.id("challenges"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_user_challenge", q => 
        q.eq("userId", userId).eq("challengeId", args.challengeId)
      )
      .order("desc")
      .take(10);

    return submissions;
  }
});
