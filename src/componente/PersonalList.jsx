import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const PersonalList = () => {
  const [personal, setPersonal] = useState([]);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    fetchPersonal();
  }, []);

  const fetchPersonal = async () => {
    const { data } = await supabase
      .from('empleados')
      .select('*')
      .order('apellido', { ascending: true });
    setPersonal(data || []);
  };

  const actualizarEmpleado = async (id, campos) => {
  // Limpiamos los campos para no enviar valores undefined
  const datosAActualizar = {};
  for (const key in campos) {
    if (campos[key] !== undefined) {
      datosAActualizar[key] = campos[key];
    }
  }

  const { error } = await supabase
    .from('empleados')
    .update(datosAActualizar)
    .eq('id', id); // Verificá que en tu tabla la columna se llame 'id'
  
  if (error) {
    console.error("Error detallado:", error.message);
    alert("Error al actualizar: " + error.message);
  } else {
    setEditando(null);
    fetchPersonal();
  }
};

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-800 text-white text-left text-xs uppercase">
            <th className="p-3 border border-gray-700">Apellido y Nombre / LP</th>
            <th className="p-3 border border-gray-700 text-center">Estado de Licencia</th>
            <th className="p-3 border border-gray-700">Restricción Horaria</th>
            <th className="p-3 border border-gray-700 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personal.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
              {/* DATOS PERSONALES */}
              <td className="p-3">
                <div className="font-bold text-gray-800 uppercase">{p.apellido}, {p.nombre}</div>
                <div className="text-xs text-blue-600 font-mono">LP: {p.legajo}</div>
              </td>
              
              {/* BOTÓN DE LICENCIA (EL QUE TE FALTABA) */}
              <td className="p-3 text-center">
                <button 
                  onClick={() => actualizarEmpleado(p.id, { activo: !p.activo })}
                  className={`w-32 py-2 rounded-lg font-bold text-xs shadow-sm transition-all ${
                    p.activo 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {p.activo ? '🚫 DE LICENCIA' : '✅ ACTIVO'}
                </button>
              </td>

              {/* COLUMNA DE RESTRICCIÓN */}
              <td className="p-3">
                {editando === p.id ? (
                  <select 
                    autoFocus
                    className="border-2 border-blue-400 p-1 text-sm rounded w-full bg-blue-50"
                    defaultValue={p.restriccion_horaria || ""}
                    onChange={(e) => actualizarEmpleado(p.id, { restriccion_horaria: e.target.value })}
                  >
                    <option value="">Disponible (Sin Restricción)</option>
                    <option value="7-14">No Mañana (7-14 hs)</option>
                    <option value="14-21">No Tarde (14-21 hs)</option>
                    <option value="21-07">No Noche (21-07 hs)</option>
                  </select>
                ) : (
                  <div className={`text-sm flex items-center gap-2 ${p.restriccion_horaria ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
                    {p.restriccion_horaria ? (
                      <><span>⚠️</span> No puede {p.restriccion_horaria}</>
                    ) : (
                      <><span>✔️</span> Sin restricciones</>
                    )}
                  </div>
                )}
              </td>

              {/* BOTÓN PARA MODIFICAR LA RESTRICCIÓN */}
              <td className="p-3 text-center">
                <button 
                  onClick={() => setEditando(editando === p.id ? null : p.id)}
                  className={`px-4 py-1 rounded border text-xs font-bold transition ${
                    editando === p.id 
                      ? 'bg-gray-200 text-gray-700 border-gray-300' 
                      : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {editando === p.id ? 'CANCELAR' : 'CAMBIAR HORARIO'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {personal.length === 0 && (
        <div className="p-10 text-center text-gray-400 italic">
          No hay personal cargado todavía.
        </div>
      )}
    </div>
  );
};

export default PersonalList;