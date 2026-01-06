import { useTheme } from "next-themes";
import { useSettingsStore } from "../store/settingsStore";

const useLayout = () => {
  const { isFullScreen, isSideMenuOpen, toggleSideMenu } = useSettingsStore();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const handleSideMenu = () => {
    toggleSideMenu();
  };

  // Determine current color mode based on resolvedTheme for explicit light/dark
  const colorMode = resolvedTheme || "light";

  return {
    isFullScreen,
    isSideMenuOpen,
    colorMode, // 'light' or 'dark'
    currentTheme: theme, // actual theme value (system, light, dark)
    setTheme, // function to change theme
    handleSideMenu,
  };
};

export default useLayout;
