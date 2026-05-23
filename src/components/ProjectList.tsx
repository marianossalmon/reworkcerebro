import React from 'react';
import { Project } from '../types';
import { users } from '../data';

interface ProjectListProps {
  projects: Project[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ProjectList({ projects, selectedId, onSelect }: ProjectListProps) {
  return (
    <div className="w-[340px] border-r border-border flex flex-col shrink-0 overflow-hidden bg-bg2">
      <div className="p-6 border-b border-border flex justify-between items-end">
        <h2 className="font-serif italic text-lg text-text-main">Directorio</h2>
        <span className="text-[10px] text-text-dim bg-bg4 px-2 py-0.5 rounded-full">{projects.length} Asignados</span>
      </div>
      <div className="px-6 py-4 border-b border-border">
        <input type="text" placeholder="Filtrar proyectos..." className="w-full bg-bg4 border border-border2 rounded-md py-2 px-3 text-xs focus:outline-none focus:border-text-dim text-text-main" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {projects.map(p => {
          const isSelected = p.id === selectedId;
          const user = users[p.assignedTo];
          
          let borderColor = 'border-transparent';
          if (p.magnitude === 'G') { borderColor = 'border-red-400'; }
          else if (p.magnitude === 'M') { borderColor = 'border-amber-400'; }
          else { borderColor = 'border-teal-400'; }

          return (
            <div 
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`p-4 rounded-sm border-l-2 cursor-pointer transition-all ${isSelected ? `border-l-[${borderColor.split('-')[1]}-400] bg-bg4` : `border-l-transparent hover:bg-bg4`} ${isSelected ? borderColor : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] uppercase tracking-wider font-bold ${p.magnitude === 'G' ? 'text-red-400' : p.magnitude === 'M' ? 'text-amber-400' : 'text-teal-400'}`}>
                  {p.code}
                </span>
                <span className="text-[10px] text-text-faint font-mono">14:20</span>
              </div>
              <div className="text-sm font-medium leading-snug mb-1 text-text-main">{p.name}</div>
              <div className="text-[11px] text-text-dim mb-3 truncate">{p.client}</div>
              
              <div className="flex items-center gap-2">
                 <span className={`text-[9px] font-mono px-2 py-0.5 rounded bg-bg4 text-text-muted`}>
                   Mag: {p.magnitude === 'G' ? 'Grande' : p.magnitude === 'M' ? 'Mediana' : 'Chica'}
                 </span>
                 <span className="text-[9px] px-2 py-0.5 rounded bg-bg4 text-text-muted">
                    {p.status}
                 </span>
                 {p.hasUrgentRequest && (
                    <span className="bg-red-500/10 text-red-400 text-[9px] font-mono px-2 py-0.5 rounded">
                      REQ URGENTE
                    </span>
                 )}
              </div>
            </div>
          )
        })}

        <div className="p-4 text-center mt-2">
          <div className="text-[10px] text-text-dim bg-bg2 border border-border rounded-xl p-3">
             <div className="text-sm border border-border w-6 h-6 flex items-center justify-center rounded-full mx-auto mb-1">✓</div>
             Carga óptima — 3 proyectos activos<br/>
             <span className="text-teal-400">Puedes recibir hasta 2 más</span>
          </div>
        </div>
      </div>
    </div>
  );
}
