import React from "react";
import { format } from "date-fns";
import { Calendar, Paperclip, Clock, Flag, Trash2 } from "lucide-react";

import { Task } from "../../types";
import { Badge } from "../common/Badge";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onClick, onDelete }: TaskCardProps) {
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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete()
  };

  return (
    <>
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
            <button
              onClick={handleDeleteClick}
              className="opacity-0 group-hover:opacity-100 text-gray-500 dark:text-gray-400 hover:text-error-600 dark:hover:text-error-500 transition-opacity duration-200"
              title="Delete Task"
              aria-label="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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
    </>
  );
}
