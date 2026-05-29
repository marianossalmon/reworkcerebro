import React from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { AlertCircle, Smartphone, Mail, ShieldAlert, CheckCircle2, User, Landmark, Briefcase } from 'lucide-react';

interface StepAsesorProps {
  onNext: () => void;
}

export default function StepAsesor({ onNext }: StepAsesorProps) {
  const { state, dispatch } = usePresentation();
  const { nombre, puesto, sucursal, email, telefono, fotoUrl, perfilIncompleto } = state.asesor;

  const handleUpdate = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_ASESOR',
      payload: { [field]: value }
    });
  };

  const handleQuickFixPhone = () => {
    handleUpdate('telefono', '+52 449 123 4567');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-2">
      {/* Dynamic Non-Blocking Informative Banner */}
      {perfilIncompleto ? (
        <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-4 flex gap-3.5 shadow-sm animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-900">Perfil de Asesor Incompleto para Cliente</h4>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Falta registrar tu número telefónico corporativo. El cliente final necesita tus datos de contacto directos en el player interactivo para realizar llamadas rápidas de negociación o enviar correos de confirmación.
            </p>
            <button 
              type="button" 
              onClick={handleQuickFixPhone}
              className="mt-2.5 text-xs font-semibold text-amber-800 hover:text-amber-900 underline flex items-center gap-1 cursor-pointer"
            >
              ⚡ Completar con teléfono default de Ventas
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3.5 shadow-sm animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-emerald-900">¡Tu perfil de ventas está optimizado!</h4>
            <p className="text-xs text-emerald-700 mt-0.5">
              Toda tu información corporativa se indexará perfectamente en el Play Mode interactivo para el cliente.
            </p>
          </div>
        </div>
      )}

      {/* Main Form Fields Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-50 pb-5">
          <div className="relative">
            {fotoUrl ? (
              <img 
                src={fotoUrl} 
                alt={nombre} 
                className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-100"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-[#0EC4C4] ring-2 ring-teal-100">
                <User className="w-7 h-7" />
              </div>
            )}
            <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">Asesor Activo</span>
            <h3 className="text-base font-bold text-gray-900 mt-1">{nombre || 'Asesor Comercial'}</h3>
            <p className="text-xs text-gray-500 font-medium">{puesto} • {sucursal}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" /> Nombre Completo
            </label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => handleUpdate('nombre', e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#0EC4C4] focus:ring-1 focus:ring-[#0EC4C4] bg-gray-50/50 hover:bg-white focus:bg-white transition-all outline-none" 
              placeholder="Tu nombre completo"
            />
          </div>

          {/* Puesto */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-gray-400" /> Puesto Interno
            </label>
            <input 
              type="text" 
              value={puesto} 
              onChange={(e) => handleUpdate('puesto', e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#0EC4C4] focus:ring-1 focus:ring-[#0EC4C4] bg-gray-50/50 hover:bg-white focus:bg-white transition-all outline-none" 
              placeholder="Asesor de marca, Proyectista..."
            />
          </div>

          {/* Sucursal */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-gray-400" /> Sucursal Corporativa
            </label>
            <input 
              type="text" 
              value={sucursal} 
              onChange={(e) => handleUpdate('sucursal', e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#0EC4C4] focus:ring-1 focus:ring-[#0EC4C4] bg-gray-50/50 hover:bg-white focus:bg-white transition-all outline-none" 
              placeholder="Planta, Monterrey, CDMX..."
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> Email del Asesor
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => handleUpdate('email', e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#0EC4C4] focus:ring-1 focus:ring-[#0EC4C4] bg-gray-50/50 hover:bg-white focus:bg-white transition-all outline-none" 
              placeholder="nombre@gebesa.com"
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-gray-650 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-500" /> Teléfono Celular/WhatsApp Corporativo 
              </span>
              {perfilIncompleto && <span className="text-[10px] text-amber-600 font-bold">¡Requerido!</span>}
            </label>
            <input 
              type="tel" 
              value={telefono} 
              onChange={(e) => handleUpdate('telefono', e.target.value)}
              className={`w-full text-xs font-semibold px-3.5 py-3 rounded-lg border focus:ring-1 focus:bg-white transition-all outline-none ${
                perfilIncompleto 
                  ? 'border-amber-300 bg-amber-50/10 focus:border-amber-400 focus:ring-amber-400' 
                  : 'border-gray-200 bg-gray-50/50 focus:border-[#0EC4C4] focus:ring-[#0EC4C4]'
              }`} 
              placeholder="Ej. +52 449 123 4567"
            />
            <p className="text-[10px] text-gray-400 font-medium">
              Utilizar el formato internacional prefijando el código telefónico del país (ej: +52 para México) para que el botón de enlace de WhatsApp funcione en el móvil de tu cliente.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button 
          type="button" 
          onClick={onNext}
          className="bg-[#0EC4C4] hover:bg-teal-600 text-white font-bold text-xs py-3.5 px-8 rounded-xl shadow-lg shadow-teal-500/10 tracking-wider uppercase transition-all duration-250 cursor-pointer active:scale-95"
        >
          Siguiente: Datos del Proyecto →
        </button>
      </div>
    </div>
  );
}
