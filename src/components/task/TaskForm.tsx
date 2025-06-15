import { useState } from 'react';
import { X, Calendar, User, Tag, Clock } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface TaskFormProps {
  task?: Task;
  onSave: (taskData: Partial<Task>) => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || ('medium' as TaskPriority),
    status: task?.status || ('todo' as TaskStatus),
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    estimatedHours: task?.estimatedHours || '',
    tags: task?.tags || [],
    newTag: '',
  });

  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
  const statuses: TaskStatus[] = ['todo', 'in-progress', 'review', 'completed'];

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    const taskData: Partial<Task> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
      tags: formData.tags,
    };

    onSave(taskData);
  };

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: '',
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Task Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Enter task title..."
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Enter task description..."
        />
      </div>

      {/* Priority and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date and Estimated Hours */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Estimated Hours
          </label>
          <input
            type="number"
            value={formData.estimatedHours}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="0"
            min="0"
            step="0.5"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Tag className="w-4 h-4 inline mr-1" />
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map(tag => (
            <Badge key={tag} variant="primary" className="flex items-center gap-1">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-primary-200 rounded-full p-0.5 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.newTag}
            onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Add a tag..."
          />
          <Button onClick={handleAddTag} variant="secondary" size="sm">
            Add
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!formData.title.trim()}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </div>
  );
}