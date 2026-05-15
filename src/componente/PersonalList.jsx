import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const PersonalList = () => {
  const [personal, setPersonal] = useState([]);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");

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
    const datosAActualizar = {};
    for (const key in campos) {
      if (campos[key] !== undefined) {
        datosAActualizar[key] = campos[key];
      }
    }

    const { error } = await supabase
      .from('empleados')
      .update(datosAActualizar)
      .eq('id', id);
    
    if (error) {
      console.error("Error:", error.message);
      alert("Error al actualizar");
    } else {
      setEditando(null);
      fetchPersonal();
    }
  };

  const personalFiltrado = personal.filter(p => {
    const nombreCompleto = `${p.apellido} ${p.nombre} ${p.legajo}`.toLowerCase();
    return nombreCompleto.includes(busqueda.toLowerCase());
  });

  return (
    <div className="space-y-4 p-4">
      {/* Buscador Optimizado */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar por apellido, nombre o legajo..."
          className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all shadow-sm"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="w-full border-collapse bg-white text-sm">
          <thead>
            <tr className="bg-gray-800 text-white text-left text-xs uppercase">
              <th className="p-3">Personal / LP</th>
              <th className="p-3 text-center">Turno Ordinario</th>
              <th className="p-3">Restricción Horaria</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personalFiltrado.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-gray-800 uppercase">{p.apellido}, {p.nombre}</div>
                  <div className="text-xs text-blue-600 font-mono">LP: {p.legajo}</div>
                </td>

                {/* NUEVA COLUMNA: TURNO ORDINARIO */}
                <td className="p-3 text-center">
                  {editando === p.id ? (
                    <select 
                      className="border-2 border-blue-400 p-1 rounded bg-blue-50 w-full"
                      defaultValue={p.turno_ordinario || ""}
                      onChange={(e) => actualizarEmpleado(p.id, { turno_ordinario: e.target.value })}
                    >
                      <option value="">Sin Turno</option>
                      <option value="Mañana">Mañana</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Noche">Noche</option>
                      <option value="Franquero">Franquero</option>
                    </select>
                  ) : (
                    <span className="font-semibold text-gray-700">
                      {p.turno_ordinario || "---"}
                    </span>
                  )}
                </td>

                <td className="p-3">
                  {editando === p.id ? (
                    <select 
                      className="border-2 border-blue-400 p-1 rounded bg-blue-50 w-full"
                      defaultValue={p.restriccion_horaria || ""}
                      onChange={(e) => actualizarEmpleado(p.id, { restriccion_horaria: e.target.value })}
                    >
                      <option value="">Sin Restricción</option>
                      <option value="7-14">No Mañana (7-14 hs)</option>
                      <option value="14-21">No Tarde (14-21 hs)</option>
                      <option value="21-07">No Noche (21-07 hs)</option>
                    </select>
                  ) : (
                    <div className={`flex items-center gap-2 ${p.restriccion_horaria ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
                      {p.restriccion_horaria ? <>⚠️ {p.restriccion_horaria}</> : <>✔️ Libre</>}
                    </div>
                  )}
                </td>
                
                <td className="p-3 text-center">
                  <button 
                    onClick={() => actualizarEmpleado(p.id, { activo: !p.activo })}
                    className={`w-28 py-1.5 rounded-lg font-bold text-[10px] shadow-sm transition-all ${
                      p.activo 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {p.activo ? '🚫 LICENCIA' : '✅ ACTIVO'}
                  </button>
                </td>

                <td className="p-3 text-center">
                  <button 
                    onClick={() => setEditando(editando === p.id ? null : p.id)}
                    className={`px-3 py-1 rounded border text-[10px] font-bold transition ${
                      editando === p.id 
                        ? 'bg-gray-200 text-gray-700' 
                        : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {editando === p.id ? 'CANCELAR' : 'EDITAR'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {personalFiltrado.length === 0 && (
          <div className="p-10 text-center text-gray-400 italic bg-white">
            {busqueda ? `No se encontraron resultados para "${busqueda}"` : "No hay personal cargado."}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalList;