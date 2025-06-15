import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { KanbanBoard } from './components/task/KanbanBoard';
import { TaskForm } from './components/task/TaskForm';
import { AuthModal } from './components/auth/AuthModal';
import { Modal } from './components/common/Modal';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './hooks/useAuth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, TaskStatus } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');

  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const {
    tasks,
    projects,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  } = useTasks();

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Show auth modal if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setIsAuthModalOpen(true);
    }
  }, [authLoading, isAuthenticated]);

  const handleAuthSuccess = (userData: any) => {
    setIsAuthModalOpen(false);
  };

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsAuthModalOpen(true);
  };

  const handleNewTask = (status: TaskStatus = 'todo') => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setNewTaskStatus(status);
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      createTask({ ...taskData, status: newTaskStatus });
    }
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => 
    searchQuery === '' || 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading TaskSphere...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-primary-600 hover:text-primary-700"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={filteredTasks}
            projects={projects}
            onTaskClick={handleEditTask}
            userPoints={user?.points || 0}
            userStreak={user?.streak || 0}
          />
        );
      case 'tasks':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Task Board
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Drag and drop tasks to update their status
              </p>
            </div>
            <KanbanBoard
              tasks={filteredTasks}
              onMoveTask={moveTask}
              onTaskClick={handleEditTask}
              onNewTask={handleNewTask}
            />
          </div>
        );
      case 'calendar':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Calendar View
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Calendar view coming soon! 📅
            </p>
          </div>
        );
      case 'team':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Team Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Team collaboration features coming soon! 👥
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Settings
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Appearance
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsDarkMode(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !isDarkMode 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      Light Mode
                    </button>
                    <button
                      onClick={() => setIsDarkMode(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDarkMode 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      Dark Mode
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <Dashboard
            tasks={filteredTasks}
            projects={projects}
            onTaskClick={handleEditTask}
            userPoints={user?.points || 0}
            userStreak={user?.streak || 0}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        projects={projects}
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewTask={() => handleNewTask()}
        userPoints={user?.points || 0}
        userBadges={3}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onSearch={setSearchQuery}
          notifications={2}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Task Form Modal */}
      {isAuthenticated && (
        <Modal
          isOpen={isTaskFormOpen}
          onClose={handleCloseTaskForm}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
          size="lg"
        >
          <TaskForm
            task={editingTask || undefined}
            onSave={handleSaveTask}
            onCancel={handleCloseTaskForm}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;