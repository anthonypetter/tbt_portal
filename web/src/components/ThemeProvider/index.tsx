import { createContext, useContext } from "react";
import React from "react";
import { UserRole } from "@generated/graphql";
import { useAuth } from "components/auth/AuthProvider";
import { fromJust } from "@utils/types";

/**
 * ThemeContext
 */

interface ThemeContextT {
  sidebar: SideBarColors;
}

type SideBarColors = {
  mainBackground: string;
  activeLinkText: string;
  activeLinkBackground: string;
  activeIconColor: string;
  inactiveLinkText: string;
  inactiveLinkBackgroundHover: string;
  inactiveIconColor: string;
};

const ThemeContext = createContext<ThemeContextT | null>(null);
ThemeContext.displayName = "ThemeContext";

/**
 * ThemeProvider
 */

type ThemeProvider = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProvider) {
  const { user } = useAuth();

  if (!user) {
    console.log("[🎩 ThemeProvider]: No theme available.");
    return <>{children}</>;
  }

  const theme = getTheme(user.role);
  console.log("[🎩 ThemeProvider]: Theme for role found:", user.role);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

function getTheme(role: UserRole): ThemeContextT {
  switch (role) {
    case UserRole.Admin:
      return {
        sidebar: {
          mainBackground: "bg-gray-700",
          activeLinkBackground: "bg-gray-800",
          activeLinkText: "text-white",
          activeIconColor: "text-gray-300",
          inactiveLinkBackgroundHover: "hover:bg-gray-600",
          inactiveLinkText: "text-gray-100",
          inactiveIconColor: "text-gray-300",
        },
      };

    case UserRole.MentorTeacher:
      return {
        sidebar: {
          mainBackground: "bg-soph-dark-blue",
          activeLinkBackground: "bg-soph-light-blue",
          activeLinkText: "text-white",
          activeIconColor: "text-white",
          inactiveLinkBackgroundHover: "hover:bg-soph-light-blue-2",
          inactiveLinkText: "text-gray-100",
          inactiveIconColor: "text-gray-300",
        },
      };

    case UserRole.TutorTeacher:
      return {
        sidebar: {
          mainBackground: "bg-deep-blue",
          activeLinkBackground: "bg-blue-600",
          activeLinkText: "text-white",
          activeIconColor: "text-white",
          inactiveLinkBackgroundHover: "hover:bg-blue-500",
          inactiveLinkText: "text-gray-100",
          inactiveIconColor: "text-gray-300",
        },
      };

    default:
      return {
        sidebar: {
          mainBackground: "bg-gray-700",
          activeLinkBackground: "bg-gray-800",
          activeLinkText: "text-white",
          activeIconColor: "text-gray-300",
          inactiveLinkBackgroundHover: "hover:bg-gray-600",
          inactiveLinkText: "text-gray-100",
          inactiveIconColor: "text-gray-300",
        },
      };
  }
}

/**
 * Hook
 */

export function useTheme() {
  const mThemeContext = useContext(ThemeContext);
  const theme = fromJust(mThemeContext, "ThemeContext");
  return theme;
}
