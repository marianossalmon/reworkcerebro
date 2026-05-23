import React, { useState } from 'react';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { ProyectistaView } from './views/ProyectistaView';
import { VentasView } from './views/VentasView';
import { DireccionView } from './views/DireccionView';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('Ventas');

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex flex-1 overflow-hidden w-full">
        {currentView !== 'Ventas' && <Sidebar currentView={currentView} />}
        
        {currentView === 'Proyectos' && <ProyectistaView />}
        {currentView === 'Ventas' && <VentasView />}
        {currentView === 'Direccion' && <DireccionView />}
      </div>
    </div>
  );
}
