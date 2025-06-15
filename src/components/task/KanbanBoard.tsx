import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onNewTask: (status: TaskStatus) => void;
}

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900/20' },
  { id: 'completed', title: 'Completed', color: 'bg-green-100 dark:bg-green-900/20' },
];

export function KanbanBoard({ tasks, onMoveTask, onTaskClick, onNewTask }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (result: any) => {
    setDraggedTask(result.draggableId);
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggedTask(null);
    
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;
    
    onMoveTask(taskId, newStatus);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              {/* Column Header */}
              <div className={`${column.color} rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {column.title}
                  </h3>
                  <Badge variant="default">
                    {columnTasks.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNewTask(column.id)}
                  className="w-full justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Task
                </Button>
              </div>

              {/* Column Content */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transform transition-all duration-200 ${
                              snapshot.isDragging 
                                ? 'rotate-2 scale-105 shadow-2xl z-50' 
                                : draggedTask === task.id 
                                  ? 'opacity-50' 
                                  : 'hover:scale-102'
                            }`}
                          >
                            <TaskCard
                              task={task}
                              onClick={() => onTaskClick(task)}
                              onEdit={() => onTaskClick(task)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {columnTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-400 dark:text-gray-600">
                        <div className="text-4xl mb-2">📋</div>
                        <p className="text-sm">No tasks yet</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}