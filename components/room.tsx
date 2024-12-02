"use client";

import { ReactNode } from "react";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

interface RoomProps {
  children: ReactNode;
  roomId: string;
  fallback: NonNullable<ReactNode> | null;
}

export const Room = ({
  children,
  roomId,
  fallback
}: RoomProps) => {
  return (
    <LiveblocksProvider
      publicApiKey={"pk_dev_Nzd_FNxJZ3MsekZ1wG7_gYi_1TfOhFk9AygbViQdSPO8Ir4L06TcAFpjIGZokvUe"}
    >
      <RoomProvider id={roomId}>
        <ClientSideSuspense
          fallback={fallback}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )

}