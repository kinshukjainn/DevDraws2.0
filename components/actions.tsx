"use client"

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Link2, Trash2, Pencil } from "lucide-react";
import { ConfirmModal } from "./confirm-modal";
import { useRenameModal } from "@/store/use-rename-modal";

import { toast } from "sonner";

import { useApiMutation } from "@/hooks/use-api-mutations";
import { api } from "@/convex/_generated/api";
import { Button } from "./ui/button";

interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string;
}

export const Actions = ({
    children,
    side,
    sideOffset,
    id,
    title,
}: ActionsProps) => {

    const { onOpen } = useRenameModal()

    const { mutate, pending } = useApiMutation(api.board.Remove)

    const onCopyLink = () => {
        navigator.clipboard.writeText(
            `${window.location.origin}/board/${id}`
        )
            .then(() => toast.success("Link copied"))
            .catch(() => toast.error("Failed to copy Link"))
    }

    const onDelete = () => {
        mutate({ id })
            .then(() => toast.success("Board deleted"))
            .catch(() => toast.error("Failed to delete board"))

    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    onClick={(e) => e.stopPropagation()}
                    side={side}
                    sideOffset={sideOffset}
                    className="w-60"
                >
                    <DropdownMenuItem
                        className="p-3 cursor-pointer"
                        onClick={onCopyLink}
                    >
                        <Link2
                            className="h-4 w-4 mr-2"
                        />
                        Copy Board Link
                    </DropdownMenuItem>
                    {/* DropdownMenuItem forces it to close as soon as being clicked */}
                    {/* <DropdownMenuItem> */}
                    <ConfirmModal
                        header="Delete Board?"
                        description="This will delete the board and all of its's content"
                        disabled={pending}
                        onConfirm={onDelete}
                    >
                        <Button
                            variant="ghost"
                            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
                        >
                            <Trash2
                                className="h-4 w-4 mr-2"
                            />
                            &nbsp; Delete Board
                        </Button>
                    </ConfirmModal>
                    {/* </DropdownMenuItem> */}
                    <DropdownMenuItem
                        className="p-3 cursor-pointer"
                        onClick={() => onOpen(id, title)}
                    >
                        <Pencil
                            className="h-4 w-4 mr-2"
                        />
                        Rename Board
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}