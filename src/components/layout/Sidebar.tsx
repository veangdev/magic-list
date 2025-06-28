import {
  Plus,
  Award,
  Target,
  Lock,
  Settings,
  LayoutDashboard,
  CheckSquare,
} from "lucide-react";

import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onNewTask: () => void;
  userPoints: number;
  userBadges: number;
  isAuthenticated: boolean;
}

export function Sidebar({
  currentView,
  onViewChange,
  onNewTask,
  userPoints,
  userBadges,
  isAuthenticated,
}: SidebarProps) {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Magic List
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Smart Task Management
            </p>
          </div>
        </div>
      </div>

      {/* User Stats - Only show if authenticated */}
      {isAuthenticated && (
        <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 m-4 rounded-lg hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Points
            </span>
            <Badge variant="primary">{userPoints}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Badges
            </span>
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4 text-accent-600" />
              <span className="text-sm font-medium text-accent-600">
                {userBadges}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* New Task Button */}
      <div className="px-4 mb-6 mt-4">
        <Button onClick={onNewTask} className="w-full justify-center" size="md">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
              {!isAuthenticated && (
                <Lock className="w-3 h-3 ml-auto text-gray-400" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onViewChange("settings")}
          className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === "settings"
              ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>
      </div>
    </div>
  );
}
