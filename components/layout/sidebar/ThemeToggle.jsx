"use client";

import { useTheme } from "next-themes";
import {
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ThemeToggle = ({ isCollapsed }) => {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    return theme === 'light' ? IconSun : IconMoon;
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getThemeLabel = () => {
    return theme === 'light' ? 'Light theme' : 'Dark theme';
  };

  const ThemeIcon = getThemeIcon();

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleTheme}
            className="w-full flex justify-center h-10 px-3 items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ThemeIcon className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{getThemeLabel()}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center text-sm text-muted-foreground hover:text-foreground transition-all duration-200 relative group px-3 py-2"
    >
      <ThemeIcon className="mr-3 h-4 w-4" />
      {getThemeLabel()}
      <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
    </button>
  );
};

export default ThemeToggle;
