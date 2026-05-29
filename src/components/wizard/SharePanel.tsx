import React, { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { CheckCircle, Copy, Check, QrCode, Mail, MessageSquare, ExternalLink, RefreshCw } from 'lucide-react';

interface SharePanelProps {
  onReset: () => void;
  onLaunchClientView: () => void;
}

export default function SharePanel({ onReset, onLaunchClientView }: SharePanelProps) {
  const { state, dispatch } = usePresentation();
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    dispatch({ type: 'SAVE_CURRENT_TO_GALLERY' });
  }, [dispatch]);

  const clientName = state.proyecto.nombreCliente || 'Cliente Esencial';
  const projectName = state.proyecto.nombreProyecto || 'Especificación de Mobiliario Gebesa';
  const advisorName = state.asesor.nombre || 'Asesor';

  // Build simulated unique link of client presentation
  const mockUrl = `${window.location.origin}${window.location.pathname}?view=client&id=${state.proyecto.idCliente || 'GEB-DEMO'}`;

  // WhatsApp formatted string
  const waText = `¡Hola, ${state.proyecto.contactoNombre || 'estimado cliente'}! Le saluda ${advisorName} de Gebesa. Es un gusto compartirle nuestra propuesta y modelados interactivos de mobiliario de alta especificación para el proyecto "${projectName}". Puede revisarla directamente ingresando al siguiente enlace interactivo 3D desde su celular o laptop: ${mockUrl}`;
  const encodedWaText = encodeURIComponent(waText);
  const waUrl = `https://wa.me/${state.proyecto.contactoTelefono.replace(/\s+/g, '')}?text=${encodedWaText}`;

  // Mail formatted action
  const mailSubject = `Propuesta Comercial de Mobiliario Gebesa - ${projectName}`;
  const mailBody = `Estimado(a) ${state.proyecto.contactoNombre},\n\nEspero que se encuentre muy bien.\n\nAdjunto y comparto el enlace web de nuestra propuesta interactiva de mobiliario para el proyecto "${projectName}", diseñado por el equipo de Gebesa:\n\n👉 Enlace de Presentación Interactiva: ${mockUrl}\n\nEn este enlace podrá revisar de forma tridimensional la distribución y los acabados especificados para sus áreas de trabajo.\n\nQuedo a su disposición para cualquier duda.\n\nAtentamente,\n\n${advisorName}\n${state.asesor.puesto}\nGebesa - Planta Sucursal\nTelefono: ${state.asesor.telefono}`;
  const mailUrl = `mailto:${state.proyecto.contactoEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto py-2 animate-in zoom-in-95 duration-350">
      
      {/* Congratulations Card */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <QrCode className="w-48 h-48" />
        </div>
        
        <div className="mx-auto w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <CheckCircle className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-lg font-bold">¡Presentación Publicada Exitosamente!</h2>
        <p className="text-xs text-teal-100 mt-1 max-w-md mx-auto leading-relaxed">
          Los renders, planos y modelados tridimensionales han sido procesados y sincronizados en la nube de Gebesa. El link ya se encuentra activo para tu cliente.
        </p>
      </div>

      {/* Sharing Toolkit card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <div className="space-y-1.5Packed">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Presentación Relacional para:</span>
          <h3 className="text-sm font-bold text-gray-900">{clientName}</h3>
          <p className="text-xs text-gray-500">{projectName}</p>
        </div>

        {/* Share Link Input copy */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-650">Enlace Único de Visualización (Cliente)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={mockUrl}
              className="flex-1 bg-gray-50 text-xs font-semibold text-gray-600 px-3.5 py-3 rounded-lg border border-gray-200 outline-none select-all"
            />
            <button 
              type="button" 
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-3 rounded-lg transition-all border outline-none cursor-pointer ${
                copied 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 animate-bounce" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copiar
                </>
              )}
            </button>
          </div>
        </div>

        {/* QR Code and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* QR Code section */}
          <div className="border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-50/50">
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-3xs flex items-center justify-center">
              {/* Clean decorative placeholder vector matching aesthetic standards */}
              <QrCode className="w-24 h-24 text-gray-800" />
            </div>
            <p className="text-[10px] text-gray-500 font-bold mt-2">Código QR de la Propuesta</p>
            <p className="text-[9px] text-gray-400">Escanea con tu celular o tableta para iniciar Play Mode instantáneamente.</p>
          </div>

          {/* Social direct share channels */}
          <div className="space-y-2 flex flex-col justify-center">
            {/* Launch Client View */}
            <button 
              type="button" 
              onClick={onLaunchClientView}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-[#0EC4C4] hover:bg-teal-600 text-white py-3 px-4 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" /> Probar Vista Cliente (Demo)
            </button>

            {/* Whatsapp Direct action */}
            <a 
              href={waUrl}
              target="_blank" 
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-[#25D366] hover:bg-emerald-600 text-white py-3 px-4 rounded-lg shadow-sm transition-colors cursor-pointer text-center"
            >
              <MessageSquare className="w-4 h-4" /> Enviar por WhatsApp
            </a>

            {/* Email Direct Action */}
            <a 
              href={mailUrl}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg shadow-sm transition-colors cursor-pointer text-center"
            >
              <Mail className="w-4 h-4" /> Enviar por Email Corporativo
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          type="button" 
          onClick={onReset}
          className="text-xs font-bold text-gray-500 hover:text-[#0EC4C4] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Crear nueva especificación de proyecto
        </button>
      </div>
    </div>
  );
}
