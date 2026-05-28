import React, { useState } from 'react';
import { ArrowLeft, Sliders, ShieldAlert, CheckCircle2, Info, CalendarDays, User } from 'lucide-react';
import { users } from '../data';

interface VacacionesViewProps {
  onBack: () => void;
  vacationMode: boolean;
  setVacationMode: (val: boolean) => void;
  selectedBackup: string;
  setSelectedBackup: (val: string) => void;
  projectsCountToDelegate?: number;
}

export function VacacionesView({ 
  onBack, 
  vacationMode, 
  setVacationMode, 
  selectedBackup, 
  setSelectedBackup,
  projectsCountToDelegate = 3
}: VacacionesViewProps) {
  // Local state for dates before saving
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-15');
  const [localVacationMode, setLocalVacationMode] = useState(vacationMode);
  const [backupProyectista, setBackupProyectista] = useState(selectedBackup);
  
  // Save confirmation state
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Suggested technical backups list
  const availableBackups = [
    { id: 'or', name: 'Oscar Rodriguez', initials: 'OR', location: 'Monterrey', currentCarga: '3/6 pts', available: '3 pts', badge: 'Recomendado por CEREBRO' },
    { id: 'rv', name: 'Rodrigo Vergara', initials: 'RV', location: 'Querétaro', currentCarga: '2/6 pts', available: '4 pts', badge: 'Carga Ligera' }
  ];

  const handleSave = () => {
    setVacationMode(localVacationMode);
    setSelectedBackup(backupProyectista);
    setIsSaved(true);
    
    const selectedBackupName = users[backupProyectista]?.name || backupProyectista;
    if (localVacationMode) {
      setToastMessage(`🌴 ¡MWM habilitado! Redirigiendo ${projectsCountToDelegate} folios con respaldo asignado a ${selectedBackupName}.`);
    } else {
      setToastMessage('🌴 Guardado. MWM desactivado. Has retomado el control de tu bandeja técnica.');
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const selectedBackupDetails = availableBackups.find(b => b.id === backupProyectista) || availableBackups[0];

  return (
    <div className="flex-1 flex flex-col bg-bg p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded shadow-2xl bg-[#121c17] border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="max-w-[680px] mx-auto w-full flex flex-col gap-6">
        <div>
          <button 
            id="vacaciones-back-btn"
            onClick={onBack} 
            className="flex items-center gap-1 text-text-dim hover:text-text-main text-xs uppercase font-extrabold tracking-wider mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Mis Proyectos</span>
          </button>
          <h2 className="text-3xl font-serif text-text-main tracking-tight leading-tight">MWM — Modo Vacaciones Mitigación</h2>
          <p className="text-xs text-text-muted mt-1 font-sans">Automatización inteligente del CEREBRO para coordinar suplencias y mitigar retrasos en entregas SLA.</p>
        </div>

        {/* Gold Callout Explanation */}
        <div className="bg-[#1c1610] border border-amber-500/20 text-[#ebdcb5] p-5 rounded-xl text-xs flex gap-3 leading-normal">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="block uppercase font-bold text-amber-400">¿Cómo opera el MWM?</strong>
            <p className="mt-1 font-normal text-[11px] text-[#ebdcb5]">
              Cuando activas el Modo Vacaciones (MWM), la Red Neuronal del CEREBRO realiza de forma automática:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 font-mono text-[9.5px] opacity-80 pl-1 leading-relaxed">
              <li>Configura una delegación directa de tus proyectos activos hacia el suplente idóneo.</li>
              <li>Instaura desvío de notificaciones y chats de folios entrantes.</li>
              <li>Previene penalizaciones en SLA técnica reportando al Gerente de Proyectos sobre los cambios.</li>
            </ul>
          </div>
        </div>

        {/* Main Card Contenedor */}
        <div className="bg-bg2/40 border border-border/80 rounded-xl p-6 flex flex-col gap-5">
          {/* Toggle Button */}
          <div className="flex justify-between items-center bg-bg/80 p-4 border border-border rounded-xl">
            <div>
              <h3 className="font-semibold text-sm text-text-main">
                {localVacationMode ? '🌴 MWM TOTALMENTE ACTIVADO' : '💤 MWM INACTIVO'}
              </h3>
              <p className="text-[10px] text-text-dim mt-0.5">El desvío inteligente redirigirá tu carga técnica durante tu periodo libre.</p>
            </div>

            <button
              id="vacation-toggle-btn"
              onClick={() => {
                setLocalVacationMode(!localVacationMode);
                setIsSaved(false);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                localVacationMode ? 'bg-[#50c878]' : 'bg-bg3 border border-border'
              }`}
            >
              <div 
                className={`w-4.5 h-4.5 rounded-full bg-white shadow transition-all transform ${
                  localVacationMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-text-dim tracking-wider font-mono">Fecha de Inicio</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => {
                    setStartDate(e.target.value);
                    setIsSaved(false);
                  }}
                  className="w-full bg-[#1c212b] border border-border p-3 text-xs rounded-xl text-text-main focus:outline-none focus:border-teal-400 font-medium cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-text-dim tracking-wider font-mono">Fecha de Regreso</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={endDate}
                  onChange={e => {
                    setEndDate(e.target.value);
                    setIsSaved(false);
                  }}
                  className="w-full bg-[#1c212b] border border-border p-3 text-xs rounded-xl text-text-main focus:outline-none focus:border-teal-400 font-medium cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Panel Suplente Sugerido */}
          <div>
            <label className="text-[10px] uppercase font-bold text-text-dim tracking-wider font-mono mb-2 block">
              Suplente sugerido por CEREBRO
            </label>

            <div className="space-y-3">
              {availableBackups.map(bk => {
                const isSelected = backupProyectista === bk.id;
                return (
                  <div 
                    key={bk.id}
                    onClick={() => {
                      setBackupProyectista(bk.id);
                      setIsSaved(false);
                    }}
                    className={`p-3 border rounded-xl bg-bg/60 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'border-teal-400/80 bg-teal-500/[0.015]' 
                        : 'border-border hover:border-border2'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#121c2a] text-blue-300 font-bold border border-blue-500/10 flex items-center justify-center text-xs">
                        {bk.initials}
                      </div>
                      <div>
                        <div className="font-bold text-text-main text-xs">{bk.name}</div>
                        <div className="text-[10px] text-text-dim mt-0.5">Sede CDMX · Carga actual: <strong className="text-text-muted">{bk.currentCarga}</strong> (Cupo disponible: {bk.available})</div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-teal-400/15 text-teal-400 border border-teal-400/10' : 'bg-[#151720] text-text-faint'
                    }`}>
                      {bk.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Callout teal when active */}
          {localVacationMode && isSaved && (
            <div className="bg-[#112019] border border-emerald-500/25 p-4 rounded-xl text-xs text-emerald-400 flex gap-3 leading-normal animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block uppercase font-bold tracking-wider">🌴 MWM Activo con éxito</strong>
                <p className="mt-1 font-sans text-xs text-[#abffd0]">
                  Periodo vacacional programado: del <strong>{startDate}</strong> al <strong>{endDate}</strong>.<br />
                  Suplente oficial asignado: <strong className="text-white">{selectedBackupDetails.name}</strong>.<br />
                  Se han delegado temporalmente <strong>{projectsCountToDelegate} folios</strong> activos en Bóveda.
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 justify-end border-t border-border/40 pt-4 mt-2">
            <button 
              onClick={onBack}
              className="bg-transparent text-text-muted hover:text-text-main font-bold text-xs px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              id="vacation-save-btn"
              onClick={handleSave}
              className="bg-[#2ecc71] hover:bg-[#27ae60] text-bg text-black font-extrabold uppercase text-[10px] tracking-widest py-3 px-5 rounded-md transition-all shadow-lg shadow-emerald-500/10"
            >
              Guardar configuración MWM
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
