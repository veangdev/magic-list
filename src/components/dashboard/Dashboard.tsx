import {
  CheckSquare,
  Clock,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

import { StatsCard } from "./StatsCard";
import { FocusMode } from "./FocusMode";
import { Task, Project } from "../../types";

interface DashboardProps {
  tasks: Task[];
  projects: Project[];
  onTaskClick: (task: Task) => void;
  userPoints: number;
  userStreak: number;
}

export function Dashboard({
  tasks,
  projects,
  onTaskClick,
  userPoints,
  userStreak,
}: DashboardProps) {
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const activeTasks = tasks.filter(
    (task) => task.status !== "completed"
  ).length;

  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-primary-100">
          {activeTasks > 0 ? (
            <>
              You have {activeTasks} active tasks
              {userStreak > 0 && ` and you're on a ${userStreak}-day streak!`}
            </>
          ) : (
            "All caught up! Great work on staying productive."
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Completed Tasks"
          value={completedTasks}
          icon={<CheckSquare className="w-6 h-6" />}
          trend={{ value: 12, label: "from last week" }}
          color="success"
        />
        <StatsCard
          title="Active Tasks"
          value={activeTasks}
          icon={<Clock className="w-6 h-6" />}
          color="primary"
        />
        <StatsCard
          title="Team Projects"
          value={projects.length}
          icon={<Users className="w-6 h-6" />}
          color="warning"
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          trend={{ value: 5, label: "improvement" }}
          color="success"
        />
      </div>

      {/* Focus Mode and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FocusMode
            tasks={tasks}
            onTaskClick={onTaskClick}
            onRefresh={() => window.location.reload()}
          />
        </div>

        <div className="space-y-6">
          {/* Gamification Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-accent-600" />
              Your Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Points
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    {userPoints}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((userPoints % 1000) / 10, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {userPoints > 0
                    ? `${1000 - (userPoints % 1000)} points to next level`
                    : "Complete tasks to earn points!"}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Streak
                  </span>
                  <span className="text-lg font-bold text-accent-600">
                    {userStreak} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
