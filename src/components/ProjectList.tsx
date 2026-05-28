import React, { useState } from 'react';
import { Project, LoadCapacity } from '../types';
import { users, diasRestantes } from '../data';

interface ProjectListProps {
  projects: Project[];
  selectedId: string;
  onSelect: (id: string) => void;
  onShowInbox: () => void;
  carga: LoadCapacity;
  inboxCount: number;
  vacationMode?: boolean;
}

export function ProjectList({
  projects,
  selectedId,
  onSelect,
  onShowInbox,
  carga,
  inboxCount,
  vacationMode = false
}: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter projects based on search text (code, client, or name)
  const filteredProjects = projects.filter(p => !p.isInInbox && (
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const pctCargaTotal = Math.min((carga.currentPoints / carga.maxPoints) * 100, 100);
  const isCargaCompleta = carga.currentPoints >= carga.maxPoints;

  return (
    <div className="w-[340px] border-r border-border flex flex-col shrink-0 overflow-hidden bg-bg2">
      {/* Header section with Directory and Inbox Trigger */}
      <div className="p-6 border-b border-border flex justify-between items-center bg-bg">
        <div className="flex items-center gap-2">
          <h2 className="font-serif italic text-lg text-text-main">Directorio</h2>
          <span className="text-[10px] text-text-dim bg-bg4 px-2 py-0.5 rounded-full">
            {projects.filter(p => !p.isInInbox).length} Proyectos
          </span>
        </div>
        
        <button
          id="btn-list-show-inbox"
          onClick={onShowInbox}
          className="flex items-center gap-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-md py-1 px-2.5 transition-all"
          title="Ver bandeja de entrada de proyectos sin asignar"
        >
          <span>📥 Bandeja de proyectos nuevos</span>
          <span className="font-bold bg-amber-500 text-bg text-[10px] px-1 rounded-full">{inboxCount}</span>
        </button>
      </div>

      {/* Filter and Search Input */}
      <div className="px-6 py-4 border-b border-border bg-bg/50">
        <input
          type="text"
          placeholder="Buscar proyecto..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-bg4 border border-border2 rounded-md py-2 px-3 text-xs focus:outline-none focus:border-text-dim text-text-main placeholder-text-dim"
        />
      </div>

      {/* Main projects list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {filteredProjects.length === 0 ? (
          <div className="p-6 text-center text-text-dim text-xs">
            No se encontraron proyectos asignados
          </div>
        ) : (
          filteredProjects.map(p => {
            const isSelected = p.id === selectedId;
            const deadlineInfo = diasRestantes(p.deliveryDeadline);

            // Determine border and points tag colors
            let magnitudeBorder = 'border-l-transparent';
            let magnitudeColor = 'text-teal-400';
            if (p.magnitude === 'G') {
              magnitudeBorder = 'border-l-rose-500';
              magnitudeColor = 'text-rose-400';
            } else if (p.magnitude === 'M') {
              magnitudeBorder = 'border-l-amber-500';
              magnitudeColor = 'text-amber-400';
            } else {
              magnitudeBorder = 'border-l-emerald-500';
              magnitudeColor = 'text-emerald-400';
            }

            // Determine days left badge visual properties
            let daysBadgeColor = "bg-emerald-950/40 text-emerald-300 border border-emerald-500/20";
            if (deadlineInfo.dias === 0) {
              daysBadgeColor = "bg-rose-950/50 text-rose-300 border border-rose-500/30 animate-pulse";
            } else if (deadlineInfo.dias <= 2) {
              daysBadgeColor = "bg-amber-950/40 text-amber-300 border border-amber-500/20";
            }

            // Points indicator badge
            const pointsLabel = p.magnitude === 'G' ? '3pts' : p.magnitude === 'M' ? '2pts' : '1pt';
            const pointsBadgeColor = p.magnitude === 'G' ? 'bg-rose-500/10 text-rose-400' : p.magnitude === 'M' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400';

            // Completeness indicator color
            let completenessBarColorClass = "bg-emerald-400";
            if (p.completenessScore < 60) {
              completenessBarColorClass = "bg-rose-500";
            } else if (p.completenessScore < 100) {
              completenessBarColorClass = "bg-amber-400";
            }

            return (
              <div
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={`relative rounded-sm border mb-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-bg4 border-border' 
                    : 'bg-bg2 border-transparent hover:bg-bg4 hover:border-border'
                } border-l-[3px] ${magnitudeBorder}`}
                style={{ contentVisibility: 'auto' }}
              >
                <div className="p-4 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${magnitudeColor}`}>
                      {p.code}
                    </span>
                    <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-sm ${daysBadgeColor}`}>
                      {p.deliveryDeadline === "Hoy" ? "HOY" : `${p.deliveryDeadline}`}
                    </span>
                  </div>

                  <div className="text-sm font-medium leading-snug mb-1 text-text-main truncate text-ellipsis">{p.name}</div>
                  <div className="text-[11px] text-text-dim mb-3 truncate">{p.client}</div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded select-none ${pointsBadgeColor}`}>
                      {pointsLabel}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-bg3 text-text-muted select-none">
                      {p.status}
                    </span>
                    {vacationMode && (
                      <span className="bg-purple-500/15 text-purple-400 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border border-purple-500/20" title="Delegado por MWM — Modo Vacaciones Activo">
                        🌴 MWM
                      </span>
                    )}
                    {p.hasUrgentRequest && (
                      <span className="bg-rose-500/15 text-rose-400 text-[9px] font-mono px-1.5 py-0.5 rounded font-black tracking-wide border border-rose-500/10" title="Solicitud Urgente Pendiente">
                        ⚠️ URGENTE
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Completeness score bar (2px high) */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-bg3 overflow-hidden rounded-b-sm">
                  <div 
                    className={`h-full ${completenessBarColorClass} transition-all duration-300`} 
                    style={{ width: `${p.completenessScore}%` }}
                    title={`Completitud de Expediente: ${p.completenessScore}%`}
                  ></div>
                </div>
              </div>
            );
          })
        )}

        {/* Dynamic Capacity load capacity footer */}
        <div className="p-2 text-center mt-4">
          <div className="text-xs text-text-dim bg-bg border border-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2 font-mono text-[10px]">
              <span className={isCargaCompleta ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                Carga de Trabajo: {carga.currentPoints} / {carga.maxPoints} pts
              </span>
              <span>{Math.round(pctCargaTotal)}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-bg3 rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full transition-all duration-300 ${isCargaCompleta ? 'bg-rose-500' : carga.currentPoints >= 5 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                style={{ width: `${pctCargaTotal}%` }}
              ></div>
            </div>

            {isCargaCompleta ? (
              <div className="text-[10px] text-rose-400 leading-normal font-medium bg-rose-500/5 p-2 rounded border border-rose-500/10">
                🔒 Capacidad completa (6 pts).<br/>
                <span className="text-text-muted">Acepta proyectos desde la bandeja solo si entregas uno primero.</span>
              </div>
            ) : (
              <div className="text-[10px] text-emerald-400 leading-normal">
                ✓ Capacidad disponible ({carga.maxPoints - carga.currentPoints} pts).<br/>
                <span className="text-text-muted">Puedes aceptar nuevos proyectos desde tu bandeja.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
