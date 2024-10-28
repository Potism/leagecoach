import { GamingIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <GamingIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              LoL AI Coach
            </span>
          </a>
        </div>
      </div>
    </nav>
  )
}