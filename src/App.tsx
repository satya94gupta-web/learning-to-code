/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, CheckCircle2, Circle, ListTodo, 
  Inbox, Sun, Calendar, Star, Search, Bell,
  User, Check, Clock, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('minimalist-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved tasks', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('minimalist-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden" id="app-root">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0" id="left-sidebar">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10 overflow-hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap">FocusTask</span>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-lg bg-blue-50 text-blue-700 transition-all">
              <span className="flex items-center gap-3"><Inbox className="w-4 h-4" /> Inbox</span>
              <span className="text-[10px] bg-blue-200/50 px-2 py-0.5 rounded-full">{tasks.length}</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
              <Sun className="w-4 h-4" /> Today
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
              <Calendar className="w-4 h-4" /> Upcoming
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
              <Star className="w-4 h-4" /> Important
            </button>
          </nav>

          <div className="mt-12">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Lists</h3>
            <div className="space-y-1">
              {['Personal', 'Work', 'Groceries'].map((list, idx) => (
                <button key={list} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-all capitalize">
                  <div className={`w-2 h-2 rounded-full ${['bg-emerald-500', 'bg-blue-500', 'bg-amber-500'][idx]}`}></div>
                  {list}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-auto p-6 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
          v2.4.0 • Updated Just Now
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0" id="main-content">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-10 shrink-0">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Inbox</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-xs w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
              <User className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8" id="scroll-area">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* New Task Bar */}
            <form 
              onSubmit={addTask}
              className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50/50 transition-all group"
            >
              <div className="flex items-center justify-center w-6 h-6 text-blue-600">
                <Plus className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Press 'Enter' to add a task quickly..."
                className="flex-1 border-none focus:ring-0 outline-none text-sm text-slate-700 bg-transparent placeholder:text-slate-400"
                id="task-input"
              />
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded font-bold">
                <span>⌘</span><span>N</span>
              </div>
            </form>

            {/* List Header Stats */}
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Tasks</h3>
              <span className="text-[10px] text-slate-400 font-bold">{tasks.length} Total</span>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                    className={`group flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all duration-200 ${
                      task.completed ? 'opacity-60 bg-slate-50/50' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'border-slate-300 hover:border-blue-400 bg-white'
                      }`}
                      id={`toggle-${task.id}`}
                    >
                      {task.completed && <Check className="w-3 h-3 stroke-[4px]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium transition-all duration-300 truncate ${
                        task.completed ? 'text-slate-500 line-through' : 'text-slate-800'
                      }`}>
                        {task.text}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>General</span>
                        <span>•</span>
                        <span>{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" aria-label="Edit">
                        <Clock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        id={`delete-${task.id}`}
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {tasks.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4">
                    <ListTodo className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 tracking-tight">Nothing on your plate</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest px-8">Enjoy your free time or start planning your day</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Right Stats Sidebar */}
      <aside className="w-72 bg-white border-l border-slate-200 p-8 flex flex-col gap-8 shrink-0 hidden lg:flex" id="right-sidebar">
        <section>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Today's Progress</h3>
          <div className="relative w-36 h-36 mx-auto mb-6">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              <motion.circle 
                cx="18" cy="18" r="16" fill="none" stroke="#2563eb" strokeWidth="3" 
                strokeDasharray="100, 100"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 100 - progressPercent }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800 tracking-tighter">{progressPercent}%</span>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest">DONE</span>
            </div>
          </div>
          <div className="text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-700 font-bold tracking-tight">{completedCount} of {tasks.length} completed</p>
            <p className="text-[10px] text-slate-400 mt-1">Keep going! You're almost there.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1 bg-blue-500 rounded-full shrink-0"></div>
              <div>
                <p className="text-[11px] font-bold text-slate-800">System Ready</p>
                <p className="text-[9px] text-slate-400 uppercase font-medium">Session started • Just Now</p>
              </div>
            </div>
            {tasks.slice(0, 2).map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-1 rounded-full shrink-0 ${t.completed ? 'bg-emerald-500' : 'bg-blue-400 opacity-50'}`}></div>
                <div className="truncate">
                  <p className="text-[11px] font-bold text-slate-800 truncate">{t.completed ? 'Task Completed' : 'Task Added'}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-medium truncate">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-auto">
          <div className="bg-blue-600 p-5 rounded-2xl text-white text-center shadow-xl shadow-blue-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:scale-150"></div>
            <TrendingUp className="w-8 h-8 opacity-20 absolute -left-2 -bottom-2 rotate-12" />
            <p className="text-[10px] opacity-80 mb-1 font-bold tracking-widest uppercase">Pro Member Focus</p>
            <p className="text-lg font-bold tracking-tight mb-4">Unlock Insights</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-xl text-[10px] font-bold w-full transition-all hover:bg-slate-50 active:scale-95 shadow-sm">
              UPGRADE NOW
            </button>
          </div>
        </section>
      </aside>
    </div>
  );
}
