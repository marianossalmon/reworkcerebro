import React from 'react';
import { FolderGit2, Mailbox, PauseCircle, FolderOpen, Image as ImageIcon, FileText, Activity, ClipboardList } from 'lucide-react';
import { mockProjects, allRequests } from '../data';

interface SidebarProps {
  currentView: string;
}

export function Sidebar({ currentView }: SidebarProps) {
  
  if (currentView !== 'Proyectos') {
     return null; 
  }

  const activeProjectsCount = mockProjects.length;
  const requestsCount = allRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="w-[240px] bg-bg2 border-r border-border p-4 flex flex-col gap-2 shrink-0 h-full overflow-y-auto">
      <div className="text-[10px] font-bold text-text-muted tracking-[0.12em] uppercase px-2 pt-2.5 pb-2"> Mi carga </div>
      
      <button className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-xs transition-all duration-150 bg-bg4 text-text-main font-medium border-l-[3px] border-l-teal-400 group">
        <FolderGit2 className="w-4 h-4 shrink-0 text-teal-400 group-hover:text-teal-400" />
        Mis proyectos
        <span className="ml-auto bg-white/5 text-text-main text-[9px] font-mono px-2 py-0.5 rounded">{activeProjectsCount}</span>
      </button>

      <button className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-text-muted text-xs transition-all duration-150 hover:bg-bg4 hover:text-text-main group border-l-[3px] border-transparent hover:border-text-dim">
        <Mailbox className="w-4 h-4 shrink-0" />
        Solicitudes
        <span className="ml-auto bg-amber-500/20 text-amber-500 text-[9px] font-mono px-2 py-0.5 rounded group-hover:bg-amber-500/30">{requestsCount}</span>
      </button>

      <button className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-text-muted text-xs transition-all duration-150 hover:bg-bg4 hover:text-text-main border-l-[3px] border-transparent hover:border-text-dim">
        <PauseCircle className="w-4 h-4 shrink-0" />
        Estancados
        <span className="ml-auto bg-white/5 text-text-main text-[9px] font-mono px-2 py-0.5 rounded">2</span>
      </button>

      <div className="h-[1px] bg-border my-4"></div>

      <div className="text-[10px] font-bold text-text-muted tracking-[0.12em] uppercase px-2 pt-2.5 pb-2"> Bóveda global </div>
      
      <button className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-text-muted text-xs transition-all duration-150 hover:bg-bg4 hover:text-text-main border-l-[3px] border-transparent hover:border-text-dim">
        <FolderOpen className="w-4 h-4 shrink-0" />
        Archivos
      </button>

      <button className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-text-muted text-xs transition-all duration-150 hover:bg-bg4 hover:text-text-main border-l-[3px] border-transparent hover:border-text-dim">
        <ImageIcon className="w-4 h-4 shrink-0" />
        Galería
      </button>

      <button className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-text-muted text-xs transition-all duration-150 hover:bg-bg4 hover:text-text-main border-l-[3px] border-transparent hover:border-text-dim">
        <FileText className="w-4 h-4 shrink-0" />
        Propuestas PDF
      </button>

      <div className="h-[1px] bg-border my-4"></div>

      <div className="text-[10px] font-bold text-text-muted tracking-[0.12em] uppercase px-2 pt-2.5 pb-2"> Equipo </div>

      <button className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-text-muted text-xs transition-all duration-150 hover:bg-bg4 hover:text-text-main border-l-[3px] border-transparent hover:border-text-dim">
        <Activity className="w-4 h-4 shrink-0" />
        Semáforo
      </button>

      <button className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-text-muted text-xs transition-all duration-150 hover:bg-bg4 hover:text-text-main border-l-[3px] border-transparent hover:border-text-dim">
        <ClipboardList className="w-4 h-4 shrink-0" />
        Sin asignar
      </button>
    </div>
  );
}
