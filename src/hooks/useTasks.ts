import React, { useEffect, useCallback } from "react";
import { Task, TaskStatus, Project } from "../types";
import { generateMockData } from "../services/mockData";
import { useLocalStorage } from "./useLocalStorage";

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [projects, setProjects] = useLocalStorage<Project[]>("projects", []);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Load initial data (mock data if localStorage is empty)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // If localStorage is empty, load mock data
        if (tasks.length === 0 && projects.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
          const mockData = generateMockData();
          setTasks(mockData.tasks);
          setProjects(mockData.projects);
        }
      } catch (error) {
        console.error("useTasks: Error loading data:", error);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setTasks, setProjects, tasks.length, projects.length, tasks, projects]);

  const createTask = useCallback(
    (taskData: Partial<Task>) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: taskData.title || "New Task",
        description: taskData.description || "",
        status: taskData.status || "todo",
        priority: taskData.priority || "medium",
        createdBy: "current-user",
        createdAt: new Date(), // Store as ISO string
        updatedAt: new Date(), // Store as ISO string
        projectId: taskData.projectId || "default",
        tags: taskData.tags || [],
        subtasks: [],
        comments: [],
        attachments: [],
        assignedTo: taskData.assignedTo || [],
        ...taskData,
      };

      setTasks((prev) => {
        const updatedTasks = [...prev, newTask];
        return updatedTasks;
      });
    },
    [setTasks]
  );

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) => {
        const updatedTasks = prev.map((task) =>
          task.id === taskId
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        );
        return updatedTasks;
      });
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => {
        const updatedTasks = prev.filter((task) => task.id !== taskId);
        return updatedTasks;
      });
    },
    [setTasks]
  );

  const moveTask = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      updateTask(taskId, { status: newStatus });
    },
    [updateTask]
  );

  const getTasksByStatus = useCallback(
    (status: TaskStatus) => {
      const filteredTasks = tasks.filter((task) => task.status === status);
      return filteredTasks;
    },
    [tasks]
  );

  const getTasksByProject = useCallback(
    (projectId: string) => {
      const filteredTasks = tasks.filter(
        (task) => task.projectId === projectId
      );
      return filteredTasks;
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
