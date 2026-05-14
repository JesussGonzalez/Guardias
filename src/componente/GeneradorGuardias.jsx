import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const GeneradorGuardias = () => {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [resultado, setResultado] = useState([]);
  const [cargando, setCargando] = useState(false);

  const generarMesCompleto = async () => {
  setCargando(true);
  
  const { data: personal, error } = await supabase
    .from('empleados')
    .select('*')
    .eq('activo', false); // Cambiamos 'actvio' por 'activo' y true por false

  if (error || !personal || personal.length === 0) {
    console.error("Error de Supabase:", error);
    alert("Error: No se encontró personal disponible.");
    setCargando(false);
    return;
  }

  const diasEnMes = new Date(anio, mes, 0).getDate();
  const sorteoMensual = [];
  let pendientesDeGuardia = [...personal];
  
  const elegirCandidato = (turnoActual, excluidosEnDia = []) => {
    // FILTRO CLAVE: 
    // 1. No debe tener ese turno como 'ordinario' (ya está trabajando)
    // 2. No debe tener una 'restriccion_horaria' manual en ese turno
    // 3. No debe haber sido sorteado ya en otro turno el mismo día
    let candidatosPosibles = personal.filter(p => 
      p.turno_ordinario !== turnoActual && 
      p.restriccion_horaria !== turnoActual && 
      !excluidosEnDia.includes(p.id)
    );

    // Prioridad por equidad (gente que aún no hizo guardias)
    let prioridad = candidatosPosibles.filter(p => 
      pendientesDeGuardia.some(pend => pend.id === p.id)
    );

    let pool = prioridad.length > 0 ? prioridad : candidatosPosibles;
    
    // Si el pool sigue vacío, buscamos cualquier persona que no esté en el mismo día
    if (pool.length === 0) {
      pool = personal.filter(p => !excluidosEnDia.includes(p.id));
    }

    if (pool.length === 0) return { texto: 'SIN PERSONAL', lp: '-' };

    const seleccionado = pool[Math.floor(Math.random() * pool.length)];
    
    // Actualizar lista de pendientes para la siguiente vuelta
    pendientesDeGuardia = pendientesDeGuardia.filter(p => p.id !== seleccionado.id);
    if (pendientesDeGuardia.length === 0) pendientesDeGuardia = [...personal]; 
    
    return {
      id: seleccionado.id,
      texto: `${seleccionado.apellido} ${seleccionado.nombre}`,
      lp: seleccionado.legajo
    };
  };

  for (let dia = 1; dia <= diasEnMes; dia++) {
    let idsEnDia = [];
    const m = elegirCandidato('7-14', idsEnDia);
    if (m.id) idsEnDia.push(m.id);
    const t = elegirCandidato('14-21', idsEnDia);
    if (t.id) idsEnDia.push(t.id);
    const n = elegirCandidato('21-07', idsEnDia);

    sorteoMensual.push({ dia, mañana: m, tarde: t, noche: n });
  }

  setResultado(sorteoMensual);
  setCargando(false);
};

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4 bg-white p-4 rounded-lg border shadow-sm print:hidden">
        <div className="flex-1">
          <label className="block text-xs font-bold mb-1 uppercase text-gray-500">Periodo de Sorteo</label>
          <div className="flex gap-2">
            <select value={mes} onChange={e => setMes(e.target.value)} className="border p-2 rounded w-full">
              {/* Opciones de meses */}
              {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m, i) => (
                <option key={i+1} value={i+1}>{m}</option>
              ))}
            </select>
            <input type="number" value={anio} onChange={e => setAnio(e.target.value)} className="border p-2 rounded w-24" />
          </div>
        </div>
        <button onClick={generarMesCompleto} disabled={cargando} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">
          {cargando ? 'Procesando...' : '🎲 Generar Mes'}
        </button>
      </div>

      {resultado.length > 0 && (
        <div className="bg-white border rounded-lg shadow-xl overflow-hidden">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white uppercase">
                <th className="border p-2 w-10">Día</th>
                <th className="border p-2">Mañana (07-14)</th>
                <th className="border p-2">Tarde (14-21)</th>
                <th className="border p-2">Noche (21-07)</th>
              </tr>
            </thead>
            <tbody>
              {resultado.map((r) => (
                <tr key={r.dia} className="hover:bg-gray-50 border-b">
                  <td className="border p-2 text-center font-bold bg-gray-100">{r.dia}</td>
                  <td className="border p-2">
                    <div className="font-bold">{r.mañana.texto}</div>
                    <div className="text-[10px] text-gray-500">LP: {r.mañana.lp}</div>
                  </td>
                  <td className="border p-2">
                    <div className="font-bold">{r.tarde.texto}</div>
                    <div className="text-[10px] text-gray-500">LP: {r.tarde.lp}</div>
                  </td>
                  <td className="border p-2">
                    <div className="font-bold">{r.noche.texto}</div>
                    <div className="text-[10px] text-gray-500">LP: {r.noche.lp}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 print:hidden bg-gray-50">
            <button onClick={() => window.print()} className="w-full bg-gray-800 text-white py-2 rounded">
              🖨️ Imprimir Planilla Mensual
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneradorGuardias;