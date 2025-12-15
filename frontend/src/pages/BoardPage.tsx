import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MoreHorizontal, LogOut, User, Wifi, WifiOff, Trash2, Edit3,
  CheckCircle2, Clock, Circle, Sparkles, Search, LayoutGrid,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '../components/ui/Dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { cn } from '../lib/utils';
import api from '../services/api';
import type { Task } from '../types';

const columns = [
  { id: 'todo', title: 'To Do', icon: Circle, color: 'from-slate-500 to-slate-600' },
  { id: 'in-progress', title: 'In Progress', icon: Clock, color: 'from-amber-500 to-orange-600' },
  { id: 'done', title: 'Done', icon: CheckCircle2, color: 'from-emerald-500 to-green-600' },
] as const;

const priorityColors = {
  low: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function BoardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');

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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      const newTask = await api.createTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      });
      setTasks([...tasks, newTask]);
      resetForm();
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingTask || !title.trim()) return;
    try {
      const updated = await api.updateTask(editingTask._id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      });
      setTasks(tasks.map((t) => (t._id === editingTask._id ? updated : t)));
      resetForm();
      setIsEditOpen(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    try {
      const updated = await api.updateTask(task._id, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === task._id ? updated : t)));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
    setEditingTask(null);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setStatus(task.status);
    setIsEditOpen(true);
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getColumnTasks = (columnId: string) =>
    filteredTasks.filter((t) => t.status === columnId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-900">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] rounded-full bg-purple-600/10 blur-[150px] -top-[20%] -left-[10%]" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[120px] -bottom-[10%] -right-[5%]" />
      </div>
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Kanban Board</h1>
                <p className="text-xs text-white/40">Organize your work</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-10 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
              />
            </div>

            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
              isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            )}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {isOnline ? 'Online' : 'Offline'}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-white/80 hidden sm:inline">{user?.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-400 focus:text-red-400" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{tasks.length} tasks</Badge>
              {searchQuery && <Badge variant="outline">{filteredTasks.length} found</Badge>}
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-5 h-5" />
              Add Task
            </Button>
          </div>

          {/* Kanban columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => {
              const columnTasks = getColumnTasks(column.id);
              const Icon = column.icon;
              
              return (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center', column.color)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="font-semibold text-white">{column.title}</h2>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="flex-1 min-h-[400px] p-3 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm space-y-3">
                    <AnimatePresence mode="popLayout">
                      {columnTasks.map((task) => (
                        <motion.div
                          key={task._id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ scale: 1.02 }}
                          className="group p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.08] hover:border-purple-500/30 transition-all cursor-pointer shadow-lg shadow-black/10"
                          onClick={() => openEdit(task)}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-medium text-white text-sm leading-snug">{task.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 transition-all"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="w-4 h-4 text-white/60" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEdit(task)}>
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {columns.filter((c) => c.id !== task.status).map((c) => (
                                  <DropdownMenuItem key={c.id} onClick={() => handleStatusChange(task, c.id)}>
                                    <c.icon className="w-4 h-4 mr-2" />
                                    Move to {c.title}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-400 focus:text-red-400" onClick={() => handleDelete(task._id)}>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {task.description && (
                            <p className="text-xs text-white/50 mb-3 line-clamp-2">{task.description}</p>
                          )}

                          <div className="flex items-center gap-2">
                            {task.priority && (
                              <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', priorityColors[task.priority])}>
                                {task.priority}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {columnTasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 text-white/30">
                        <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">No tasks yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Create Task Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Title</label>
              <Input placeholder="Task title..." value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Description</label>
              <Textarea placeholder="Add a description..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task['status'])}
                  className="w-full h-12 px-4 rounded-2xl border-2 border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-purple-500/50"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full h-12 px-4 rounded-2xl border-2 border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-purple-500/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!title.trim()}>
              <Plus className="w-4 h-4" />
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Title</label>
              <Input placeholder="Task title..." value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Description</label>
              <Textarea placeholder="Add a description..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task['status'])}
                  className="w-full h-12 px-4 rounded-2xl border-2 border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-purple-500/50"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full h-12 px-4 rounded-2xl border-2 border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-purple-500/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                if (editingTask) handleDelete(editingTask._id);
                setIsEditOpen(false);
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
            <Button onClick={handleUpdate} disabled={!title.trim()}>
              <Edit3 className="w-4 h-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
