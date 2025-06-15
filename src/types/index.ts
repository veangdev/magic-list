export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  theme: 'light' | 'dark';
  points: number;
  badges: Badge[];
  streak: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assignedTo?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  tags: string[];
  subtasks: Subtask[];
  comments: Comment[];
  attachments: Attachment[];
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  ownerId: string;
  members: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

export interface ProjectMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface ViewMode {
  type: 'kanban' | 'list' | 'calendar' | 'timeline';
  filters: TaskFilters;
  sort: TaskSort;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignedTo?: string[];
  tags?: string[];
  dueDate?: {
    start?: Date;
    end?: Date;
  };
  search?: string;
}

export interface TaskSort {
  field: 'title' | 'dueDate' | 'priority' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'task_overdue' | 'comment_added' | 'badge_earned';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedId?: string;
}