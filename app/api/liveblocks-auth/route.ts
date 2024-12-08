import { Liveblocks } from "@liveblocks/node"

import { auth, currentUser } from "@clerk/nextjs"

import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const liveblocks = new Liveblocks({
    secret: (process.env.LIVEBLOCKS_SECRET_KEY!)
})

export async function POST(request: Request) {
    const authorization = await auth()
    const user = await currentUser()

    // console.log("AUTH_INFO", {
    //     authorization,
    //     user
    // })

    if (!authorization || !user) {
        return new Response("Unauthorized Access", {
            status: 403
        })
    }

    const { room } = await request.json()

    const board = await convex.query(api.board.Get, { id: room })

    // console.log("CANVAS_INFO", {
    //     room,
    //     board,
    //     boardOrgId: board?.orgId,
    //     userOrgId: authorization.orgId
    // })

    //FIXME: Updated a way to redirect unauthrorized users, need to provide feedback to frontend
    //TODO: Task on hold
    if (board?.orgId !== authorization.orgId) {
        // return new Response("Partial Access Provided", {
        //     status: 202
        // })

        const userInfo = {
            name: user.firstName || user.lastName || "Teammate",
            picture: user.imageUrl
        }

        const session = liveblocks.prepareSession(
            user.id,
            { userInfo: userInfo }
        )

        if (room) {
            session.allow(room, session.READ_ACCESS)
        }

        const { status, body } = await session.authorize()

        return new Response(body, {
            status,
            headers: { "X-User-Access": "read-only" },
        });

    }

    const userInfo = {
        name: user.firstName || user.lastName || "Teammate",
        picture: user.imageUrl
    }

    // console.log("userInfo", userInfo)

    const session = liveblocks.prepareSession(
        user.id,
        { userInfo: userInfo }
    )

    // console.log("session", session)

    if (room) {
        session.allow(room, session.FULL_ACCESS)
    }

    const { status, body } = await session.authorize()

    // console.log("Session_Status", {status, body})

    return new Response(body, {
        status,
        headers: { "X-User-Access": "full-access" },
    })
}