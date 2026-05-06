import { useState } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardNavbar from '../components/DashboardNavbar';
import Sidebar from '../components/Sidebar';
import CalendarGrid from '../components/CalendarGrid';
import TaskForm from '../components/TaskForm';
import type { Task } from '../types';
import { fetchTasks, fetchUpcomingTasks, createTask, updateTask, toggleTaskComplete, deleteTask } from '../api/tasks';
import { fetchTags } from '../api/tags';

export default function Dashboard() {
  const queryClient = useQueryClient();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTask, setActiveTask] = useState<Partial<Task> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([]);

  const queryStart = startOfMonth(currentDate).toISOString();
  const queryEnd = endOfMonth(currentDate).toISOString();

  // Tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  // Calendar Tasks
  const { data: tasks = [], isFetching } = useQuery({
    queryKey: ['tasks', queryStart, queryEnd, activeTagFilters],
    queryFn: () => fetchTasks(queryStart, queryEnd, activeTagFilters),
  });

  // Sidebar Upcoming Tasks (Decoupled from calendar date!)
  const { data: rawUpcomingTasks = [] } = useQuery({
    queryKey: ['upcomingTasks'],
    queryFn: () => fetchUpcomingTasks(20),
  });

  // Filter the upcoming tasks so your tag bar filters the sidebar too
  const filteredUpcomingTasks = rawUpcomingTasks.filter(task => {
    if (activeTagFilters.length === 0) return true;
    return task.tags?.some(tag => activeTagFilters.includes(tag.id));
  });

  // Mutations (Notice they all invalidate BOTH tasks and upcomingTasks now)
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingTasks'] });
      setIsFormOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingTasks'] });
      setIsFormOpen(false);
    }
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: toggleTaskComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingTasks'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingTasks'] });
      setIsFormOpen(false);
    }
  });

  const toggleFilter = (tagId: string) => {
    setActiveTagFilters(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'isCompleted' | 'tags'> & { tagIds: string[] }) => {
    const payload = {
      name: taskData.name,
      dueDate: new Date(taskData.datetime).toISOString(),
      tagIds: taskData.tagIds,
      severity: taskData.severity
    };
    if (activeTask?.id) {
      updateMutation.mutate({ id: activeTask.id as string, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleToggleComplete = (id: string) => {
    // Check calendar tasks first, then upcoming tasks to find the actual task state
    const task = tasks.find(t => t.id === id) || rawUpcomingTasks.find(t => t.id === id);
    if (task) {
      toggleCompleteMutation.mutate({ id, isCurrentlyCompleted: task.isCompleted });
    }
    setIsFormOpen(false);
  };

  return (
    <div className="h-full bg-zinc-900 flex flex-col text-white font-sans overflow-hidden">
      <DashboardNavbar 
        currentDate={currentDate} // <--- THIS IS THE MISSING PIECE!
        onCreateTask={() => { setActiveTask(null); setIsFormOpen(true); }} 
      />
      <div className="bg-zinc-800/80 border-b border-zinc-700 px-4 py-2.5 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mr-2 shrink-0">Filter:</span>
        <button
          onClick={() => setActiveTagFilters([])}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
            activeTagFilters.length === 0 ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300'
          }`}
        >
          All
        </button>
        <div className="w-px h-4 bg-zinc-700 mx-1 shrink-0" />
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => toggleFilter(tag.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 border ${
              activeTagFilters.includes(tag.id) ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-sm' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tag.value}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Calendar Column Wrapper - ADDED flex, flex-col, and min-h-0 */}
        <div className="w-[85%] flex flex-col min-h-0 border-r border-zinc-700">
          <CalendarGrid 
            tasks={tasks} 
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onTaskClick={(task) => { setActiveTask(task); setIsFormOpen(true); }} 
            onDayClick={(date) => { setActiveTask({ datetime: date.toISOString(), severity: 3 }); setIsFormOpen(true); }} 
            isLoading={isFetching} 
          />
        </div>
        
        {/* Sidebar Column Wrapper - ADDED flex, flex-col, and min-h-0 */}
        <div className="w-[15%] flex flex-col min-h-0">
          <Sidebar 
            tasks={filteredUpcomingTasks} 
            onTaskClick={(task) => { setActiveTask(task); setIsFormOpen(true); }} 
            onToggleComplete={handleToggleComplete}
          />
        </div>

      </div>

      {isFormOpen && (
        <TaskForm 
          initialData={activeTask || undefined}
          onSubmit={handleSaveTask} 
          onCancel={() => setIsFormOpen(false)} 
          onDelete={activeTask?.id ? (id) => { if (window.confirm('Delete this task?')) deleteMutation.mutate(id); } : undefined}
          onToggleComplete={activeTask?.id ? handleToggleComplete : undefined}
        />
      )}
    </div>
  );
}