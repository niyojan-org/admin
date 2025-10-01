"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
  IconSettings,
  IconLogout,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UserProfile = ({ user, organization, isCollapsed, onLogout }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getThemeIcon = () => {
    return theme === 'light' ? IconSun : IconMoon;
  };

  const getThemeLabel = () => {
    return theme === 'light' ? 'Light' : 'Dark';
  };

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="h-10 w-10 rounded-full p-0 flex items-center justify-center">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{user?.name || "User"}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  const ThemeIcon = getThemeIcon();

  return (
    <div className="space-y-2">
      {/* User Info */}
      <div className="flex items-center space-x-3 px-3 py-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Action Links */}
      <div className="space-y-2 px-3">
        <Link
          href="/dashboard/settings"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-all duration-200 relative group"
        >
          <IconSettings className="mr-2 h-4 w-4" />
          Settings
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
        </Link>
        {/* <button
          onClick={toggleTheme}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-all duration-200 relative group w-full text-left"
        >
          <ThemeIcon className="mr-2 h-4 w-4" />
          Theme: {getThemeLabel()}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
        </button> */}
        <button
          onClick={onLogout}
          className="flex items-center text-sm text-destructive hover:text-red-700 transition-all duration-200 cursor-pointer relative group"
        >
          <IconLogout className="mr-2 h-4 w-4" />
          Logout
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
