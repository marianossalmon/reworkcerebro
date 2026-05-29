import React, { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { FileUp, Eye, Trash2, HelpCircle, HardDrive, Sparkles, Check, AlertTriangle, FileCode } from 'lucide-react';

interface StepArchivosProps {
  onNext: () => void;
  onPrev: () => void;
}

export default function StepArchivos({ onNext, onPrev }: StepArchivosProps) {
  const { state, dispatch } = usePresentation();
  const { archivos, proyecto } = state;
  const { noAplica3D } = proyecto;

  const [dragActive, setDragActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const name = file.name;
    const extension = name.split('.').pop()?.toLowerCase();
    
    let categoria: 'renders' | 'planos' | 'modelos3d' | 'otros' = 'otros';
    if (['png', 'jpg', 'jpeg', 'webp', 'mp4', 'mov'].includes(extension || '')) {
      categoria = 'renders';
    } else if (['pdf'].includes(extension || '')) {
      categoria = 'planos';
    } else if (['glb', 'gltf', 'obj', 'fbx'].includes(extension || '')) {
      categoria = 'modelos3d';
    }

    // Since we are client-side only, we formulate object URL of file for rendering!
    const objectUrl = URL.createObjectURL(file);
    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    const newArchivo = {
      id: 'file-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now(),
      nombre: name,
      url: objectUrl,
      size: sizeStr,
      type: file.type || 'application/octet-stream',
      categoria,
      fechaSubida: 'Hace unos momentos'
    };

    dispatch({
      type: 'ADD_ARCHIVOS',
      payload: [newArchivo]
    });

    showToast(`Categorizado como: ${categoria.toUpperCase()} ✓`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files) as File[];
      files.forEach(file => processFile(file));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files) as File[];
      files.forEach(file => processFile(file));
    }
  };

  // Prepopulate standard demo high fidelity assets if user wants to check instantly
  const handleLoadDemoAsset = (type: 'render2' | 'plano2' | 'glb') => {
    let demoFile;
    if (type === 'render2') {
      demoFile = {
        id: 'demo-render2-' + Date.now(),
        nombre: 'Showroom_Gebesa_Oficina_Abierta.jpg',
        url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop',
        size: '1.8 MB',
        type: 'image/jpeg',
        categoria: 'renders' as const,
        fechaSubida: 'Hace unos segundos'
      };
    } else if (type === 'plano2') {
      demoFile = {
        id: 'demo-plano2-' + Date.now(),
        nombre: 'Cortes_Plano_Ingenieria_GConnect.pdf',
        url: 'https://pdfobject.com/pdf/sample.pdf',
        size: '3.4 MB',
        type: 'application/pdf',
        categoria: 'planos' as const,
        fechaSubida: 'Hace unos segundos'
      };
    } else {
      demoFile = {
        id: 'demo-glb-' + Date.now(),
        nombre: 'Mesa_Conectividad_GConnect_3D.glb',
        url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // valid glb URL from publicly available library
        size: '4.8 MB',
        type: 'model/gltf-binary',
        categoria: 'modelos3d' as const,
        fechaSubida: 'Hace unos segundos'
      };
    }

    dispatch({ type: 'ADD_ARCHIVOS', payload: [demoFile] });
    showToast(`Demo ${demoFile.nombre} cargado ✓`);
  };

  const renders = archivos.filter(a => a.categoria === 'renders');
  const planos = archivos.filter(a => a.categoria === 'planos');
  const modelos3d = archivos.filter(a => a.categoria === 'modelos3d');

  // Multi-crossed step verification: Can skip 3D if noAplica3D checked
  const canSubmit = renders.length > 0 && planos.length > 0 && (noAplica3D || modelos3d.length > 0);

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-2">
      
      {/* Upload Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-gray-900 border border-gray-800 text-[#0EC4C4] font-bold text-xs py-3 px-5 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-right-3 duration-300">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Files Form Zone */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
        
        {/* Toggle options */}
        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5Packed">
            <HardDrive className="w-4 h-4 text-teal-600" /> Carga Inteligente de Archivos (SmartDropZone)
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-500">¿No aplica archivo 3D?</span>
            <input 
              type="checkbox" 
              id="noAplica3D"
              checked={noAplica3D}
              onChange={(e) => dispatch({ type: 'SET_NO_APLICA_3D', payload: e.target.checked })}
              className="w-4.5 h-4.5 text-[#0EC4C4] border-gray-300 rounded focus:ring-[#0EC4C4] cursor-pointer"
            />
          </div>
        </div>

        {/* SmartDropZone Box */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 relative select-none cursor-pointer ${
            dragActive 
              ? 'border-[#0EC4C4] bg-teal-50/25 scale-[1.01]' 
              : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50/30'
          }`}
          onClick={() => document.getElementById('smart-file-chooser')?.click()}
        >
          <input 
            type="file" 
            id="smart-file-chooser" 
            multiple 
            className="hidden" 
            onChange={handleFileInput}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-[#0EC4C4]">
              <FileUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Arrastra archivos aquí o haz clic para seleccionar</p>
              <p className="text-[11px] text-gray-450 mt-1 leading-relaxed">
                El sistema clasificará automáticamente: <strong className="text-teal-600 font-semibold">Fotografías/Renders</strong>, <strong className="text-blue-500 font-semibold">Planos PDF</strong>, y <strong className="text-orange-600 font-semibold">Modelos 3D (.glb)</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Fast Sandbox Options */}
        <div className="bg-slate-50 border border-slate-105 p-3 rounded-xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Simulador Rápido (Carga un archivo muestra de Gebesa):</p>
          <div className="flex flex-wrap gap-2">
            <button 
              type="button" 
              onClick={() => handleLoadDemoAsset('render2')}
              className="text-[10.5px] font-semibold bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-2.5 py-1.5 rounded-md shadow-2xs cursor-pointer"
            >
              🖼️ + Cargar Render Extra
            </button>
            <button 
              type="button" 
              onClick={() => handleLoadDemoAsset('plano2')}
              className="text-[10.5px] font-semibold bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-2.5 py-1.5 rounded-md shadow-2xs cursor-pointer"
            >
              📄 + Cargar Plano Extra
            </button>
            {!noAplica3D && (
              <button 
                type="button" 
                onClick={() => handleLoadDemoAsset('glb')}
                className="text-[10.5px] font-semibold bg-white border border-[#0EC4C4] text-teal-600 hover:bg-teal-50/10 px-2.5 py-1.5 rounded-md shadow-2xs cursor-pointer"
              >
                📦 + Cargar Modelo 3D (.glb)
              </button>
            )}
          </div>
        </div>

        {/* Categorized File Overview Lists */}
        <div className="space-y-4 pt-2">
          {/* Renders category */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
              <span className="flex items-center gap-1.5">🖼️ Renders y Fotogaleria ({renders.length})</span>
              {renders.length === 0 && <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">⚠️ Requerido</span>}
            </div>
            {renders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {renders.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-white shadow-3xs text-xs">
                    <span className="font-semibold text-gray-800 truncate max-w-xs">{item.nombre}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400">{item.size}</span>
                      <button 
                        type="button" 
                        onClick={() => dispatch({ type: 'REMOVE_ARCHIVO', payload: item.id })}
                        className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 rounded-xl border border-dashed border-gray-100 text-center text-[11px] text-gray-400 bg-gray-50/20">Pendiente: Sube renders (.jpg, .png) para ilustrar al cliente.</div>
            )}
          </div>

          {/* Planos category */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
              <span className="flex items-center gap-1.5">📄 Planos de Zonificación y Planta ({planos.length})</span>
              {planos.length === 0 && <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">⚠️ Requerido</span>}
            </div>
            {planos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {planos.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-white shadow-3xs text-xs">
                    <span className="font-semibold text-gray-800 truncate max-w-xs">{item.nombre}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400">{item.size}</span>
                      <button 
                        type="button" 
                        onClick={() => dispatch({ type: 'REMOVE_ARCHIVO', payload: item.id })}
                        className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 rounded-xl border border-dashed border-gray-100 text-center text-[11px] text-gray-400 bg-gray-50/20">Pendiente: Sube planos arquitectónicos o de distribución en PDF.</div>
            )}
          </div>

          {/* 3D category (Show only if applicable) */}
          {!noAplica3D && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1.5">📦 Modelos 3D Interactivos GLB ({modelos3d.length})</span>
                {modelos3d.length === 0 && <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">⚠️ Requerido</span>}
              </div>
              {modelos3d.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {modelos3d.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-white shadow-3xs text-xs">
                      <span className="font-semibold text-gray-800 truncate max-w-xs">{item.nombre}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-400">{item.size}</span>
                        <button 
                          type="button" 
                          onClick={() => dispatch({ type: 'REMOVE_ARCHIVO', payload: item.id })}
                          className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 rounded-xl border border-dashed border-amber-100 text-center text-[11px] text-gray-550 bg-amber-50/5/9">
                  Pendiente: Sube archivo .glb para renderizar el modelo tridimensional interactivo. O marca la casilla superior "No aplica archivo 3D" para omitir esta validación.
                </div>
              )}
            </div>
          )}

          {/* Step warning validation if missing */}
          {!canSubmit && (
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-100 flex gap-2.5 items-start text-xs text-amber-850 mt-4 leading-normal">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Faltan entregables requeridos:</strong>
                <ul className="list-disc list-inside mt-1 font-medium space-y-0.5">
                  {renders.length === 0 && <li>Por lo menos un render de amueblado (.png / .jpg)</li>}
                  {planos.length === 0 && <li>Por lo menos un archivo plano de distribución (.pdf)</li>}
                  {!noAplica3D && modelos3d.length === 0 && <li>Un modelo tridimensional (.glb) o activa la opción "No aplica archivo 3D"</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button 
          type="button" 
          onClick={onPrev}
          className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-xs py-3.5 px-6 rounded-xl transition-all cursor-pointer"
        >
          ← Regresar al Paso 2
        </button>
        <button 
          type="button" 
          onClick={onNext}
          disabled={!canSubmit}
          className={`font-bold text-xs py-3.5 px-8 rounded-xl tracking-wider uppercase transition-all duration-250 cursor-pointer ${
            canSubmit
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          ✨ Generar Presentación Interactiva
        </button>
      </div>
    </div>
  );
}
