import { format, isToday, isTomorrow, isPast } from 'date-fns';
import type { Task } from '../types';

// A specific helper just for the Sidebar's flat vertical strip design
const getSeverityBorder = (severity: number) => {
  switch (severity) {
    case 1:  return 'border-cyan-500';
    case 2:  return 'border-teal-500';
    case 3:  return 'border-emerald-500';
    case 5:  return 'border-amber-500';
    case 8:  return 'border-orange-500';
    case 13: return 'border-red-500';
    case 21: return 'border-rose-500';
    default: return 'border-zinc-500';
  }
};

interface SidebarProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onToggleComplete: (id: string) => void;
}

export default function Sidebar({ tasks, onTaskClick, onToggleComplete }: SidebarProps) {
  // Sort tasks: Incomplete first, then by date.
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });

  const upcomingTasks = sortedTasks.filter(task => !task.isCompleted).slice(0, 15);
  const completedTasks = sortedTasks.filter(task => task.isCompleted).slice(0, 5);

  const formatTaskDate = (dateString: string, hasTime: boolean) => {
    const date = new Date(dateString);
    if (isToday(date)) return hasTime ? `Today, ${format(date, 'HH:mm')}` : 'Today';
    if (isTomorrow(date)) return hasTime ? `Tomorrow, ${format(date, 'HH:mm')}` : 'Tomorrow';
    return hasTime ? format(date, 'MMM d, HH:mm') : format(date, 'MMM d');
  };

  const isOverdue = (dateString: string) => isPast(new Date(dateString)) && !isToday(new Date(dateString));

  const TaskCard = ({ task }: { task: Task }) => (
    <div 
      onClick={() => onTaskClick(task)}
      // Added the vertical strip here (border-l-[3px] and pl-3)
      className={`flex justify-between items-start mb-4 cursor-pointer group pl-3 border-l-[3px] transition-colors ${
        task.isCompleted ? 'border-zinc-700/50' : getSeverityBorder(task.severity)
      }`}
    >
      <div className="flex-1 min-w-0 pr-3">
        {/* Flat Tag List */}
        <div className="flex flex-wrap gap-1 mb-1">
          {task.tags?.map(tag => (
            <span key={tag.id} className="text-[10px] font-bold uppercase tracking-wide bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
              {tag.value}
            </span>
          ))}
          {(!task.tags || task.tags.length === 0) && (
            <span className="text-[10px] text-zinc-600">No Tags</span>
          )}
        </div>
        
        {/* Simple Text Title */}
        <h4 className={`text-sm font-medium truncate transition-colors ${
          task.isCompleted ? 'line-through text-zinc-600' : 'text-zinc-200 group-hover:text-indigo-400'
        }`}>
          {task.name}
        </h4>
        
        {/* Date and Severity */}
        <div className="flex gap-2 items-center mt-0.5">
          <span className={`text-[11px] font-medium ${isOverdue(task.datetime) && !task.isCompleted ? 'text-rose-400' : 'text-zinc-500'}`}>
            {formatTaskDate(task.datetime, task.hasTime)}
          </span>
        </div>
      </div>
      
      {/* Minimal Checkbox */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(task.id as string);
        }}
        className={`mt-1 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
          task.isCompleted 
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
            : 'border-zinc-500 bg-transparent hover:border-indigo-400 text-transparent hover:text-indigo-400'
        }`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </button>
    </div>
  );

  return (
    <div className="h-full bg-zinc-900/50 flex flex-col custom-scrollbar overflow-y-auto p-4 border-l border-zinc-700/50">
      <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Upcoming Tasks</h2>
      
      {upcomingTasks.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-sm">
          No pending tasks! 🎉
        </div>
      ) : (
        upcomingTasks.map(task => <TaskCard key={task.id} task={task} />)
      )}

      {completedTasks.length > 0 && (
        <>
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-6 mb-4">Recently Completed</h2>
          {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
        </>
      )}
    </div>
  );
}