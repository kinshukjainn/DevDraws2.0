"use client"

import { useOthers, useSelf } from "@liveblocks/react/suspense"

import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "./subcomponents/user-avatar"
import { connectionIdToColor } from "@/lib/utils"

const MAX_USERS_SHOWN_AT_ONCE = 2

export const Participants = () => {

    //Getting other users connected to the room
    const users = useOthers()
    //Getting yourself
    const currentUser = useSelf()

    const hasMoreUsers = users.length > MAX_USERS_SHOWN_AT_ONCE

    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
            <div className="flex gap-x-2">
                {users
                    .slice(0, MAX_USERS_SHOWN_AT_ONCE)
                    .map(({ connectionId, info }) => {
                        return (
                            <UserAvatar
                                key={connectionId}
                                src={info?.picture}
                                name={info?.name}
                                fallback={info?.name?.[0] || "T"}
                                borderColor={connectionIdToColor(connectionId)}
                            />
                        )
                    })
                }

                {currentUser && (
                    <UserAvatar
                        src={currentUser.info?.picture}
                        name={`${currentUser.info?.name} (You)`}
                        fallback={currentUser.info?.name?.[0]}
                        borderColor={connectionIdToColor(currentUser.connectionId)}
                    />
                )}


                {hasMoreUsers && (
                    <UserAvatar
                        name={`${users.length - MAX_USERS_SHOWN_AT_ONCE} more`}
                        fallback={`+${users.length - MAX_USERS_SHOWN_AT_ONCE}`}
                    />
                )}

            </div>
        </div>
    )
}

export const ParticipantsSkeleton = () => {
    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]">
            <Skeleton className="h-full w-full bg-muted" />
        </div>
    )
}