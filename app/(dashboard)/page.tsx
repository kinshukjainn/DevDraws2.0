import { Button } from "@/components/ui/button"
import { UserButton, UserProfile } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>You are logged in</div>
      <span>
        Rejoice
      </span>
    </div>
  );
}
