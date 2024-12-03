import { Liveblocks } from "@liveblocks/node"

import { auth, currentUser } from "@clerk/nextjs"

import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const liveblocks = new Liveblocks({
    secret: "sk_dev_2ednSuxGIxniQaoroOG4QeAtT2F67qXpJpPX720VRfX3x3hevTXVBGmqY_dDDKt7"
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

    //FIXME: Update a way to redirect unauthrorized users, as they are still able to see the board loading screen
    if (board?.orgId !== authorization.orgId) {
        return new Response("Unauthorized Access", {
            status: 403
        })
    } 

    const userInfo = {
        name: user.firstName || "Anonymous",
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

    return new Response(body, {status})

}