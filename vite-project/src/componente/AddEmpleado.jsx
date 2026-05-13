import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const AddEmpleado = ({ onAdded }) => {
  const initialForm = { 
    nombre: '', 
    apellido: '', 
    legajo: '', 
    turno_ordinario: '7-14', 
    restriccion_horaria: '' 
  };

  const [formData, setFormData] = useState(initialForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('empleados').insert([formData]);
    
    if (!error) {
      alert("¡Empleado cargado con éxito!");
      setFormData(initialForm); // Esto limpia los campos automáticamente
      onAdded(); 
    } else {
      console.error("Error de Supabase:", error.message);
      alert("Hubo un error al cargar: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
        <input 
          value={formData.nombre}
          placeholder="Ej: Juan" 
          onChange={e => setFormData({...formData, nombre: e.target.value})} 
          required 
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 uppercase">Apellido</label>
        <input 
          value={formData.apellido}
          placeholder="Ej: Pérez" 
          onChange={e => setFormData({...formData, apellido: e.target.value})} 
          required 
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 uppercase">Legajo Personal</label>
        <input 
          value={formData.legajo}
          placeholder="Ej: 929" 
          onChange={e => setFormData({...formData, legajo: e.target.value})} 
          required 
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 uppercase">Turno Habitual</label>
        <select 
          value={formData.turno_ordinario}
          onChange={e => setFormData({...formData, turno_ordinario: e.target.value})} 
          className="border rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="7-14">Mañana (7-14 hs)</option>
          <option value="14-21">Tarde (14-21 hs)</option>
          <option value="21-07">Noche (21-07 hs)</option>
        </select>
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Restricción por Estudio u otro</label>
        <select 
          value={formData.restriccion_horaria}
          onChange={e => setFormData({...formData, restriccion_horaria: e.target.value})} 
          className="border rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Ninguna - Disponible para cualquier sorteo</option>
          <option value="7-14">No puede Mañana (7-14 hs)</option>
          <option value="14-21">No puede Tarde (14-21 hs)</option>
          <option value="21-07">No puede Noche (21-07 hs)</option>
        </select>
        <small className="text-gray-400 italic text-[11px]">
          * El sistema excluirá automáticamente a esta persona si el sorteo cae en este horario.
        </small>
      </div>

      <button 
        type="submit" 
        className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition-colors mt-2"
      >
        Guardar Empleado en Base de Datos
      </button>
    </form>
  );
};

export default AddEmpleado;