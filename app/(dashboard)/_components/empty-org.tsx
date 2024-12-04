import Image from "next/image"
import { CreateOrganization } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog"

const EmptyOrg = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="./element.svg"
                alt="Empty"
                height={300}
                width={400}
            >
            </Image>
            <h2
                className="text-2xl font-semibold mt-6"
            >
                Welcome to <span className="text-[#6c63ff]">DevDraws</span>: Where Imagination meets Tech
            </h2>
            <p
                className="text-muted-foreground text-sm mt-2"
            >
                Create an organization to get started
            </p>
            <div
                className="mt-6"
            >
                <Dialog>
                    <DialogTrigger>
                        <Button size="lg">
                           Create Organization 
                        </Button>
                    </DialogTrigger>
                    <DialogContent
                        className="p-0 bg-transparent border-none max-w-[480px]"
                    >
                        <CreateOrganization />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default EmptyOrg