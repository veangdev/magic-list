import React from "react";
import { isEmpty } from "lodash";
import { Search, Bell, Sun, Moon, User, LogOut } from "lucide-react";

import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSearch: (query: string) => void;
  notifications: number;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({
  isDarkMode,
  onToggleTheme,
  onSearch,
  notifications,
  user,
  onLogin,
  onLogout,
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const userInfo: HeaderProps["user"] = React.useMemo(() => {
    return isEmpty(user) ? undefined : user;
  }, [user]);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks, projects, or team members..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="p-2"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {userInfo ? (
            <React.Fragment>
              {/* Notifications */}
              <div className="relative hidden">
                <Button variant="ghost" size="sm" className="p-2">
                  <Bell className="w-5 h-5" />
                </Button>
                {notifications > 0 && (
                  <Badge
                    variant="error"
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-[1.25rem] h-5 flex items-center justify-center"
                  >
                    {notifications > 9 ? "9+" : notifications}
                  </Badge>
                )}
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    {userInfo.avatar ? (
                      <img
                        src={userInfo.avatar}
                        alt={userInfo.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userInfo.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userInfo.email}
                    </p>
                  </div>
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {userInfo.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {userInfo.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </React.Fragment>
          ) : (
            <Button onClick={onLogin} size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
