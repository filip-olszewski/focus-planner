interface NavbarProps {
  taskCount: number;
  isLoading: boolean;
  onAddTask: () => void;
}

export default function Navbar({ taskCount, isLoading, onAddTask }: NavbarProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 relative shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">FocusPlanner</h1>
        <span className="text-slate-300">|</span>
        <p className="text-slate-500 text-sm font-medium">
          {isLoading ? 'Loading calendar...' : `${taskCount} scheduled items`}
        </p>
      </div>
      
      <button 
        onClick={onAddTask}
        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        Add Task
      </button>
    </header>
  );
}