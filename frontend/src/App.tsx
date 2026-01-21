import React, { useEffect, useState, useRef } from 'react';
import type { Task, ViewMode } from './types';
import { db } from './services/storage';
import { Column } from './components/Column';
import { EditModal } from './components/EditModal';
import { ThemeProvider } from './components/ThemeContext';
import { useTheme } from './hooks/useTheme';
import { AuthProvider } from './components/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { Background3D } from './components/Background3D';
import { FlashcardModule } from './components/FlashcardModule';
import { FocusTimer } from './components/FocusTimer';
import { GamificationHUD } from './components/GamificationHUD';
import { CommandPalette } from './components/CommandPalette';
import { audioManager } from './services/audioService';
import { Search, Wifi, WifiOff, Box, Settings, LogOut, PlusCircle, Layout, Brain, Volume2, VolumeX, Languages, X, Check } from 'lucide-react';
import { Logo } from './components/Logo';
import { ModeToggle } from './components/ModeToggle';
import { useTasks } from './hooks/useTasks';
import { useColumns } from './hooks/useColumns';
import { useMode } from './contexts/ModeContext';
import './index.css';

const Dashboard = () => {
  const { theme, toggleTheme, language, setLanguage, t } = useTheme();
  const { user, logout, updateUserXp } = useAuth();
  const { mode } = useMode();
  const [view, setView] = useState<ViewMode>('board');
  
  // Dual Mode API - Hooks pour PWA/DDAW
  const { tasks, createTask: createTaskAPI, updateTask: updateTaskAPI, deleteTask: deleteTaskAPI, refresh: refreshTasks } = useTasks();
  const { columns, createColumn: createColumnAPI, deleteColumn: deleteColumnAPI } = useColumns();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMuted, setIsMuted] = useState(false);
  
  // Add Column State
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  
  // Drag State
  const dragItem = useRef<{id: string, columnId: string} | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string>('todo');

  // Seed IndexedDB au premier lancement (mode PWA uniquement)
  useEffect(() => {
    const seedData = async () => {
      if (mode === 'pwa') {
        await db.seedIfNeeded();
        refreshTasks();
      }
    };
    seedData();
  }, [mode, refreshTasks]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleMute = () => {
      audioManager.toggleMute();
      setIsMuted(audioManager.getMuteState());
  }

  const toggleLanguage = () => {
      setLanguage(language === 'fr' ? 'en' : 'fr');
      audioManager.play('click', theme);
  }

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, id: string, columnId: string) => {
    dragItem.current = { id, columnId };
    e.dataTransfer.effectAllowed = 'move';
    audioManager.play('hover', theme);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const dragged = dragItem.current;
    if (!dragged) return;

    if (dragged.columnId !== targetColumnId) {
      try {
        await updateTaskAPI(dragged.id, { columnId: targetColumnId });
        
        // XP bonus si tâche complétée
        if (targetColumnId === 'done' && dragged.columnId !== 'done') {
          updateUserXp(50);
        }
        audioManager.play('success', theme);
      } catch (error) {
        console.error('Error moving task:', error);
        audioManager.play('error', theme);
      }
    }
    dragItem.current = null;
  };

  // --- Task Management ---
  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (taskData.id) {
        // Mise à jour d'une tâche existante
        await updateTaskAPI(taskData.id, taskData);
      } else {
        // Création d'une nouvelle tâche
        const newTask = {
          title: taskData.title || t('new_protocol'),
          description: taskData.description || '',
          priority: taskData.priority || 'medium',
          tags: taskData.tags || [],
          columnId: taskData.columnId || columns[0]?.id || 'todo',
          subtasks: taskData.subtasks || [],
          comments: taskData.comments || [],
          dueDate: taskData.dueDate
        };
        await createTaskAPI(newTask);
        updateUserXp(10);
      }
      audioManager.play('success', theme);
    } catch (error) {
      console.error('Error saving task:', error);
      audioManager.play('error', theme);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm(t('confirm_action'))) {
      try {
        await deleteTaskAPI(id);
        audioManager.play('error', theme);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const openNewTaskModal = (columnId?: string) => {
    setEditingTask(null);
    setTargetColumnId(columnId || 'todo');
    setIsModalOpen(true);
    audioManager.play('click', theme);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
    audioManager.play('click', theme);
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return;
    try {
      const maxOrder = columns.length > 0 ? Math.max(...columns.map(c => c.order)) : -1;
      
      const newCol = {
        title: newColumnTitle.trim(),
        order: maxOrder + 1
      };

      await createColumnAPI(newCol);
      setNewColumnTitle('');
      setIsAddingColumn(false);
      audioManager.play('success', theme);
    } catch (error) {
      console.error('Error creating column:', error);
      audioManager.play('error', theme);
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    try {
      // Supprimer toutes les tâches de cette colonne d'abord
      const tasksToRemove = tasks.filter(t => t.columnId === columnId);
      for (const task of tasksToRemove) {
        await deleteTaskAPI(task.id);
      }
      
      // Puis supprimer la colonne
      await deleteColumnAPI(columnId);
      audioManager.play('error', theme);
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isGalilee = theme === 'galilee';

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden relative`}>
      <Background3D />
      <FocusTimer />
      <CommandPalette 
          onNewTask={() => openNewTaskModal()} 
          onNewDeck={() => setView('flashcards')} 
          onToggleMute={toggleMute}
      />

      <header className={`${isGalilee ? 'bg-slate-900/60 border-b border-cyan-900/30' : 'bg-white/60 border-b border-slate-200/50'} backdrop-blur-md px-6 py-3 flex justify-between items-center z-20 shadow-sm transition-colors duration-500`}>
        <div className="flex items-center gap-6">
            <div className={`flex items-center justify-center`}>
                <Logo size="md" />
            </div>
            
            <div className={`flex items-center p-1 rounded-lg ${isGalilee ? 'bg-slate-900 border border-slate-700' : 'bg-slate-100'}`}>
                <button 
                    onClick={() => { setView('board'); audioManager.play('click', theme); }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all
                        ${view === 'board' 
                            ? (isGalilee ? 'bg-cyan-900 text-cyan-400' : 'bg-white text-indigo-600 shadow-sm') 
                            : (isGalilee ? 'text-slate-500 hover:text-cyan-400' : 'text-slate-500 hover:text-slate-800')}`}
                >
                    <Layout size={14} /> {t('view_projects')}
                </button>
                <button 
                    onClick={() => { setView('flashcards'); audioManager.play('click', theme); }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all
                        ${view === 'flashcards' 
                            ? (isGalilee ? 'bg-cyan-900 text-cyan-400' : 'bg-white text-indigo-600 shadow-sm') 
                            : (isGalilee ? 'text-slate-500 hover:text-cyan-400' : 'text-slate-500 hover:text-slate-800')}`}
                >
                    <Brain size={14} /> {t('view_revision')}
                </button>
            </div>
            
            <GamificationHUD />
        </div>

        <div className="flex items-center gap-4">
            {/* Mode Toggle PWA/DDAW */}
            <ModeToggle />
            
            <div className="h-6 w-px bg-slate-500/20 mx-1"></div>
            
            <div className={`status-indicator flex items-center gap-3 text-[10px] ${isGalilee ? 'text-cyan-600 font-mono' : 'text-slate-500'}`}>
                {isOnline ? <Wifi size={10} className={isGalilee ? "text-cyan-400" : "text-green-500"}/> : <WifiOff size={10} className="text-red-500"/>}
                <span className="hidden md:inline">{isOnline ? t('status_online') : t('status_offline')}</span>
                
                <div className="flex items-center gap-3 bg-white/5 p-1 pr-3 rounded-full border border-white/10">
                    {user?.avatarUrl && (
                        <img 
                            src={user.avatarUrl} 
                            alt="Avatar" 
                            className={`w-8 h-8 rounded-full border-2 ${isGalilee ? 'border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'border-indigo-200'}`} 
                        />
                    )}
                    <div className="flex flex-col items-start leading-none">
                        <span className={`uppercase font-bold ${isGalilee ? 'text-cyan-100' : 'text-slate-700'}`}>{user?.name}</span>
                        <span className="opacity-70 text-[8px] tracking-wider">{user?.speciality}</span>
                    </div>
                </div>
            </div>

            <div className="h-6 w-px bg-slate-500/20 mx-1"></div>
            
            <button onClick={toggleLanguage} className={`p-2 transition-all rounded-lg font-bold text-xs flex items-center gap-1 ${isGalilee ? 'text-cyan-600 hover:text-cyan-300' : 'text-slate-500 hover:text-indigo-600'}`}>
                <Languages size={18} /> {language.toUpperCase()}
            </button>

            <button onClick={toggleMute} className={`p-2 transition-all rounded-lg ${isGalilee ? 'text-cyan-600 hover:text-cyan-300' : 'text-slate-500 hover:text-indigo-600'}`}>
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <button onClick={toggleTheme} className={`p-2 transition-all rounded-lg ${isGalilee ? 'text-cyan-600 hover:text-cyan-300' : 'text-slate-500 hover:text-indigo-600'}`}>
                {isGalilee ? <Box size={18}/> : <Settings size={18}/> }
            </button>

             <button onClick={logout} className={`p-2 transition-all rounded-lg ${isGalilee ? 'text-red-900 hover:text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
                <LogOut size={18} />
            </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative z-10">
        {view === 'board' ? (
            <div className="h-full flex flex-col">
                <div className={`px-6 py-2 flex justify-end ${isGalilee ? 'bg-transparent' : ''}`}>
                    <div className={`relative ${isGalilee ? 'w-64 group' : 'w-64'}`}>
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isGalilee ? 'text-cyan-700' : 'text-slate-400'}`} size={14} />
                        <input 
                            type="text" 
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-9 pr-4 py-1.5 rounded-lg ${isGalilee ? 'bg-slate-900/50 text-cyan-100 border border-slate-700/50 focus:border-cyan-500 font-mono text-xs' : 'bg-white/50 text-sm border border-slate-200'}`}
                        />
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] opacity-50 ${isGalilee ? 'text-cyan-700' : 'text-slate-400'}`}>Ctrl+K</div>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
                    <div className="h-full flex p-6 min-w-max items-start">
                        {columns.map(col => (
                            <Column 
                                key={col.id} 
                                column={col} 
                                tasks={filteredTasks.filter(t => t.columnId === col.id)}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragStart={handleDragStart}
                                onEditTask={openEditTaskModal}
                                onDeleteTask={handleDeleteTask}
                                onAddTask={openNewTaskModal}
                                onDeleteColumn={handleDeleteColumn}
                            />
                        ))}
                        <div className="w-80 h-full flex-shrink-0 flex flex-col items-start justify-start pr-6 pt-0">
                             {isAddingColumn ? (
                                <div className={`w-full p-4 rounded-xl border ${isGalilee ? 'bg-slate-900 border-cyan-500' : 'bg-white border-indigo-200'} animate-scale-up shadow-xl`}>
                                    <h3 className={`text-xs font-bold uppercase mb-2 ${isGalilee ? 'text-cyan-400' : 'text-slate-500'}`}>{t('add_column')}</h3>
                                    <input 
                                        autoFocus
                                        value={newColumnTitle}
                                        onChange={(e) => setNewColumnTitle(e.target.value)}
                                        placeholder="Titre..."
                                        className={`w-full mb-3 p-2 rounded bg-transparent border-b outline-none ${isGalilee ? 'border-cyan-700 text-white placeholder-slate-600' : 'border-slate-300 text-slate-800'}`}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setIsAddingColumn(false)} className="p-2 text-slate-500 hover:bg-slate-800/50 rounded"><X size={16}/></button>
                                        <button onClick={handleAddColumn} className={`p-2 rounded ${isGalilee ? 'bg-cyan-600 text-white hover:bg-cyan-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}><Check size={16}/></button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsAddingColumn(true)}
                                    className={`w-full h-12 border-2 border-dashed flex items-center justify-center gap-2 transition-all rounded-lg group backdrop-blur-sm
                                    ${isGalilee ? 'border-cyan-900/30 bg-slate-900/20 text-cyan-800 hover:border-cyan-600 hover:text-cyan-400' : 'border-slate-300/50 bg-white/20 text-slate-500 hover:border-indigo-300 hover:text-indigo-500'}`}
                                >
                                    <PlusCircle size={18} /> {t('deploy_sector')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <FlashcardModule />
        )}
      </main>

      <EditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        columnId={targetColumnId}
      />
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [showLanding, setShowLanding] = useState(true);

  if (isAuthenticated) return <Dashboard />;
  if (showLanding) return <LandingPage onStart={() => setShowLanding(false)} />;
  return <Login onBack={() => setShowLanding(true)} />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
