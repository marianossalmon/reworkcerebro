import React, { useState } from 'react';
import { GebesaShell, ProyectistaSubView } from './components/GebesaShell';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('Ventas');
  const [proyectistaSubView, setProyectistaSubView] = useState<ProyectistaSubView>('projects');

  return (
    <GebesaShell
      currentView={currentView}
      onViewChange={setCurrentView}
      proyectistaSubView={proyectistaSubView}
      onProyectistaSubViewChange={setProyectistaSubView}
    />
  );
}
