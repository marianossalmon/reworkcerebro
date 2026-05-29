import React from 'react';
import { Check } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  noAplica3D: boolean;
  archivosUploaded: number;
}

export default function WizardProgress({ currentStep, onSetStep, noAplica3D, archivosUploaded }: WizardProgressProps) {
  const steps = [
    { title: 'Perfil Asesor', desc: 'Datos del ejecutivo' },
    { title: 'Información Cliente', desc: 'Proyecto y Cuenta' },
    { title: 'Entregables Gráficos', desc: noAplica3D ? 'Renders y Planos (3D omitido)' : 'Renders, Planos y 3D' },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100 py-6 px-8 select-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between relative">
        {/* Progress Line Connector */}
        <div className="absolute top-5 left-[10%] right-[10%] h-[3px] bg-gray-100 -z-0">
          <div 
            className="h-full bg-gradient-to-r from-teal-400 to-[#0EC4C4] transition-all duration-500 ease-out"
            style={{ width: `${currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'}` }}
          />
        </div>

        {steps.map((s, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          const isPending = currentStep < stepNum;

          return (
            <div 
              key={idx} 
              className="flex flex-col items-center relative z-10 cursor-pointer group"
              onClick={() => {
                // Allow back and forward navigation
                if (stepNum <= currentStep || isCompleted) {
                  onSetStep(stepNum);
                }
              }}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100 scale-105' 
                    : isActive 
                    ? 'bg-[#0EC4C4] text-white shadow-lg shadow-teal-100 ring-4 ring-teal-50 scale-105' 
                    : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              
              <div className="text-center mt-3">
                <p 
                  className={`text-[13.5px] font-semibold transition-colors duration-200 ${
                    isActive ? 'text-gray-900' : isCompleted ? 'text-emerald-600' : 'text-gray-500 group-hover:text-gray-800'
                  }`}
                >
                  {s.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium block">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
