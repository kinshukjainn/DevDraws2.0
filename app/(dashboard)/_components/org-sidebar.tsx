"use client"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { LayoutDashboard, Star } from "lucide-react"

import { Poppins } from "next/font/google"
import { Button } from "@/components/ui/button"

import { OrganizationSwitcher } from "@clerk/nextjs"

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

const OrgSidebar = () => {

  const searchParams = useSearchParams();
  const favourites = searchParams.get("favourites")

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-2 pt-2 mr-8">
      <Link href="/">
        <div className="flex items-center">
          <Image
            src="./org-logo.svg"
            alt="Logo"
            height={100}
            width={90}
          />
          <span
            className={cn(
              "font-semibold text-2xl",
              font.className
            )}
          >
            DevDraws
          </span>
        </div>
      </Link>
      <div className="ml-3">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
              },
              organizationSwitcherTrigger: {
                padding: "6px",
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #E5E7EB"
              }
            }
          }}
        />
      </div>
      <div className="space-y-1 w-full pl-3">
        <Button
          variant={favourites? "ghost" : "secondary"}
          asChild
          size="lg"
          className="font-normal justify-start w-full px-2"
        >
          <Link href="/">
            <LayoutDashboard
              className="h-4 w-4 mr-2"
            />
            Team Boards
          </Link>
        </Button>
        <Button
          variant={favourites? "secondary" : "ghost"}
          asChild
          size="lg"
          className="font-normal justify-start w-full px-2"
        >
          <Link href={{
            pathname: "/",
            query: { favourites: true}
          } }
          >
            <Star
              className="h-4 w-4 mr-2"
            />
            Favourite Boards
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default OrgSidebar