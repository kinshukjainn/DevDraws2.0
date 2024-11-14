import { v } from "convex/values";
import { query } from "./_generated/server";

export const Get = query({
    args: {
        orgId: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error("Unauthorized access")
        }

        const boards = await ctx.db
            .query("boards")
            .withIndex("by_org", (queri) =>
                queri.eq("orgId", args.orgId)
            )
            .order("desc")
            .collect()
        
        return boards
    }

})