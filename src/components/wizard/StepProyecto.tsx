import React, { useState, useEffect, useRef } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { ProyectoData } from '../../types/presentation';
import { Search, UserCheck, Mail, Phone, FileText, Landmark, RefreshCw, CheckCircle2, Image as ImageIcon, Upload } from 'lucide-react';

interface MockClientAccount {
  idCliente: string;
  nombreCliente: string;
  contactoNombre: string;
  contactoEmail: string;
  contactoTelefono: string;
  nombreProyecto: string;
  descripcion: string;
  montoEstimado?: string;
  logoClienteUrl?: string;
}

// Highly realistic client data already available inside the Gebesa ERP / CRM to avoid advisory re-work
const GEBESA_CRM_SUGGESTIONS: MockClientAccount[] = [
  {
    idCliente: 'CLI-0922',
    nombreCliente: 'Grupo Financiero BanBajío S.A.',
    contactoNombre: 'Lic. Lorena Alanís Cantú',
    contactoEmail: 'lalanis@banbajio.com.mx',
    contactoTelefono: '+52 477 710 4000',
    nombreProyecto: 'Especificación de Mobiliario Corporativo - Corporativo León R3',
    descripcion: 'Diseño integral de áreas abiertas con mesas de benching dinámico, oficinas directivas en chapa premium y salas de conferencias equipadas con sistemas de conectividad de última generación G-Connect.',
    montoEstimado: '$1,245,000 MXN',
    logoClienteUrl: 'https://images.unsplash.com/photo-1549813069-f913611d102d?q=80&w=256&auto=format&fit=crop'
  },
  {
    idCliente: 'CLI-8409',
    nombreCliente: 'TechLogix Global Solutions',
    contactoNombre: 'Ing. Alejandro Salazar Trejo',
    contactoEmail: 'a.salazar@techlogix.io',
    contactoTelefono: '+52 554 990 1289',
    nombreProyecto: 'Equipamiento de Oficinas Monterrey - Hub Innovación',
    descripcion: 'Suministro e instalación de mobiliario operativo funcional para 120 estaciones de trabajo. Incluye cajoneras pedestal elite, mamparas acústicas divisoras y sillería operativa ergonómica de alto desempeño.',
    montoEstimado: '$890,200 MXN'
  },
  {
    idCliente: 'CLI-5521',
    nombreCliente: 'Inmobiliaria Metrópoli',
    contactoNombre: 'Arq. Sofía Villaseñor Díaz',
    contactoEmail: 'sofia.v@metropoli.com.mx',
    contactoTelefono: '+52 331 450 8821',
    nombreProyecto: 'Mobiliario para Coworking Corporativo - Torre Centura GDL',
    descripcion: 'Espacios dinámicos híbridos utilizando mesas colectivas de altura ajustable, cabinas acústicas individuales para llamadas virtuales y zonas modulares de relajación activa (lounge areas) con acabados personalizados en roble claro.',
    montoEstimado: '$650,000 MXN'
  },
  {
    idCliente: 'CLI-1249',
    nombreCliente: 'Despacho Contable Robles y Asociados',
    contactoNombre: 'C.P. Bernardo Robles Cruz',
    contactoEmail: 'bernardo.robles@roblesasociados.mx',
    contactoTelefono: '+52 818 340 5001',
    nombreProyecto: 'Remodelación de Oficinas Ejecutivas - Despacho Monterrey',
    descripcion: 'Amueblado ejecutivo tradicional sobrio con escritorios tipo directivo Gebesa, archiveros metálicos de alta seguridad y sillería en piel de primera calidad.',
    montoEstimado: '$420,000 MXN'
  }
];

interface StepProyectoProps {
  onNext: () => void;
  onPrev: () => void;
}

