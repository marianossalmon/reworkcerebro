import React, { useState } from 'react';
import { Project } from '../types';
import { ArrowLeft, Calendar, AlertTriangle, Info, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { diasRestantes, users } from '../data';

interface CalendarViewProps {
  projects: Project[];
  onBack: () => void;
  onDeliverClick?: (project: Project) => void;
}

export function CalendarView({ projects, onBack, onDeliverClick }: CalendarViewProps) {
  // Sort projects by deadline urgency for the bottom list
  const activeProjects = projects.filter(p => !p.isInInbox);
  const sortedDeliveries = [...activeProjects].sort((a, b) => {
    const rA = diasRestantes(a.deliveryDeadline).dias;
    const rB = diasRestantes(b.deliveryDeadline).dias;
    return rA - rB;
  });

  const urgentDeliveriesToday = activeProjects.filter(p => p.deliveryDeadline === 'Hoy' && p.status !== 'Visto Bueno' && p.status !== 'Ganado');
  const thisWeekDeliveries = activeProjects.filter(p => p.status !== 'Visto Bueno' && p.status !== 'Ganado');

  // Let's setup columns: Lun (25), Mar (26 - HOY), Mié (27), Jue (28), Vie (30/29)
  // We place events on these days dynamically from project states
  const weekDays = [
    { key: 'lun', label: 'Lunes 25', isToday: false },
    { key: 'mar', label: 'Martes 26 (Hoy)', isToday: true },
    { key: 'mie', label: 'Miércoles 27', isToday: false },
    { key: 'jue', label: 'Jueves 28', isToday: false },
    { key: 'vie', label: 'Viernes 29', isToday: false }
  ];

  // We map events to weekdays:
  const getEventsForDay = (dayKey: string) => {
    const events: { type: 'entrega-grande' | 'entrega-mediano' | 'entrega-chico' | 'inicio' | 'solicitud'; code: string; label: string }[] = [];

    if (dayKey === 'mar') {
      // CDMX-001 is due today!
      const p3 = activeProjects.find(p => p.code === 'CDMX-001');
      if (p3) {
        events.push({ type: 'entrega-chico', code: p3.code, label: '⏱ [CDMX-001] entrega' });
      }
      // Recent start event simulation
      events.push({ type: 'inicio', code: 'CDMX-001', label: '▶ [CDMX-001] inicio' });
    }

    if (dayKey === 'mie') {
      // QRO-022 is due Tuesday/Wednesday
      const p2 = activeProjects.find(p => p.code === 'QRO-022');
      if (p2) {
        events.push({ type: 'entrega-mediano', code: p2.code, label: '⏱ [QRO-022] entrega' });
      }
    }

    if (dayKey === 'vie') {
      // LAG-011 is due May 30
      const p1 = activeProjects.find(p => p.code === 'LAG-011');
      if (p1) {
        events.push({ type: 'entrega-grande', code: p1.code, label: '⏱ [LAG-011] entrega' });
      }
    }

    // Add solicitude alerts
    activeProjects.forEach(p => {
      p.requests.forEach(r => {
        if (r.status === 'pending') {
          if (dayKey === 'mar' && r.type === 'URGENTE') {
            events.push({ type: 'solicitud', code: p.code, label: `📨 [URGENTE] cambio` });
          } else if (dayKey === 'mie' && r.type !== 'URGENTE') {
            events.push({ type: 'solicitud', code: p.code, label: `📨 [DISEÑO] ajuste` });
          }
        }
      });
    });

    return events;
  };

  return (
    <div className="flex-1 flex flex-col bg-bg p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-border/60">
        <div>
          <button 
            id="calendar-back-btn"
            onClick={onBack} 
            className="flex items-center gap-1 text-text-dim hover:text-text-main text-xs uppercase font-extrabold tracking-wider mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Mis Proyectos</span>
          </button>
          <h2 className="text-3xl font-serif text-text-main tracking-tight leading-tight">Mi Calendario de Carga (SLA)</h2>
          <p className="text-xs text-text-muted mt-1 font-sans">Semana laboral actual · Planificación de entregas técnicas computadas por CEREBRO.</p>
        </div>
        
        <span className="bg-[#121c17] text-teal-400 border border-teal-500/20 text-xs px-3 py-1.5 rounded font-mono font-bold">
          SLA Score: 98.4% Excelente
        </span>
      </div>

      {/* Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#241717] border border-rose-500/15 p-4 rounded-xl flex gap-3 text-rose-400 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold uppercase tracking-wider mb-1">Entregas urgentes hoy</div>
            <p className="text-rose-300 font-sans font-normal">
              {urgentDeliveriesToday.length > 0 
                ? `Tienes ${urgentDeliveriesToday.length} entregas críticas por completar hoy: ${urgentDeliveriesToday.map(u => u.code).join(', ')}.` 
                : 'Grandioso: No tienes entregas retrasadas o urgentes señaladas para el día de hoy.'
              }
            </p>
          </div>
        </div>

        <div className="bg-[#181a24] border border-blue-500/15 p-4 rounded-xl flex gap-3 text-sky-400 text-xs">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold uppercase tracking-wider mb-1">Hitos semana actual</div>
            <p className="text-sky-300 font-sans font-normal">
              SLA activo con {thisWeekDeliveries.length} entregas agendadas antes del viernes. Sube los planos DWG y Renders a tiempo.
            </p>
          </div>
        </div>
      </div>

      {/* Week View Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
        {weekDays.map(day => {
          const dayEvents = getEventsForDay(day.key);
          const isTodayAccent = day.isToday;

          return (
            <div 
              key={day.key} 
              className={`p-4 bg-bg2/40 border rounded-xl flex flex-col gap-3 min-h-[160px] relative ${
                isTodayAccent ? 'border-amber-400/80 bg-amber-500/[0.015] shadow-lg shadow-amber-400/5' : 'border-border'
              }`}
            >
              <div className="flex justify-between items-center pb-2 border-b border-border/40 select-none">
                <span className={`text-xs uppercase font-extrabold tracking-wide ${isTodayAccent ? 'text-amber-400' : 'text-text-main'}`}>
                  {day.label}
                </span>
                {isTodayAccent && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </div>

              {/* Event Stack */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-start">
                {dayEvents.length === 0 ? (
                  <span className="text-[10px] text-text-faint italic mt-2">Sin eventos agendados</span>
                ) : (
                  dayEvents.map((evt, idx) => {
                    let badgeClass = 'bg-[#151c2a] text-blue-300 border-blue-500/20';

                    if (evt.type === 'entrega-grande') {
                      badgeClass = 'bg-[#241515] text-[#ff8080] border-rose-500/30 font-semibold';
                    } else if (evt.type === 'entrega-mediano') {
                      badgeClass = 'bg-[#221a11] text-[#ffd380] border-amber-500/30';
                    } else if (evt.type === 'entrega-chico') {
                      badgeClass = 'bg-[#112019] text-[#abffd0] border-emerald-500/30';
                    } else if (evt.type === 'solicitud') {
                      badgeClass = 'bg-[#20152a] text-[#da82ff] border-purple-500/30';
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`px-2.5 py-1.5 rounded-md border text-[10.5px] font-mono leading-relaxed truncate ${badgeClass}`}
                        title={evt.label}
                      >
                        {evt.label}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Próximas Entregas List */}
      <div className="bg-bg2/30 border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-main mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-400" /> Listado Detallado de Próximas Entregas de Contratos
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-main font-normal border-collapse">
            <thead>
              <tr className="border-b border-border/80 text-text-dim text-[10px] uppercase tracking-wider font-extrabold pb-3">
                <th className="py-3 px-4 font-bold">Magnitud</th>
                <th className="py-3 px-4 font-bold">Código / Proyecto</th>
                <th className="py-3 px-4 font-bold">Asesor Comercial</th>
                <th className="py-3 px-4 font-bold">Presupuesto</th>
                <th className="py-3 px-4 font-bold">Fecha Límite</th>
                <th className="py-3 px-4 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/45 leading-none">
              {sortedDeliveries.map(p => {
                const remaining = diasRestantes(p.deliveryDeadline);
                const magColor = p.magnitude === 'G' ? '🔴' : p.magnitude === 'M' ? '🟡' : '🟢';
                
                return (
                  <tr key={p.id} className="hover:bg-bg3/20 transition-colors">
                    <td className="py-4 px-4 font-mono font-semibold">
                      <span className="mr-1">{magColor}</span>
                      {p.magnitude === 'G' ? 'GRANDE' : p.magnitude === 'M' ? 'MEDIANO' : 'CHICO'}
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      <div className="font-bold text-text-main">{p.code}</div>
                      <div className="text-[10px] text-text-muted mt-0.5">{p.name}</div>
                    </td>
                    <td className="py-4 px-4 text-text-dim leading-normal">{users[p.advisorId]?.name || p.advisorId}</td>
                    <td className="py-4 px-4 font-mono text-amber-400 font-semibold">{p.budget}</td>
                    <td className="py-4 px-4 font-semibold">
                      <span className={remaining.esUrgente ? 'text-rose-400 font-bold' : 'text-text-main'}>
                        {p.deliveryDeadline} {remaining.esUrgente && '⚠️'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        id={`cal-deliver-btn-${p.id}`}
                        onClick={() => onDeliverClick?.(p)}
                        className="bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/25 text-teal-400 text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-md transition-all inline-flex items-center gap-1.5"
                      >
                        📦 Entregar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
