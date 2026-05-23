import React from 'react';

export function Semaphore() {
  return (
    <div className="grid grid-cols-4 gap-6 px-8 py-6 border-b border-border shrink-0 bg-bg">
      
      <div className="bg-bg2 border border-border rounded-sm p-4 flex flex-col justify-between">
        <div className="text-[10px] font-bold text-text-dim tracking-widest uppercase mb-3">Carga real</div>
        <div className="text-4xl font-serif text-teal-400 mb-2">3 <span className="text-xl text-text-faint font-sans">/ 5</span></div>
        <div className="text-[9px] text-text-muted mt-1 uppercase tracking-wider">máx recomendado: 5</div>
        <div className="h-1 rounded-full bg-bg4 mt-3 overflow-hidden">
          <div className="h-full bg-teal-400 w-[60%]"></div>
        </div>
      </div>

      <div className="bg-bg2 border border-border rounded-sm p-4 flex flex-col justify-between">
        <div className="text-[10px] font-bold text-text-dim tracking-widest uppercase mb-3">Solicitudes abiertas</div>
        <div className="text-4xl font-serif text-red-400 mb-2">3</div>
        <div className="text-[9px] text-text-muted mt-1 uppercase tracking-wider">1 urgente · responder hoy</div>
        <div className="h-1 rounded-full bg-bg4 mt-3 overflow-hidden">
           <div className="h-full bg-red-400 w-full"></div>
        </div>
      </div>

      <div className="bg-bg2 border border-border rounded-sm p-4 flex flex-col justify-between">
        <div className="text-[10px] font-bold text-text-dim tracking-widest uppercase mb-3">Por magnitud</div>
        <div className="text-4xl font-serif text-text-main mb-2 tracking-tight">G<span className="text-xl text-text-faint font-sans mx-1">·</span>M<span className="text-xl text-text-faint font-sans mx-1">·</span>Ch</div>
        <div className="text-[9px] text-text-muted mt-1 uppercase tracking-wider">1 grande · 1 mediano · 1 chico</div>
        <div className="h-1 rounded-full mt-3 flex gap-[2px] overflow-hidden">
          <div className="h-full bg-red-400 w-[45%]"></div>
          <div className="h-full bg-amber-400 w-[35%]"></div>
          <div className="h-full bg-teal-400 w-[20%]"></div>
        </div>
      </div>

      <div className="bg-bg2 border border-border rounded-sm p-4 flex flex-col justify-between">
        <div className="text-[10px] font-bold text-text-dim tracking-widest uppercase mb-3">Entrega promedio</div>
        <div className="text-4xl font-serif text-amber-400 mb-2">4.2d</div>
        <div className="text-[9px] text-text-muted mt-1 uppercase tracking-wider">meta: 3d · +1.2d vs meta</div>
        <div className="h-1 rounded-full bg-bg4 mt-3 overflow-hidden">
          <div className="h-full bg-amber-400 w-[75%]"></div>
        </div>
      </div>

    </div>
  );
}