export default function StepProyecto({ onNext, onPrev }: StepProyectoProps) {
  const { state, dispatch, saveToLocalStorage } = usePresentation();
  const { idCliente, nombreCliente, contactoNombre, contactoEmail, contactoTelefono, nombreProyecto, descripcion, montoEstimado, noAplica3D, logoClienteUrl } = state.proyecto;

  const [searchQuery, setSearchQuery] = useState(nombreCliente);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter recommendations based on input
  const suggestions = GEBESA_CRM_SUGGESTIONS.filter(item =>
    item.nombreCliente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Close suggestions if clicked outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = (field: keyof ProyectoData, value: string | boolean) => {
    dispatch({
      type: 'UPDATE_PROYECTO',
      payload: { [field]: value }
    });
    setHasUnsavedChanges(true);
  };

  const handleSelectClient = (client: MockClientAccount) => {
    dispatch({
      type: 'UPDATE_PROYECTO',
      payload: {
        idCliente: client.idCliente,
        nombreCliente: client.nombreCliente,
        contactoNombre: client.contactoNombre,
        contactoEmail: client.contactoEmail,
        contactoTelefono: client.contactoTelefono,
        nombreProyecto: client.nombreProyecto,
        descripcion: client.descripcion,
        montoEstimado: client.montoEstimado,
        logoClienteUrl: client.logoClienteUrl || ''
      }
    });
    setSearchQuery(client.nombreCliente);
    setShowSuggestions(false);
    setHasUnsavedChanges(true);
  };

  // Safe client-side autosave mechanism triggered when changes are pending (e.g. within 3 seconds of typing or explicit interval)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      saveToLocalStorage(state);
      setHasUnsavedChanges(false);
    }, 2000); // Trigger saving on typing pause (fast perceived feedback!)

    return () => clearTimeout(timer);
  }, [idCliente, nombreCliente, contactoNombre, contactoEmail, contactoTelefono, nombreProyecto, descripcion, montoEstimado, logoClienteUrl, hasUnsavedChanges]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-2">
      
      {/* Auto-save indicator bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-55 bg-white rounded-xl border border-gray-150 shadow-xs text-xs font-medium text-gray-500">
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
          📍 Identificador Cuenta: <strong className="text-gray-600 font-mono">{idCliente || 'PENDIENTE'}</strong>
        </span>
        <AutosaveIndicator isSaving={state.isSaving} lastSaved={state.lastSavedAt} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-teal-600" /> Registro y Vinculación de Cuenta CRM
        </h3>

        {/* CLiente Search (With autocompletion) */}
        <div className="space-y-1.5 relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-gray-650 flex items-center justify-between">
            <span>Nombre del Cliente / Empresa</span>
            <span className="text-[10px] text-teal-600 font-semibold bg-teal-50 px-1.5 py-0.2 rounded">Integración ERP Gebesa</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleUpdate('nombreCliente', e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full text-xs font-semibold pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0EC4C4] focus:ring-1 focus:ring-[#0EC4C4] bg-gray-50/50 hover:bg-white focus:bg-white outline-none transition-all" 
              placeholder="Escribe el nombre de la empresa para autocompletar..."
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-100% left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-50 max-h-56 overflow-y-auto animate-in slide-in-from-top-1 duration-155">
              <div className="bg-gray-50 px-3.5 py-1.5 text-[9px] font-bold text-gray-400 tracking-wider uppercase">Cuentas Disponibles en CRM</div>
              {suggestions.map((client) => (
                <button
                  key={client.idCliente}
                  type="button"
                  onClick={() => handleSelectClient(client)}
                  className="w-full text-left p-3.5 hover:bg-teal-50/30 transition-colors block text-xs cursor-pointer"
                >
                  <p className="font-bold text-gray-900 flex items-center justify-between">
                    <span>{client.nombreCliente}</span>
                    <span className="text-[9px] font-mono text-gray-450 bg-gray-100 px-1 py-0.2 rounded">{client.idCliente}</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">{client.nombreProyecto}</p>
                  <p className="text-[9.5px] text-teal-600 font-semibold mt-0.5">Contacto: {client.contactoNombre}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logo del Cliente Upload */}
        <div className="bg-teal-50/5 p-4 rounded-xl border border-dashed border-teal-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {logoClienteUrl ? (
              <div className="relative w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-1 shadow-3xs group shrink-0">
                <img src={logoClienteUrl} alt="Logo Cliente" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                <button 
                  type="button" 
                  onClick={() => handleUpdate('logoClienteUrl', '')}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black shadow-md cursor-pointer"
                  title="Eliminar logo"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center justify-center text-gray-400 text-[9px] font-bold shrink-0">
                <ImageIcon className="w-4 h-4 text-gray-300" />
                <span className="text-[7.5px] mt-0.5">SIN LOGO</span>
              </div>
            )}
            <div className="text-left">
              <p className="text-xs font-bold text-gray-800">Logo de la Empresa del Cliente</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Se mostrará al inicio de la presentación Play Mode.</p>
            </div>
          </div>
          <div>
            <label className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#0EC4C4] text-gray-700 hover:text-gray-950 font-bold text-[11px] py-2 px-3.5 rounded-xl shadow-3xs cursor-pointer flex items-center justify-center gap-1.5 transition-all text-center whitespace-nowrap">
              <Upload className="w-3.5 h-3.5 text-teal-500" />
              <span>Sube el logo del cliente</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        handleUpdate('logoClienteUrl', reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Contact Group */}
        <div className="bg-slate-50/40 p-4 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Contacto Nombre */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-teal-600" /> Atención / Contacto
            </label>
            <input 
              type="text" 
              value={contactoNombre} 
              onChange={(e) => handleUpdate('contactoNombre', e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-md border border-gray-200 focus:border-[#0EC4C4] focus:ring-1 focus:ring-[#0EC4C4] outline-none"
              placeholder="Representante de compras/proyectos"
            />
          </div>
          {/* Contacto Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
              <Mail className="w-3 h-3 text-teal-600" /> Correo Receptor
            </label>
            <input 
              type="email" 
              value={contactoEmail} 
              onChange={(e) => handleUpdate('contactoEmail', e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-md border border-gray-200 focus:border-[#0EC4C4] focus:ring-1 focus:ring-[#0EC4C4] outline-none"
              placeholder="cliente@dominio.com"
            />
          </div>
          {/* Contacto Telefono */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3 text-teal-600" /> Teléfono Directo
            </label>
            <input 
              type="text" 
              value={contactoTelefono} 
              onChange={(e) => handleUpdate('contactoTelefono', e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-md border border-gray-200 focus:border-[#0EC4C4] focus:ring-1 focus:ring-[#0EC4C4] outline-none"
              placeholder="+52 --- --- ----"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2 pt-2">
          <FileText className="w-4 h-4 text-teal-600" /> Descripción de la Propuesta / Presentación
        </h3>

        {/* Nombre del Proyecto */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-650">Nombre Corto del Proyecto</label>
          <input 
            type="text" 
            value={nombreProyecto} 
            onChange={(e) => handleUpdate('nombreProyecto', e.target.value)}
            className="w-full text-xs font-semibold px-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#0EC4C4] focus:ring-1 focus:ring-[#0EC4C4] bg-gray-50/50 hover:bg-white focus:bg-white outline-none transition-all" 
            placeholder="Ej: Amueblado Corporativo - corporativo Monterrey Norte"
          />
        </div>

        {/* Descripcion */}
        <div className="space-y-1.5 bg-white">
          <label className="text-xs font-semibold text-gray-650">Alcance de Especificación y Espacios</label>
          <textarea 
            value={descripcion} 
            onChange={(e) => handleUpdate('descripcion', e.target.value)}
            rows={4}
            className="w-full text-xs font-semibold px-3.5 py-3 rounded-lg border border-gray-200 focus:border-[#0EC4C4] focus:ring-1 focus:ring-[#0EC4C4] bg-gray-50/50 hover:bg-white focus:bg-white outline-none transition-all resize-none" 
            placeholder="Describe las áreas y líneas de mobiliario cotizadas (Synergy, G-Connect, etc.) para que se visualicen como introducción narrativa..."
          />
        </div>

        {/* Monto Estimado */}
        {montoEstimado && (
          <div className="bg-teal-55 bg-teal-50/20 p-3 rounded-xl border border-teal-100 flex items-center justify-between text-xs text-teal-800">
            <span>Presupuesto Comercial Referenciado:</span>
            <strong className="font-bold text-teal-900 text-sm font-mono">{montoEstimado}</strong>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button 
          type="button" 
          onClick={onPrev}
          className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-xs py-3.5 px-6 rounded-xl transition-all cursor-pointer"
        >
          ← Regresar al Paso 1
        </button>
        <button 
          type="button" 
          onClick={onNext}
          disabled={!nombreCliente || !nombreProyecto}
          className={`font-bold text-xs py-3.5 px-8 rounded-xl tracking-wider uppercase transition-all duration-250 cursor-pointer ${
            nombreCliente && nombreProyecto
              ? 'bg-[#0EC4C4] hover:bg-teal-600 text-white shadow-lg shadow-teal-500/10 active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Siguiente: Subir Entregables →
        </button>
      </div>
    </div>
  );
}

// Autosave feedback indicator element
function AutosaveIndicator({ isSaving, lastSaved }: { isSaving: boolean; lastSaved: string | null }) {
  if (isSaving) {
    return (
      <span className="flex items-center gap-1.5 text-[11px] text-[#0EC4C4] font-semibold animate-pulse">
        <RefreshCw className="w-3 h-3 animate-spin text-[#0EC4C4]" /> Guardando borrador...
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Borrador guardado localmente {lastSaved ? `a las ${lastSaved}` : ''}
    </span>
  );
}
