import React from 'react';
import { LoadCapacity } from '../types';

interface SemaphoreProps {
  carga: LoadCapacity;
  solicitudesCount: number;
  solicitudesUrgentes: number;
  proximaEntrega: { nombre: string; deadline: string };
  tiempoPromedio: number;   // días
  retrabajoPercent: number; // porcentaje
  onCardClick?: (card: string) => void;
}

export function Semaphore({
  carga,
  solicitudesCount,
  solicitudesUrgentes,
  proximaEntrega,
  tiempoPromedio,
  retrabajoPercent,
  onCardClick
}: SemaphoreProps) {
  
  // Decide colors for each card
  // 1. Carga Color & Progress
  const pctCarga = Math.min((carga.currentPoints / carga.maxPoints) * 100, 100);
  let cargaColorClass = 'text-emerald-400';
  let cargaBarClass = 'bg-emerald-400';
  if (carga.currentPoints >= 6) {
    cargaColorClass = 'text-rose-500';
    cargaBarClass = 'bg-rose-500';
  } else if (carga.currentPoints >= 5) {
    cargaColorClass = 'text-amber-500';
    cargaBarClass = 'bg-amber-500';
  }

  // 2. Solicitudes Color & Progress
  const solicitudesColorClass = solicitudesCount > 0 ? 'text-rose-400' : 'text-text-dim';
  const solicitudesBarClass = solicitudesUrgentes > 0 ? 'bg-rose-500' : 'bg-blue-400';

  // 3. Próxima Entrega
  const esEntregaUrgente = proximaEntrega.deadline.toLowerCase().includes('hoy') || proximaEntrega.deadline.toLowerCase().includes('mañana');
  const entregaColorClass = esEntregaUrgente ? 'text-rose-400' : 'text-emerald-400';
  const entregaBarClass = esEntregaUrgente ? 'bg-rose-500' : 'bg-emerald-400';

  // 4. Tiempo Promedio
  const esTiempoExcedido = tiempoPromedio > 3;
  const tiempoColorClass = esTiempoExcedido ? 'text-amber-400' : 'text-emerald-400';
  const tiempoBarClass = esTiempoExcedido ? 'bg-amber-400' : 'bg-emerald-400';

  // 5. Retrabajo
  const esRetrabajoAlto = retrabajoPercent > 8;
  const retrabajoColorClass = esRetrabajoAlto ? 'text-rose-500' : 'text-emerald-400';
  const retrabajoBarClass = esRetrabajoAlto ? 'bg-rose-500' : 'bg-emerald-400';

  return (
    <div className="grid grid-cols-5 gap-4 px-8 py-4 border-b border-border shrink-0 bg-bg">
      {/* CARD 1: Carga actual */}
      <div 
        id="sem-card-carga"
        className="bg-bg2 border border-border rounded-sm p-4 flex flex-col justify-between cursor-pointer hover:border-text-dim transition-all duration-200"
        onClick={() => onCardClick?.('carga')}
      >
        <div className="font-mono text-[9px] uppercase tracking-widest text-text-dim mb-2">Carga Actual</div>
        <div className={`text-3xl font-serif ${cargaColorClass} mb-1`}>
          {carga.currentPoints} <span className="text-sm font-sans text-text-faint">/ {carga.maxPoints} pts</span>
        </div>
        <div className="text-[10px] text-text-muted">
          {carga.currentPoints >= 6 ? 'Capacidad Al Límite' : carga.currentPoints >= 5 ? 'Carga Alta' : 'Carga Óptima'}
        </div>
        <div className="h-[3px] rounded-full bg-bg4 mt-3 overflow-hidden">
          <div className={`h-full ${cargaBarClass} transition-all duration-300`} style={{ width: `${pctCarga}%` }}></div>
        </div>
      </div>

      {/* CARD 2: Solicitudes */}
      <div 
        id="sem-card-solicitudes"
        className="bg-bg2 border border-border rounded-sm p-4 flex flex-col justify-between cursor-pointer hover:border-text-dim transition-all duration-200"
        onClick={() => onCardClick?.('solicitudes')}
      >
        <div className="font-mono text-[9px] uppercase tracking-widest text-text-dim mb-2">Solicitudes</div>
        <div className={`text-3xl font-serif ${solicitudesColorClass} mb-1`}>
          {solicitudesCount}
        </div>
        <div className="text-[10px] text-text-muted truncate">
          {solicitudesUrgentes} urgente{solicitudesUrgentes !== 1 ? 's' : ''} · hoy
        </div>
        <div className="h-[3px] rounded-full bg-bg4 mt-3 overflow-hidden">
          <div className={`h-full ${solicitudesBarClass} transition-all duration-300`} style={{ width: solicitudesCount > 0 ? '100%' : '0%' }}></div>
        </div>
      </div>

      {/* CARD 3: Próxima Entrega */}
      <div 
        id="sem-card-entrega"
        className="bg-bg2 border border-border rounded-sm p-4 flex flex-col justify-between cursor-pointer hover:border-text-dim transition-all duration-200"
        onClick={() => onCardClick?.('entrega')}
      >
        <div className="font-mono text-[9px] uppercase tracking-widest text-text-dim mb-2">Próx. Entrega</div>
        <div className={`text-xl font-serif ${entregaColorClass} mb-1 truncate pt-1`}>
          {proximaEntrega.deadline}
        </div>
        <div className="text-[10px] text-text-muted truncate">
          {proximaEntrega.nombre || 'Sin asignaciones'}
        </div>
        <div className="h-[3px] rounded-full bg-bg4 mt-3 overflow-hidden">
          <div className={`h-full ${entregaBarClass} transition-all duration-300`} style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* CARD 4: Tiempo Promedio */}
      <div 
        id="sem-card-tiempo"
        className="bg-bg2 border border-border rounded-sm p-4 flex flex-col justify-between cursor-pointer hover:border-text-dim transition-all duration-200"
        onClick={() => onCardClick?.('tiempo')}
      >
        <div className="font-mono text-[9px] uppercase tracking-widest text-text-dim mb-2">Tiempo Promedio</div>
        <div className={`text-3xl font-serif ${tiempoColorClass} mb-1`}>
          {tiempoPromedio}d
        </div>
        <div className="text-[10px] text-text-muted">
          Meta: 3d {esTiempoExcedido ? `(+${(tiempoPromedio - 3).toFixed(1)}d)` : '✓'}
        </div>
        <div className="h-[3px] rounded-full bg-bg4 mt-3 overflow-hidden">
          <div className={`h-full ${tiempoBarClass} transition-all duration-300`} style={{ width: `${Math.min((3 / tiempoPromedio) * 100, 100)}%` }}></div>
        </div>
      </div>

      {/* CARD 5: Retrabajo */}
      <div 
        id="sem-card-retrabajo"
        className="bg-bg2 border border-border rounded-sm p-4 flex flex-col justify-between cursor-pointer hover:border-text-dim transition-all duration-200"
        onClick={() => onCardClick?.('retrabajo')}
      >
        <div className="font-mono text-[9px] uppercase tracking-widest text-text-dim mb-2">Retrabajo</div>
        <div className={`text-3xl font-serif ${retrabajoColorClass} mb-1`}>
          {retrabajoPercent}%
        </div>
        <div className="text-[10px] text-text-muted">
          Meta: &lt;8% {esRetrabajoAlto ? '⚠️ Excedida' : '✓ Óptimo'}
        </div>
        <div className="h-[3px] rounded-full bg-bg4 mt-3 overflow-hidden">
          <div className={`h-full ${retrabajoBarClass} transition-all duration-300`} style={{ width: `${Math.min((8 / retrabajoPercent) * 100, 100)}%` }}></div>
        </div>
      </div>
    </div>
  );
}
