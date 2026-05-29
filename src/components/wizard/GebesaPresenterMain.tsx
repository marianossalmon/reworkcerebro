import React, { useState, useEffect } from 'react';
import { PresentationProvider, usePresentation } from '../../context/PresentationContext';
import WizardProgress from './WizardProgress';
import StepAsesor from './StepAsesor';
import StepProyecto from './StepProyecto';
import StepArchivos from './StepArchivos';
import SharePanel from './SharePanel';
import PresentationGallery from './PresentationGallery';
import PresentationShell from '../client/PresentationShell';
import { Landmark, Sparkles, Layout, Eye, ArrowLeft, RefreshCw, Layers, Sun, Moon } from 'lucide-react';

export default function GebesaPresenterMain() {
  return (
    <PresentationProvider>
      <GebesaPresenterInner />
    </PresentationProvider>
  );
}

function GebesaPresenterInner() {
  const { state, dispatch } = usePresentation();
  const [viewMode, setViewMode] = useState<'advisor' | 'client'>('advisor');

  const { currentStep } = state;
  const isDarkMode = state.config.modoOscuroPlay;

  // Sync dark class on document element so index.css dark selector overrides take effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    dispatch({
      type: 'UPDATE_CONFIG',
      payload: { modoOscuroPlay: !isDarkMode }
    });
  };

  const handleSetStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const handleNextStep = () => {
    dispatch({ type: 'SET_STEP', payload: currentStep + 1 });
  };

  const handlePrevStep = () => {
    dispatch({ type: 'SET_STEP', payload: currentStep - 1 });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_PRESENTATION' });
    setViewMode('advisor');
  };

  // If client view is active, render client shell
  if (viewMode === 'client') {
    return (
      <PresentationShell 
        state={state} 
        onBackToWizard={() => setViewMode('advisor')} 
      />
    );
  }

  return (
    <div className={`w-full h-full flex flex-col overflow-y-auto font-sans select-none transition-colors duration-250 ${
      isDarkMode ? 'bg-[#0f1424] text-gray-200' : 'bg-gray-50 text-gray-800'
    }`}>
      
      {/* Top Controller Header */}
      <div className={`px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3.5 sticky top-0 z-40 border-b transition-colors duration-250 ${
        isDarkMode 
          ? 'bg-[#131b2e] border-gray-800 shadow-md shadow-black/15 text-white' 
          : 'bg-white border-gray-100 shadow-3xs text-gray-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#0EC4C4] font-bold text-base shadow-3xs">
            ✨
          </div>
          <div>
            <h2 className={`text-sm font-bold flex items-center gap-1.5 font-sans ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Presentador de Proyectos Gebesa <span className="text-[9px] bg-teal-500/10 text-[#0EC4C4] font-extrabold px-1.5 py-0.2 rounded font-mono uppercase tracking-wider">v2.0 Redesign</span>
            </h2>
            <p className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>Carga de entregables, vinculación al CRM y visualización móvil Play Mode.</p>
          </div>
        </div>

        {/* Toolbar switches */}
        <div className="flex items-center gap-2">
          {/* Beautiful Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`font-bold text-xs py-2 px-3.5 rounded-xl border flex items-center gap-2 transition-colors cursor-pointer shadow-3xs ${
              isDarkMode 
                ? 'bg-slate-850/90 border-slate-700 text-teal-400 hover:bg-slate-800/95' 
                : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
            }`}
            title="Alternar Modo Claro / Oscuro"
          >
            {isDarkMode ? (
              <>
                <Moon className="w-4 h-4 text-teal-400" />
                <span>Modo Oscuro</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Modo Claro</span>
              </>
            )}
          </button>

          {currentStep > 0 && (
            <button 
              type="button" 
              onClick={() => dispatch({ type: 'SET_STEP', payload: 0 })}
              className={`font-bold text-xs py-2 px-3.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs ${
                isDarkMode 
                  ? 'bg-slate-850 border-slate-700 hover:bg-slate-800 text-gray-200' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
              }`}
              title="Regresar a mi galería de propuestas"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-600" /> Mi Galería de Propuestas
            </button>
          )}

          {currentStep > 1 && (
            <button 
              type="button" 
              onClick={() => setViewMode('client')}
              className={`font-bold text-xs py-2 px-3.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-850 border-slate-700 hover:bg-slate-800 text-gray-200' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-250'
              }`}
              title="Inspecciona en tiempo real cómo lo verá tu cliente final"
            >
              <Eye className="w-3.5 h-3.5 text-teal-600" /> Vista Previa Cliente
            </button>
          )}

          {currentStep > 0 && (
            <button 
              type="button" 
              onClick={handleReset}
              className="text-[10.5px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 py-2 px-3 rounded-xl transition-colors cursor-pointer"
            >
              Limpiar Datos
            </button>
          )}
        </div>
      </div>

      {/* Progress timeline tracker header */}
      {currentStep >= 1 && currentStep <= 3 && (
        <WizardProgress 
          currentStep={currentStep} 
          onSetStep={handleSetStep} 
          noAplica3D={state.proyecto.noAplica3D}
          archivosUploaded={state.archivos.length}
        />
      )}

      {/* Main active Step space with soft fade in animation */}
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full animate-in fade-in duration-300">
        {currentStep === 0 && (
          <PresentationGallery onLaunchClientView={() => setViewMode('client')} />
        )}

        {currentStep === 1 && (
          <StepAsesor onNext={handleNextStep} />
        )}
        
        {currentStep === 2 && (
          <StepProyecto 
            onNext={handleNextStep} 
            onPrev={handlePrevStep} 
          />
        )}
        
        {currentStep === 3 && (
          <StepArchivos 
            onNext={handleNextStep} 
            onPrev={handlePrevStep} 
          />
        )}

        {currentStep >= 4 && (
          <SharePanel 
            onReset={handleReset} 
            onLaunchClientView={() => setViewMode('client')} 
          />
        )}
      </div>

    </div>
  );
}
