import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function DireccionView() {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-bg p-8 gap-8 custom-scrollbar">
      <div className="flex flex-col gap-1 mb-2">
        <span className="text-[11px] text-teal-400 font-bold uppercase tracking-[0.2em] mb-2 block">Vista Global</span>
        <h1 className="text-4xl font-serif italic text-text-main leading-none uppercase tracking-tight">KPIs Dirección</h1>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-bg2 border border-border rounded-sm p-6 flex flex-col gap-2">
           <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-bold text-text-dim tracking-widest uppercase">Proyectos Activos</span>
             <BarChart3 className="text-teal-400 w-5 h-5" />
           </div>
           <span className="text-4xl font-serif text-teal-400">128</span>
           <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono">+12 esta semana</span>
        </div>
        <div className="bg-bg2 border border-border rounded-sm p-6 flex flex-col gap-2">
           <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-bold text-text-dim tracking-widest uppercase">Tasa de Cierre</span>
             <TrendingUp className="text-text-main w-5 h-5" />
           </div>
           <span className="text-4xl font-serif text-text-main">64%</span>
           <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono">Meta objetivo: 60%</span>
        </div>
        <div className="bg-bg2 border border-border rounded-sm p-6 flex flex-col gap-2">
           <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-bold text-text-dim tracking-widest uppercase">Cuello de Botella</span>
             <AlertTriangle className="text-red-400 w-5 h-5" />
           </div>
           <span className="text-4xl font-serif text-red-400">18</span>
           <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono">Estancados &gt;7 días</span>
        </div>
        <div className="bg-bg2 border border-border rounded-sm p-6 flex flex-col gap-2">
           <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-bold text-text-dim tracking-widest uppercase">Entrega Promedio</span>
             <CheckCircle2 className="text-amber-400 w-5 h-5" />
           </div>
           <span className="text-4xl font-serif text-amber-400">4.5d</span>
           <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono">Tiempo promedio vs 3d</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="bg-bg2 border border-border rounded-sm p-8 min-h-[300px]">
           <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted block mb-6">Adopción por Vendedor</span>
           <div className="text-text-dim text-xs flex items-center justify-center h-[200px] border border-dashed border-border2 rounded-sm font-mono uppercase tracking-wider">
             Gráfico no disponible
           </div>
         </div>
         <div className="bg-bg2 border border-border rounded-sm p-8 min-h-[300px]">
           <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted block mb-6">Eficiencia Proyectistas</span>
           <div className="text-text-dim text-xs flex items-center justify-center h-[200px] border border-dashed border-border2 rounded-sm font-mono uppercase tracking-wider">
             Gráfico no disponible
           </div>
         </div>
      </div>
    </div>
  );
}
