import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function MainNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close the dropdown if the user clicks anywhere outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 text-white px-6 flex items-center justify-between shrink-0 z-20">
      <div className="font-bold text-lg tracking-tight">Focus Planner</div>
      
      {/* Profile Dropdown Container */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          U
        </button>

        {/* The Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 z-50">
            {/* Optional User Info Header */}
            <div className="px-4 py-2 border-b border-zinc-700/50 mb-1">
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Account</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-zinc-700 hover:text-rose-300 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}