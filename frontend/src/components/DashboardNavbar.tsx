import { format } from 'date-fns';

interface DashboardNavbarProps {
  currentDate: Date;
  onCreateTask: () => void;
}

export default function DashboardNavbar({ currentDate, onCreateTask }: DashboardNavbarProps) {
  return (
    <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex justify-between items-center shrink-0">
      
      {/* Current Viewed Month & Year */}
      <h2 className="text-lg font-bold text-white tracking-wide">
        {format(currentDate, 'MMMM yyyy')}
      </h2>

      {/* Action Button */}
      <button 
        onClick={onCreateTask}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-md shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
        </svg>
        New Task
      </button>
      
    </div>
  );
}