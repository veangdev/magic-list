import { Calendar, Paperclip, Clock, Flag } from "lucide-react";
import { Task } from "../../types";
import { Badge } from "../common/Badge";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onEdit: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const priorityColors = {
    low: "success",
    medium: "warning",
    high: "error",
    urgent: "error",
  } as const;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight flex-1 pr-2">
          {task.title}
        </h3>
        <div className="flex items-center space-x-1">
          <Badge variant={priorityColors[task.priority]} size="sm">
            <Flag className="w-3 h-3 mr-1" />
            {task.priority}
          </Badge>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="default" size="sm">
              {tag}
            </Badge>
          ))}
          {task.tags.length > 3 && (
            <Badge variant="default" size="sm">
              +{task.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Progress Indicator */}
      {/* {task.subtasks.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Subtasks</span>
            <span>
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
              style={{ 
                width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` 
              }}
            />
          </div>
        </div>
      )} */}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
          {task.dueDate && (
            <div
              className={`flex items-center space-x-1 ${
                isOverdue ? "text-error-600" : ""
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(task.dueDate), "MMM d")}</span>
            </div>
          )}

          {/* {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{task.assignedTo.length}</span>
            </div>
          )} */}

          {/* {task.comments.length > 0 && (
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-3 h-3" />
              <span>{task.comments.length}</span>
            </div>
          )}
           */}
          {task.attachments.length > 0 && (
            <div className="flex items-center space-x-1">
              <Paperclip className="w-3 h-3" />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>

        {task.estimatedHours && (
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{task.estimatedHours}h</span>
          </div>
        )}
      </div>

      {isOverdue && (
        <div className="mt-2 text-xs text-error-600 font-medium">Overdue</div>
      )}
    </div>
  );
}
