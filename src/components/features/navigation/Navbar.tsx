import { NavLink } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/shared/logo";

export default function Navbar() {
  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `${buttonVariants({ variant: isActive ? "secondary" : "ghost" })} 
    px-4 py-2 transition-all font-semibold text-sm
    ${
      isActive
        ? "!bg-[#bbf7d0] !text-[#064e3b]"
        : "text-muted-foreground hover:!bg-[#bbf7d0] hover:!text-[#064e3b]"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#bbf7d0] bg-muted">
      <div className="flex h-16 items-center w-full px-6">
        <div className="flex w-[180px]">
          <NavLink to="/dashboard" className="flex items-center">
            <Logo />
          </NavLink>
        </div>

        <div className="flex flex-1 items-center justify-center space-x-1">
          <NavLink to="/dashboard" className={navLinkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/goals" className={navLinkStyle}>
            Goals
          </NavLink>
          <a href="#dictionary" className={navLinkStyle({ isActive: false })}>
            Learn
          </a>
        </div>

        <div className="flex w-[180px] items-center justify-end space-x-4">
          <Button variant="ghost" size="icon" asChild className="h-10 w-10">
            <NavLink to="/settings">
              <Icons.settingsIcon className="!h-6 !w-6" />
              <span className="sr-only">Settings</span>
            </NavLink>
          </Button>

          <div>
            <Avatar className="h-9 w-9 border border-border transition">
              <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}
