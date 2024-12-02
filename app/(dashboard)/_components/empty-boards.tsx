"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useApiMutation } from "@/hooks/use-api-mutations";

import { useOrganization } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EmptyBoards = () => {

    const router = useRouter()

    const { mutate, pending } = useApiMutation(api.board.Create)
    const { organization } = useOrganization()

    const onClick = () => {

        if (!organization) return;

        mutate({
            orgId: organization.id,
            title: "Untitled"
        })
            .then((id) => {
                toast.success("Board Created Successfully")
                //TODO: Redirect to board/{id}
                router.push(`/boards/${id}`)
            })
            .catch(() => {
                toast.error("Failed to create board")
            })
    }

    return (
        <div
            className="h-full flex flex-col items-center justify-center"
        >
            <Image
                src="./empty-boards.svg"
                alt="Empty"
                height={200}
                width={200}
            />
            <h2
                className="text-2xl font-semibold mt-6"
            >
                Create your first board
            </h2>
            <p
                className="text-muted-foreground text-sm mt-2"
            >
                Start by creating a board for your organization
            </p>
            <div className="mt-6">
                <Button
                    disabled={pending}
                    onClick={onClick}
                    size="lg">
                    Create Board
                </Button>
            </div>
        </div>
    )
}

export default EmptyBoards