import React, { useState } from 'react';
import { InboxProject, LoadCapacity } from '../types';
import { ArrowLeft, Inbox, Circle, AlertTriangle, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { users } from '../data';

interface InboxViewProps {
  carga: LoadCapacity;
  inboxList: InboxProject[];
  onBack: () => void;
  onAccept: (project: InboxProject) => void;
  onSolicitarInfo: (project: InboxProject) => void;
}

export function InboxView({ carga, inboxList, onBack, onAccept, onSolicitarInfo }: InboxViewProps) {
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  // Calculate local points of the projects currently displayed (excluding the ones being accepted in this transition)
  const isCapFull = carga.currentPoints >= 6;

  const handleAcceptClick = (item: InboxProject) => {
    setRemovedIds(prev => [...prev, item.id]);
    // Allow a small delay for opacity exit animation
    setTimeout(() => {
      onAccept(item);
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-border/60">
        <div>
          <button 
            id="inbox-back-btn"
            onClick={onBack} 
            className="flex items-center gap-1 text-text-dim hover:text-text-main text-xs uppercase font-extrabold tracking-wider mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Mis Proyectos</span>
          </button>
          <h2 className="text-3xl font-serif tracking-tight text-text-main">Bandeja de proyectos nuevos</h2>
          <p className="text-xs text-text-muted mt-1">Control de admisión técnica, validación de completitud y pre-asignaciones de volumen.</p>
        </div>
        
        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/15 text-xs px-3 py-1.5 rounded font-mono font-bold">
          {inboxList.length} Proyectos en Espera
        </span>
      </div>

      {/* Carga strip */}
      <div className="bg-[#0f111a] border border-border/80 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Tu carga actual de trabajo</span>
          <div className="flex items-center gap-2">
            <strong className="text-base text-text-main font-mono">{carga.currentPoints} pts / {carga.maxPoints} pts</strong>
            <span className="text-text-muted">({carga.breakdown.length} proyectos activos)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md w-full">
          <div className="h-2.5 bg-bg3 rounded overflow-hidden relative">
            <div 
              className={`h-full ${carga.currentPoints >= 6 ? 'bg-rose-500 animate-pulse' : carga.currentPoints >= 5 ? 'bg-amber-500' : 'bg-teal-400'}`}
              style={{ width: `${(carga.currentPoints / carga.maxPoints) * 100}%` }}
            ></div>
          </div>
          {carga.currentPoints >= 6 && (
            <span className="text-[10px] text-rose-400 font-bold block mt-1">
              ⚠️ CAPACIDAD SATURADA (6/6 pts). Debes entregar o liberar proyectos antes de aceptar nuevos.
            </span>
          )}
        </div>
      </div>

      {/* Inbox List */}
      <div className="space-y-6">
        {inboxList.length === 0 ? (
          <div className="p-12 text-center text-xs text-text-muted border border-border rounded-xl bg-bg2/40 flex flex-col gap-2 items-center justify-center">
            <Inbox className="w-8 h-8 text-text-dim mb-1" />
            <span className="font-bold text-[#beebcd]">Bandeja libre de proyectos</span>
            <span>Todos los expedientes de ventas han sido auditados y están en proceso técnico.</span>
          </div>
        ) : (
          inboxList.map(item => {
            const isRemoved = removedIds.includes(item.id);
            const isPassedGate = item.completenessScore >= 70;
            const pointsValue = item.pointsValue;
            const sizeColor = item.magnitude === 'G' ? 'text-rose-400' : item.magnitude === 'M' ? 'text-amber-400' : 'text-teal-400';
            const sizeDot = item.magnitude === 'G' ? '🔴' : item.magnitude === 'M' ? '🟡' : '🟢';

            return (
              <div 
                key={item.id}
                className={`bg-bg2/60 border border-border rounded-xl overflow-hidden transition-all duration-300 transform ${
                  isRemoved ? 'opacity-0 translate-x-12 scale-95 pointer-events-none' : 'opacity-100'
                }`}
              >
                {/* Upper bar */}
                <div className="bg-[#12141c] border-b border-border/40 px-5 py-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono bg-bg4 text-text-main font-bold px-2 py-0.5 rounded text-[10.5px]">
                      {item.code}
                    </span>
                    <span className="text-text-muted">
                      Asignado por: <strong className="text-text-main">{item.inboxAssignedBy}</strong> · {item.inboxAssignedAt}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-bg4 px-2 py-0.5 rounded text-[10px] text-text-dim text-[10px]">
                      Presupuesto: <strong className="text-amber-400">{item.budget}</strong>
                    </span>
                    <span className="bg-bg4 px-2 py-0.5 rounded text-[10px] text-text-dim text-[10px]">
                      Deadline: <strong className="text-text-main">{item.deliveryDeadline}</strong>
                    </span>
                  </div>
                </div>

                {/* Main Body */}
                <div className="p-5">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-serif text-text-main flex items-center gap-2 leading-snug">
                        <span>{sizeDot}</span>
                        <span>{item.name}</span>
                      </h4>
                      <p className="text-xs text-text-muted mt-0.5">Cliente: <strong className="text-text-main">{item.client}</strong></p>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded uppercase border ${
                        item.magnitude === 'G' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : item.magnitude === 'M' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-teal-500/10 text-[#3ee099] border-teal-500/20'
                      }`}>
                        {item.magnitude === 'G' ? 'Grande (3pts)' : item.magnitude === 'M' ? 'Mediano (2pts)' : 'Chico (1pt)'}
                      </span>
                      <span className="bg-bg4 text-text-dim px-2 py-1.5 text-[9.5px] rounded border border-border font-medium">
                        📐 {item.sqm}
                      </span>
                    </div>
                  </div>

                  {/* 4 Column Brief Space Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#0f1118]/80 border border-border/40 rounded-lg text-xs font-normal mb-5">
                    <div>
                      <span className="text-text-dim text-[10px] block uppercase tracking-wide">Espacio y obra</span>
                      <strong className="text-[#eee]">{item.style || "Corporativo"}</strong>
                    </div>
                    <div>
                      <span className="text-text-dim text-[10px] block uppercase tracking-wide">Condición</span>
                      <strong className="text-[#eee]">Acondicionado / Obra Gris</strong>
                    </div>
                    <div>
                      <span className="text-text-dim text-[10px] block uppercase tracking-wide">Líneas preferidas</span>
                      <strong className="text-[#eee] truncate block" title={item.lines}>{item.lines || 'Todas'}</strong>
                    </div>
                    <div>
                      <span className="text-text-dim text-[10px] block uppercase tracking-wide">Requerido</span>
                      <strong className="text-teal-400 font-semibold">
                        {item.requiresRenders ? `🖼 Renders (${item.renderCount || 3} v)` : '📐 Planos'}
                        {item.requiresVirtualTour ? ' + 🥽 360°' : ''}
                      </strong>
                    </div>
                  </div>

                  {/* Completeness bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-text-dim mb-1 font-mono">
                      <span>Completitud técnica del expediente comercial</span>
                      <span className={isPassedGate ? 'text-emerald-400' : 'text-rose-400'}>
                        {item.completenessScore}% {isPassedGate ? '— Aprobado' : '— Incompleto'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-bg3 rounded overflow-hidden">
                      <div 
                        className={`h-full ${isPassedGate ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`}
                        style={{ width: `${item.completenessScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="border-t border-border/40 pt-4 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    {/* Left status / alerts */}
                    {!isPassedGate ? (
                      <div className="flex gap-2 text-rose-400 text-xs italic font-serif">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>Falta adjuntar: <strong className="text-text-main not-italic font-sans text-[11px] bg-rose-500/10 px-1.5 py-0.5 rounded">{item.pendingInfoItems.join(', ')}</strong></span>
                      </div>
                    ) : (
                      <div className="flex gap-2 text-emerald-400 text-xs font-semibold items-center">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>Listo para iniciar amueblado de áreas Técnicas</span>
                      </div>
                    )}

                    {/* Right action buttons */}
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      {!isPassedGate ? (
                        <>
                          <button 
                            id={`inbox-req-info-${item.id}`}
                            onClick={() => onSolicitarInfo(item)}
                            className="bg-transparent hover:bg-white/5 border border-border2 text-[#99b5ff] hover:text-white font-extrabold uppercase tracking-widest text-[10px] px-4 py-2.5 rounded transition-colors"
                          >
                            📩 Solicitar info faltante
                          </button>
                          <button 
                            disabled 
                            className="bg-bg3 text-text-dim border border-border px-5 py-2.5 rounded font-extrabold uppercase tracking-widest text-[10px] cursor-not-allowed opacity-50"
                          >
                            Aceptar proyecto
                          </button>
                        </>
                      ) : (
                        <button 
                          id={`inbox-accept-${item.id}`}
                          disabled={isCapFull}
                          onClick={() => handleAcceptClick(item)}
                          className={`font-extrabold uppercase tracking-widest text-[10px] px-6 py-2.5 rounded transition-all ${
                            isCapFull 
                              ? 'bg-bg3 text-text-dim border border-border cursor-not-allowed opacity-50' 
                              : 'bg-emerald-500 hover:bg-emerald-400 text-bg text-black hover:scale-105 shadow-md shadow-emerald-500/10'
                          }`}
                        >
                          Aceptar proyecto {isCapFull && ' (Capacidad Llena)'}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
