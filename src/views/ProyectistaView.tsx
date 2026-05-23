import React, { useState } from 'react';
import { mockProjects } from '../data';
import { ProjectList } from '../components/ProjectList';
import { ProjectDetail } from '../components/ProjectDetail';
import { Semaphore } from '../components/Semaphore';

export function ProyectistaView() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(mockProjects[0].id);

  const selectedProject = mockProjects.find(p => p.id === selectedProjectId);

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg">
      {/* View Switcher Header */}
      <div className="px-8 py-6 border-b border-border flex items-center justify-between">
        <div className="max-w-md">
          <span className="text-[11px] text-teal-400 font-bold uppercase tracking-[0.2em] mb-2 block">Vista Activa</span>
          <h1 className="text-4xl font-serif italic text-text-main leading-none">Mis Proyectos</h1>
        </div>
        <div className="flex gap-2 ml-auto">
          <button className="bg-text-main text-black font-bold uppercase text-[11px] tracking-widest px-4 py-2 rounded-sm hover:bg-teal-400 transition-colors">Lista</button>
          <button className="bg-bg4 border border-border text-text-main font-bold uppercase text-[11px] tracking-widest px-4 py-2 rounded-sm hover:bg-bg5 transition-colors">Kanban</button>
          <button className="bg-bg4 border border-border text-text-main font-bold uppercase text-[11px] tracking-widest px-4 py-2 rounded-sm hover:bg-bg5 transition-colors">Timeline</button>
        </div>
      </div>

      <Semaphore />

      <div className="flex flex-1 overflow-hidden">
         <ProjectList 
           projects={mockProjects} 
           selectedId={selectedProjectId} 
           onSelect={setSelectedProjectId} 
         />
         {selectedProject ? (
           <ProjectDetail project={selectedProject} />
         ) : (
           <div className="flex-1 flex items-center justify-center text-text-dim text-xs flex-col gap-2 bg-bg">
             Selecciona un proyecto para ver sus detalles
           </div>
         )}
      </div>
    </div>
  );
}
