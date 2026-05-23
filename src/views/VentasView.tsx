import React, { useState, useRef } from 'react';
import { 
  Building2, Monitor, Box, FolderPlus, Download,
  CheckCircle2, Circle, Link, Check, FileImage, 
  FileCode2, FileBox
} from 'lucide-react';

type Tool = 'privado' | 'operativa' | 'juntas' | 'cafeteria';
const TOOL_EMOJIS: Record<Tool, string> = {
  privado: '🛋️',
  operativa: '👥',
  juntas: '🤝',
  cafeteria: '☕',
};
const TOOL_NAMES: Record<Tool, string> = {
  privado: 'Privado',
  operativa: 'Área Operativa',
  juntas: 'Sala de Juntas',
  cafeteria: 'Cafetería',
};

export function VentasView() {
  const [activeTab, setActiveTab] = useState<'datos' | 'briefing'>('datos');
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  // Tab 1 Form State
  const [cliente, setCliente] = useState('Grupo Expansión S.A.');
  const [monto, setMonto] = useState('450000');
  const [metros, setMetros] = useState('120');
  const [obs, setObs] = useState('');

  // Canvas State
  const containerRef = useRef<HTMLDivElement>(null);
  const [pins, setPins] = useState<{id: number, x: number, y: number, tool: Tool, count: string}[]>([]);
  const [promptDialog, setPromptDialog] = useState<{x: number, y: number, tool: Tool} | null>(null);
  const [usersCount, setUsersCount] = useState('');

  // Files State
  const [files, setFiles] = useState({
    planos: [{ name: 'planta_layout_v2.dwg', date: 'Hoy' }],
    galeria: [{ name: 'foto_obra_1.jpg', date: 'Hoy' }],
    xml: [] as any[]
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!activeTool || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPromptDialog({ x, y, tool: activeTool });
  };

  const handleUpload = (type: 'planos' | 'galeria' | 'xml') => {
    const ext = type === 'planos' ? 'dwg' : type === 'galeria' ? 'jpg' : 'xml';
    setFiles(prev => ({
      ...prev,
      [type]: [...prev[type], { name: `nuevo_archivo_${Math.floor(Math.random()*100)}.${ext}`, date: 'Justo ahora' }]
    }));
    showToast(`Archivo subido exitosamente a /${type}/`);
  };

  // Magnitude Logic
  const montoNum = parseFloat(monto) || 0;
  const m2Num = parseFloat(metros) || 0;
  let magLabel = 'Micro / Chico';
  let magColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let magDesc = 'Requiere validación estándar. Procedimiento rápido.';
  
  if (montoNum > 1000000 || m2Num > 500) {
    magLabel = 'Macro / Grande';
    magColor = 'bg-red-100 text-red-800 border-red-300';
    magDesc = 'Requiere validación de Dirección Técnica y revisión de viabilidad por volumen.';
  } else if (montoNum >= 200000 || m2Num >= 80) {
    magLabel = 'Mediano';
    magColor = 'bg-amber-100 text-amber-800 border-amber-300';
    magDesc = 'Requiere revisión técnica detallada para propuesta.';
  }

  return (
    <div className="flex flex-1 w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* 1. Sidebar Ejecutivo */}
      <div className="w-20 md:w-56 shrink-0 bg-[#0f172a] text-slate-300 flex flex-col justify-between py-6 px-4">
        <div className="flex flex-col gap-6">
          <div className="px-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Módulo</span>
            <span className="text-xl font-semibold text-white tracking-tight hidden md:block">Captura de Campo</span>
            <span className="text-xl font-semibold text-white tracking-tight md:hidden">CC</span>
          </div>

          <nav className="flex flex-col gap-2">
             <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-500 transition-colors">
               <Building2 className="w-5 h-5 shrink-0" />
               <span className="hidden md:inline text-sm">Nuevo Proyecto</span>
             </button>
             <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
               <Monitor className="w-5 h-5 shrink-0" />
               <span className="hidden md:inline text-sm">Presentador 3D</span>
             </button>
          </nav>
        </div>

        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hidden md:block">
           <div className="flex items-center gap-2 mb-2">
             <Box className="w-4 h-4 text-orange-400" />
             <span className="text-xs font-bold text-slate-300">Hunter CRM Sync</span>
           </div>
           <div className="flex items-center justify-between text-[10px] font-mono">
             <span className="text-emerald-400">● Conectado</span>
             <span className="opacity-50">Ping: 12ms</span>
           </div>
        </div>
      </div>

      {/* 2. Área Central (Briefing & Formulario) */}
      <div className="flex-1 flex flex-col bg-white min-w-0 border-r border-slate-200">
        
        {/* Tabs Generales */}
        <div className="flex border-b border-slate-200 px-6 pt-4 bg-slate-50 gap-6">
          <button 
            onClick={() => { setActiveTab('datos'); showToast('Vista principal de datos cargada'); }}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'datos' ? 'text-sky-600 border-sky-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
            1. Datos Base & Magnitud
          </button>
          <button 
            onClick={() => { setActiveTab('briefing'); showToast('Lienzo de briefing listo'); }}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'briefing' ? 'text-sky-600 border-sky-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
            2. Lienzo de Briefing
          </button>
        </div>

        {/* Tab 1: Datos Base */}
        {activeTab === 'datos' && (
          <div className="flex-1 overflow-auto p-8 flex flex-col gap-8">
             <div className="grid grid-cols-2 gap-6">
               <div className="flex flex-col gap-2">
                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Razón Social del Cliente</label>
                 <input type="text" value={cliente} onChange={e => setCliente(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all" />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-xs font-bold text-orange-600 uppercase tracking-wide flex items-center gap-1"><Link className="w-3 h-3" /> ID Oportunidad (Hunter CRM)</label>
                 <input type="text" value="HUNTER-9482-B" readOnly className="w-full border border-orange-200 bg-orange-50 text-orange-900 font-mono rounded-lg p-3 text-sm cursor-not-allowed" />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
               <div className="flex flex-col gap-2">
                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Monto Estimado (MXN)</label>
                 <input type="number" value={monto} onChange={e => setMonto(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all" />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Metros Cuadrados (m²)</label>
                 <input type="number" value={metros} onChange={e => setMetros(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all" />
               </div>
             </div>

             <div className={`p-4 rounded-xl border ${magColor} transition-all duration-300 shadow-sm`}>
               <h3 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Magnitud del Proyecto Calculada</h3>
               <p className="text-2xl font-bold tracking-tight mb-2">{magLabel}</p>
               <p className="text-sm opacity-90">{magDesc}</p>
             </div>

             <div className="flex flex-col gap-2">
                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Observaciones de Operación Críticas</label>
                 <textarea 
                   placeholder="Ej: Accesos restringidos por la tarde, requiere EPP completo para entrar a planta..."
                   value={obs} onChange={e => setObs(e.target.value)} 
                   className="w-full border border-slate-300 rounded-lg p-3 text-sm min-h-[120px] focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all resize-none" 
                 />
             </div>
          </div>
        )}

        {/* Tab 2: Canvas Briefing */}
        {activeTab === 'briefing' && (
          <div className="flex-1 flex overflow-hidden">
             
             {/* Toolbar Canvas */}
             <div className="w-48 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-3 shrink-0 overflow-y-auto">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Herramientas</span>
                {(Object.keys(TOOL_EMOJIS) as Tool[]).map(key => (
                  <button 
                    key={key}
                    onClick={() => setActiveTool(key)}
                    className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all border ${activeTool === key ? 'bg-sky-100 border-sky-300 shadow-sm' : 'bg-white border-slate-200 hover:border-sky-200 shadow-sm'}`}
                  >
                    <span className="text-xl">{TOOL_EMOJIS[key]}</span>
                    <span className="text-xs font-bold text-slate-700">{TOOL_NAMES[key]}</span>
                  </button>
                ))}
                
                <div className="mt-auto pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 leading-relaxed">Selecciona una herramienta y haz clic en el plano para soltar un requerimiento espacial.</p>
                </div>
             </div>

             {/* Canvas Container */}
             <div className="flex-1 bg-slate-100 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] relative overflow-hidden flex flex-col m-4 rounded-xl border-2 border-dashed border-slate-300 shadow-inner">
               {activeTool && (
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10 animate-bounce cursor-default">
                    Modo activo: Haz clic en el plano para colocar "{TOOL_NAMES[activeTool]}"
                 </div>
               )}
               
               <div 
                 ref={containerRef}
                 className={`flex-1 relative ${activeTool ? 'cursor-crosshair' : 'cursor-default'}`} 
                 onClick={handleCanvasClick}
               >
                 {pins.map((pin, i) => (
                   <div 
                     key={pin.id} 
                     className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center hover:scale-110 transition-transform cursor-pointer"
                     style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                     onClick={(e) => { e.stopPropagation(); showToast(`${TOOL_NAMES[pin.tool]}: ${pin.count} usuarios requeridos.`); }}
                   >
                     <div className="w-10 h-10 bg-white rounded-full shadow-lg border-2 border-slate-200 flex items-center justify-center text-xl">
                       {TOOL_EMOJIS[pin.tool]}
                     </div>
                     <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-md whitespace-nowrap">
                       {pin.count} usu.
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Prompt Modal */}
             {promptDialog && (
               <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
                 <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col gap-4 w-80 animate-in zoom-in-95 duration-200">
                    <span className="text-lg font-bold text-slate-800">Requerimiento de {TOOL_NAMES[promptDialog.tool]}</span>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cantidad de Usuarios</label>
                      <input autoFocus type="number" value={usersCount} onChange={e => setUsersCount(e.target.value)} placeholder="Ej: 12" className="border-2 border-slate-200 rounded-lg p-3 text-base text-center font-bold focus:border-sky-500 focus:outline-none" />
                    </div>
                    <div className="flex gap-2 justify-end mt-2">
                       <button onClick={() => {setPromptDialog(null); setActiveTool(null); setUsersCount('');}} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold w-full hover:bg-slate-200 transition-colors">Cancelar</button>
                       <button onClick={() => {
                          if (usersCount.trim()) {
                             setPins([...pins, { id: Date.now(), x: promptDialog.x, y: promptDialog.y, tool: promptDialog.tool, count: usersCount }]);
                             showToast(`Pin añadido: ${usersCount} usuarios asignados.`);
                             setActiveTool(null);
                             setPromptDialog(null);
                             setUsersCount('');
                          }
                       }} className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-bold w-full hover:bg-sky-500 transition-colors shadow-md">Confirmar</button>
                    </div>
                 </div>
               </div>
             )}

          </div>
        )}

      </div>

      {/* 3. Panel Lateral Derecho (Bóveda y Tracking) */}
      <div className="w-80 shrink-0 bg-slate-50 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-slate-200 bg-white">
          <h2 className="font-bold text-slate-800 text-lg flex justify-between items-center">
            Bóveda Técnica
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Expediente Centralizado</p>
          <button className="w-full mt-4 bg-slate-800 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Descragar Todo (.ZIP)
          </button>
        </div>

        {/* Carpetas */}
        <div className="p-4 flex flex-col gap-4">
           {/* Planos */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2"><FileCode2 className="w-3.5 h-3.5 text-blue-500" /> /planos_trazos/</span>
               <button onClick={() => handleUpload('planos')} className="text-blue-600 hover:bg-blue-100 p-1 rounded transition-colors"><FolderPlus className="w-4 h-4" /></button>
             </div>
             <div className="p-2 flex flex-col">
               {files.planos.map((f, i) => (
                 <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded group">
                   <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-mono text-[9px] shrink-0">DWG</div>
                   <div className="min-w-0 flex-1">
                     <p className="text-xs font-medium text-slate-700 truncate">{f.name}</p>
                     <p className="text-[9px] text-slate-400">{f.date}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Galeria */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2"><FileImage className="w-3.5 h-3.5 text-emerald-500" /> /galeria_obra/</span>
               <button onClick={() => handleUpload('galeria')} className="text-emerald-600 hover:bg-emerald-100 p-1 rounded transition-colors"><FolderPlus className="w-4 h-4" /></button>
             </div>
             <div className="p-2 flex flex-col">
               {files.galeria.map((f, i) => (
                 <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded group">
                   <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center font-mono text-[9px] shrink-0">JPG</div>
                   <div className="min-w-0 flex-1">
                     <p className="text-xs font-medium text-slate-700 truncate">{f.name}</p>
                     <p className="text-[9px] text-slate-400">{f.date}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Presupuestos */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2"><FileBox className="w-3.5 h-3.5 text-orange-500" /> /xml_presupuestos/</span>
               <button onClick={() => handleUpload('xml')} className="text-orange-600 hover:bg-orange-100 p-1 rounded transition-colors"><FolderPlus className="w-4 h-4" /></button>
             </div>
             {files.xml.length === 0 && (
               <div className="p-4 text-center text-xs text-slate-400 italic">Carpeta vacía</div>
             )}
             <div className="p-2 flex flex-col">
               {files.xml.map((f, i) => (
                 <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded group">
                   <div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center font-mono text-[9px] shrink-0">XML</div>
                   <div className="min-w-0 flex-1">
                     <p className="text-xs font-medium text-slate-700 truncate">{f.name}</p>
                     <p className="text-[9px] text-slate-400">{f.date}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Tracking Timeline */}
        <div className="mt-auto bg-white border-t border-slate-200 p-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Pipeline Técnico</h3>
          <div className="flex flex-col gap-0 relative">
             <div className="absolute left-[11px] top-2 bottom-6 w-[2px] bg-slate-200 z-0"></div>
             
             {/* Step 1 */}
             <div className="flex gap-4 relative z-10 mb-4 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm border-2 border-white"><Check className="w-3 h-3" /></div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-800">Briefing Completado</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Captura inicial por ventas</p>
                </div>
             </div>

             {/* Step 2 */}
             <div className="flex gap-4 relative z-10 mb-4 items-start">
                <div className="w-6 h-6 rounded-full bg-sky-500 border-2 border-white shadow-sm shrink-0 flex items-center justify-center"><Circle className="w-2.5 h-2.5 text-white fill-white animate-pulse" /></div>
                <div className="bg-sky-50 rounded-lg border border-sky-200 p-3 flex-1">
                  <p className="text-xs font-bold text-sky-900">Asignado a Proyectista</p>
                  <p className="text-[10px] text-sky-700 font-medium mt-0.5">Arq. Karen Tovar</p>
                  <span className="inline-block mt-2 bg-sky-200/50 text-sky-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Carga: 3/5 Proyectos</span>
                </div>
             </div>

             {/* Step 3 */}
             <div className="flex gap-4 relative z-10 mb-4 items-start opacity-40">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 shrink-0"></div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-700">Propuesta 3D</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Pendiente de entrega técnica</p>
                </div>
             </div>
             
             {/* Step 4 */}
             <div className="flex gap-4 relative z-10 items-start opacity-40">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 shrink-0"></div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-700">VBO Comercial</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Pendiente de revisión</p>
                </div>
             </div>

          </div>
        </div>

      </div>

      {/* 4. Footer FLotante de Acciones Globales (Absolute on center content) */}
      <div className="absolute bottom-6 left-[6rem] md:left-[16rem] right-84 max-w-full flex justify-center pointer-events-none z-40">
         <div className="bg-white border-2 border-slate-200 shadow-xl rounded-xl p-3 flex items-center gap-6 pointer-events-auto">
            <div className="flex items-center gap-2 px-2 text-slate-500">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-bold uppercase tracking-wider">Guardado Automático</span>
            </div>
            <div className="flex gap-2">
               <button className="px-5 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-200 transition-colors">
                  Guardar Borrador
               </button>
               <button 
                  onClick={() => showToast('Solicitud enviada a la cola técnica de CEREBRO.')}
                  className="px-6 py-2.5 bg-sky-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-sky-500 transition-colors shadow-md flex items-center gap-2">
                  <span>🚀</span> Enviar a Proyectos
               </button>
            </div>
         </div>
      </div>

      {/* Modales / Toasts Globales */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

    </div>
  );
}
