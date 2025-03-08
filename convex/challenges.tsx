import { getAuthUserId } from "@convex-dev/auth/server";

import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const challenges = await ctx.db
      .query("challenges")
      .collect()

    return challenges;
  }
})

export const getById = query({
  args: {
    id: v.id("challenges")
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const challenge = await ctx.db.get(args.id)

    if (!challenge) {
      return null;
    }

    return challenge;
  }
})