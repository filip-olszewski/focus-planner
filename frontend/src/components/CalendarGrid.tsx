import { useRef } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import type { Task } from '../types';

interface CalendarGridProps {
  tasks: Task[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onTaskClick: (task: Task) => void;
  onDayClick: (date: Date) => void; 
  isLoading?: boolean;
}

export const getSeverityStyle = (severity: number) => {
  switch (severity) {
    case 1:  return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20 border-l-cyan-500 hover:bg-cyan-500/20';     
    case 2:  return 'bg-teal-500/10 text-teal-300 border-teal-500/20 border-l-teal-500 hover:bg-teal-500/20';     
    case 3:  return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 border-l-emerald-500 hover:bg-emerald-500/20'; 
    case 5:  return 'bg-amber-500/10 text-amber-300 border-amber-500/20 border-l-amber-500 hover:bg-amber-500/20'; 
    case 8:  return 'bg-orange-500/10 text-orange-300 border-orange-500/20 border-l-orange-500 hover:bg-orange-500/20'; 
    case 13: return 'bg-red-500/10 text-red-300 border-red-500/20 border-l-red-500 hover:bg-red-500/20';        
    case 21: return 'bg-rose-500/10 text-rose-300 border-rose-500/20 border-l-rose-500 hover:bg-rose-500/20';        
    default: return 'bg-zinc-700/50 text-zinc-300 border-zinc-600 border-l-zinc-500 hover:bg-zinc-700';
  }
};

export default function CalendarGrid({ tasks, currentDate, onDateChange, onTaskClick, onDayClick, isLoading }: CalendarGridProps) {
  const scrollTimeoutRef = useRef<number>(0);

  const nextMonth = () => onDateChange(addMonths(currentDate, 1));
  const prevMonth = () => onDateChange(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Safely calculate the exact number of rows we need based on the month
  const weeks = calendarDays.length / 7;
  const gridRowsClass = weeks === 4 ? 'grid-rows-4' : weeks === 5 ? 'grid-rows-5' : 'grid-rows-6';

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const scrollableContainer = target.closest('.custom-scrollbar');
    if (scrollableContainer && scrollableContainer.scrollHeight > scrollableContainer.clientHeight) return; 

    const now = Date.now();
    if (now - scrollTimeoutRef.current < 350) return; 

    if (e.deltaY > 15) {
      nextMonth();
      scrollTimeoutRef.current = now;
    } else if (e.deltaY < -15) {
      prevMonth();
      scrollTimeoutRef.current = now;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-800 overflow-hidden" onWheel={handleWheel}>
      
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-zinc-700 bg-zinc-800 shrink-0">
        {weekDays.map(day => (
          <div key={day} className="py-2.5 text-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-r last:border-r-0 border-zinc-700">
            {day}
          </div>
        ))}
      </div>

      {/* Grid Body - Using explicit Tailwind Row constraints */}
      <div className={`flex-1 grid grid-cols-7 ${gridRowsClass} min-h-0 bg-zinc-700/50 gap-px`}>
        {calendarDays.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isTodayDate = isSameDay(day, new Date());
          
          // SKELETON LOADER
          if (isLoading) {
            return (
              <div key={`skel-${i}`} className={`min-h-0 flex flex-col overflow-hidden ${!isCurrentMonth ? 'bg-zinc-800/60' : 'bg-zinc-800'}`}>
                <div className="p-1.5 pb-0.5 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-zinc-700/40 animate-pulse" />
                </div>
                <div className="flex-1 px-1.5 pb-1.5 flex flex-col gap-[3px] overflow-hidden">
                  {isCurrentMonth && i % 3 !== 0 && <div className="h-[24px] w-full rounded border border-zinc-700/30 bg-zinc-700/20 animate-pulse shrink-0" />}
                  {isCurrentMonth && i % 2 === 0 && <div className="h-[24px] w-4/5 rounded border border-zinc-700/30 bg-zinc-700/20 animate-pulse shrink-0" />}
                </div>
              </div>
            );
          }

          const dayTasks = tasks
            .filter(task => isSameDay(new Date(task.datetime), day))
            .sort((a, b) => {
              if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
              return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
            });

          return (
            <div 
              key={day.toString()} 
              onClick={() => onDayClick(day)}
              // THE FIX: overflow-hidden on the cell itself prevents the grid from stretching
              className={`min-h-0 flex flex-col overflow-hidden transition-colors cursor-pointer group
                ${!isCurrentMonth ? 'bg-zinc-800/60 text-zinc-500' : 'bg-zinc-800 text-zinc-200'}
                ${isTodayDate ? 'bg-zinc-700/30 hover:bg-zinc-700/50' : 'hover:bg-zinc-700/30'}
              `}
            >
              {/* DATE HEADER (shrink-0 keeps it exactly this size) */}
              <div className="p-1.5 pb-0.5 shrink-0 flex justify-between items-start">
                <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full transition-colors
                  ${isTodayDate ? 'bg-indigo-500 text-white group-hover:bg-indigo-400' : 'group-hover:bg-zinc-700'}
                `}>
                  {format(day, 'd')}
                </span>
              </div>
              
              {/* TASK CONTAINER (flex-1 + overflow-y-auto traps all scrolling strictly inside) */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-1.5 pb-1.5 flex flex-col gap-[3px]">
                {dayTasks.map(task => {
                  const severityStyles = getSeverityStyle(task.severity);
                  const completedStyles = task.isCompleted ? 'opacity-30 grayscale hover:opacity-50 line-through' : '';
                  
                  return (
                    <div 
                      key={task.id} 
                      onClick={(e) => { e.stopPropagation(); onTaskClick(task); }}
                      title={`Tags: ${task.tags?.map(t => t.value).join(', ') || 'None'} • Severity: ${task.severity}`}
                      // Added shrink-0 so tasks don't compress weirdly inside the scroll container
                      className={`shrink-0 flex items-center gap-1.5 text-[11px] leading-tight px-1.5 py-1 rounded border border-l-[3px] cursor-pointer transition-all duration-200 ${severityStyles} ${completedStyles}`}
                    >
                      {task.hasTime && <span className="font-bold opacity-80 shrink-0">{format(new Date(task.datetime), 'HH:mm')}</span>}
                      <span className="truncate font-medium flex-1">{task.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}