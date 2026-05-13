// src/services/guardiasService.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('TU_URL', 'TU_KEY')

export const obtenerCandidatosParaPasiva = async (horarioDeseado) => {
  const { data, error } = await supabase
    .from('empleados')
    .select('*')
    .eq('activo', true)
    .neq('turno_ordinario', horarioDeseado)
    .or(`restriccion_horaria.is.null,restriccion_horaria.neq.${horarioDeseado}`)
    .order('conteo_mensual', { ascending: true });

  if (error) {
    console.error("Error al filtrar personal:", error);
    return [];
  }
  return data;
};