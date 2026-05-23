import React from 'react';
import { Bell } from 'lucide-react';
import { currentUser } from '../data';

interface TopbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Topbar({ currentView, onViewChange }: TopbarProps) {
  return (
    <header className="h-16 bg-bg3 border-b border-border py-4 px-8 flex items-center justify-between shrink-0 z-10 w-full">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-serif italic tracking-tight text-text-main">
          Cerebro <span className="text-xs font-sans not-italic text-text-dim uppercase tracking-[0.2em] ml-2">v2.0 / {currentView}</span>
        </h1>
        <nav className="hidden md:flex space-x-8 text-[11px] uppercase tracking-widest font-semibold text-text-muted ml-8">
           <button 
            onClick={() => onViewChange('Proyectos')}
            className={`border-b pb-1 transition-colors ${currentView === 'Proyectos' ? 'text-text-main border-text-dim' : 'text-text-muted border-transparent hover:text-text-main'}`}>
            Dashboard
          </button>
          <button 
             onClick={() => onViewChange('Ventas')}
            className={`border-b pb-1 transition-colors ${currentView === 'Ventas' ? 'text-text-main border-text-dim' : 'text-text-muted border-transparent hover:text-text-main'}`}>
            Flujo Ventas
          </button>
          <button 
             onClick={() => onViewChange('Direccion')}
            className={`border-b pb-1 transition-colors ${currentView === 'Direccion' ? 'text-text-main border-text-dim' : 'text-text-muted border-transparent hover:text-text-main'}`}>
            KPIs Dirección
          </button>
        </nav>
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-text-dim uppercase">Usuario: {currentUser.name}</span>
          <span className="text-[10px] text-teal-400 font-mono tracking-tighter uppercase">{currentUser.role}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1a1a1a] to-[#333] border border-border2 flex items-center justify-center font-serif italic text-text-main">
          {currentUser.initials.charAt(0)}
        </div>
      </div>
    </header>
  );
}
