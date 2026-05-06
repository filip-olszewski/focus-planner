import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../types';
import { fetchTags, createTag } from '../api/tags';

interface TaskFormProps {
  initialData?: Partial<Task>; 
  // We send tagIds to the parent instead of the full tag objects
  onSubmit: (task: Omit<Task, 'id' | 'isCompleted' | 'tags'> & { tagIds: string[] }) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  onToggleComplete?: (id: string) => void;
}

export default function TaskForm({ initialData, onSubmit, onCancel, onDelete, onToggleComplete }: TaskFormProps) {
  const queryClient = useQueryClient();
  const fibonacciOptions = [1, 2, 3, 5, 8, 13, 21];
  const isEditing = !!initialData?.id; 

  // Time setup
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  const initialDateObj = initialData?.datetime ? new Date(initialData.datetime) : null;
  const initHour = initialData?.hasTime && initialDateObj ? format(initialDateObj, 'HH') : '';
  const initMinute = initialData?.hasTime && initialDateObj ? format(initialDateObj, 'mm') : '';

  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    date: initialDateObj ? format(initialDateObj, 'yyyy-MM-dd') : '',
    hour: initHour,
    minute: initMinute,
    severity: initialData?.severity || 3 as Task['severity'],
  });

  // Track selected tags by ID
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags?.map(t => t.id) || []
  );

  // New Tag Creation State
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');

  // Fetch Tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  // Mutation to create a new tag on the fly
  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setSelectedTagIds(prev => [...prev, newTag.id]); // Auto-select it
      setIsCreatingTag(false);
      setNewTagValue('');
    }
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreateTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagValue.trim()) {
      createTagMutation.mutate(newTagValue.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userProvidedTime = formData.hour !== '' && formData.minute !== '';
    const finalTime = userProvidedTime ? `${formData.hour}:${formData.minute}` : '00:00';
    const finalDateTime = `${formData.date}T${finalTime}`;

    onSubmit({
      name: formData.name,
      datetime: finalDateTime,
      hasTime: userProvidedTime,
      tagIds: selectedTagIds,
      severity: formData.severity,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-zinc-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-zinc-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-semibold text-white mb-6">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Task Name</label>
            <input 
              type="text" required autoFocus 
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none placeholder-zinc-500"
              placeholder="e.g., Deploy to Production"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-[2]">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Date *</label>
              <input 
                type="date" required 
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none [color-scheme:dark]"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})} 
              />
            </div>
            
            <div className="flex-[1.5]">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Time <span className="font-normal text-zinc-500">(Opt)</span></label>
              <div className="flex items-center gap-1">
                <select 
                  className="w-full px-2 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  value={formData.hour}
                  onChange={e => setFormData({...formData, hour: e.target.value})}
                >
                  <option value="">--</option>
                  {hours.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className="text-zinc-500 font-bold">:</span>
                <select 
                  className="w-full px-2 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  value={formData.minute}
                  onChange={e => setFormData({...formData, minute: e.target.value})}
                >
                  <option value="">--</option>
                  {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* NEW TAG SELECTOR UI */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' 
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tag.value}
                  </button>
                );
              })}
              
              {/* Inline Create Tag Button/Form */}
              {!isCreatingTag ? (
                <button
                  type="button"
                  onClick={() => setIsCreatingTag(true)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-zinc-600 text-zinc-500 hover:text-zinc-300 hover:border-zinc-400 transition-colors flex items-center gap-1"
                >
                  + New Tag
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Tag name..."
                    className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={newTagValue}
                    onChange={(e) => setNewTagValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateTagSubmit(e);
                      } else if (e.key === 'Escape') {
                        setIsCreatingTag(false);
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={handleCreateTagSubmit}
                    disabled={createTagMutation.isPending || !newTagValue.trim()}
                    className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsCreatingTag(false)}
                    className="p-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Severity</label>
            <select 
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={formData.severity}
              onChange={e => setFormData({...formData, severity: Number(e.target.value) as Task['severity']})}
            >
              {fibonacciOptions.map(num => <option key={num} value={num}>{num}</option>)}
            </select>
          </div>

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-zinc-700">
            <div className="flex gap-2">
              {isEditing && onDelete && (
                <button type="button" onClick={() => onDelete(initialData.id as string)} className="px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-400/10 rounded-md transition-colors">
                  Delete
                </button>
              )}
              {isEditing && onToggleComplete && (
                <button type="button" onClick={() => onToggleComplete(initialData.id as string)} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${initialData.isCompleted ? 'text-zinc-400 hover:bg-zinc-700' : 'text-emerald-400 hover:bg-emerald-400/10'}`}>
                  {initialData.isCompleted ? 'Mark Incomplete' : 'Complete Task'}
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 rounded-md transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm transition-colors">
                {isEditing ? 'Save Changes' : 'Save Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}