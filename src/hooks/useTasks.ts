import React from "react";

import { Task, TaskStatus, Project } from "../types";
import { generateMockData } from "../services/mockData";

export function useTasks() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockData = generateMockData();
        setTasks(mockData.tasks);
        setProjects(mockData.projects);
      } catch {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const createTask = React.useCallback((taskData: Partial<Task>) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title || "New Task",
      description: taskData.description || "",
      status: taskData.status || "todo",
      priority: taskData.priority || "medium",
      createdBy: "current-user",
      createdAt: new Date(),
      updatedAt: new Date(),
      projectId: taskData.projectId || "default",
      tags: taskData.tags || [],
      subtasks: [],
      comments: [],
      attachments: [],
      assignedTo: taskData.assignedTo || [],
      ...taskData,
    };

    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTask = React.useCallback(
    (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        )
      );
    },
    []
  );

  const deleteTask = React.useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const moveTask = React.useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      updateTask(taskId, { status: newStatus });
    },
    [updateTask]
  );

  const getTasksByStatus = React.useCallback(
    (status: TaskStatus) => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  const getTasksByProject = React.useCallback(
    (projectId: string) => {
      return tasks.filter((task) => task.projectId === projectId);
    },
    [tasks]
  );

  return {
    tasks,
    projects,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
    getTasksByProject,
  };
}
