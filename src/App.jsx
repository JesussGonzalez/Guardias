import React, { useState } from 'react';
import AddEmpleado from './componente/AddEmpleado';
import PersonalList from './componente/PersonalList';
import GeneradorGuardias from './componente/GeneradorGuardias';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [pestana, setPestana] = useState('sorteo'); // Estado para controlar qué vemos

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* HEADER */}
      <header className="bg-blue-900 text-white p-6 shadow-lg mb-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Gestión de Enfermería</h1>
          <p className="opacity-80 text-sm">Hospital - Sistema de Guardias Pasivas</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* BOTONES DE NAVEGACIÓN */}
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <button 
            onClick={() => setPestana('sorteo')}
            className={`flex-1 py-3 rounded-md font-medium transition ${pestana === 'sorteo' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            🎲 Realizar Sorteo
          </button>
          <button 
            onClick={() => setPestana('lista')}
            className={`flex-1 py-3 rounded-md font-medium transition ${pestana === 'lista' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            📋 Ver Personal
          </button>
          <button 
            onClick={() => setPestana('nuevo')}
            className={`flex-1 py-3 rounded-md font-medium transition ${pestana === 'nuevo' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            ➕ Cargar Nuevo
          </button>
        </div>

        {/* CONTENIDO DINÁMICO */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {pestana === 'sorteo' && (
            <div className="p-6">
              <GeneradorGuardias />
            </div>
          )}

          {pestana === 'lista' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Nómina Actual</h2>
              <PersonalList key={refreshKey} />
            </div>
          )}

          {pestana === 'nuevo' && (
            <div className="p-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Registrar Nuevo Personal</h2>
              <AddEmpleado onAdded={() => { handleRefresh(); setPestana('lista'); }} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;