import { Outlet } from 'react-router';

export default function DefaultLayout() {
  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-800 overflow-hidden">
      
      {/* Global Main Navbar */}
      <header className="h-14 bg-zinc-900 border-b border-zinc-800 text-white px-6 flex items-center justify-between shrink-0 z-20">
        <div className="font-bold text-lg tracking-tight">Focus Planner</div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
            U
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Outlet /> 
      </div>

      {/* Global Footer */}
      <footer className="h-8 bg-zinc-900 border-t border-zinc-800 text-zinc-500 text-xs flex items-center justify-center shrink-0 z-20">
        © 2026 FocusPlanner. All rights reserved.
      </footer>

    </div>
  );
}