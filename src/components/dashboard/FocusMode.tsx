import { Task } from "../../types";
import { TaskCard } from "../task/TaskCard";
import { Button } from "../common/Button";
interface FocusModeProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onRefresh: () => void;
  onDeleteTask: (id: string) => void;
}

export function FocusMode({
  tasks,
  onTaskClick,
  onRefresh,
  onDeleteTask,
}: FocusModeProps) {
  // AI-driven prioritization (simplified algorithm)
  const prioritizeTasks = (tasks: Task[]): Task[] => {
    const now = new Date();

    return tasks
      .filter((task) => task.status !== "completed")
      .map((task) => {
        let score = 0;

        // Priority weight
        const priorityWeights = { low: 1, medium: 2, high: 3, urgent: 4 };
        score += priorityWeights[task.priority] * 25;

        // Due date urgency
        if (task.dueDate) {
          const daysUntilDue = Math.ceil(
            (new Date(task.dueDate).getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          if (daysUntilDue < 0) score += 100; // Overdue
          else if (daysUntilDue <= 1) score += 75; // Due today/tomorrow
          else if (daysUntilDue <= 3) score += 50; // Due this week
          else if (daysUntilDue <= 7) score += 25; // Due next week
        }

        // Incomplete subtasks penalty
        const incompleteTasks = task.subtasks.filter(
          (st) => !st.completed
        ).length;
        if (incompleteTasks > 0) score += incompleteTasks * 10;

        return { ...task, aiScore: score };
      })
      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
      .slice(0, 3);
  };

  const focusTasks = prioritizeTasks(tasks);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <div className="w-2 h-2 bg-primary-600 rounded-full mr-2 animate-pulse" />
            Focus Mode
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            AI-prioritized tasks for maximum productivity
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      {focusTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-400 dark:text-gray-600">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-sm">All caught up! Great work!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {focusTasks.map((task, index) => (
            <div key={task.id} className="relative">
              <div className="absolute -left-2 top-4 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <div className="ml-6">
                <TaskCard
                  task={task}
                  onClick={() => onTaskClick(task)}
                  onEdit={() => onTaskClick(task)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
