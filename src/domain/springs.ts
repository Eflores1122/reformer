import type { Configuration, Machine } from './schema';

export function validateConfiguration(machine: Machine | undefined, config: Configuration | null): string[] {
  if (!machine) return ['Registra y selecciona tu Reformer.'];
  if (!machine.inventoryConfirmed) return ['Confirma el inventario físico de tu equipo.'];
  if (!config || config.machineId !== machine.id) return ['Falta la configuración específica para esta máquina.'];
  const errors: string[] = [];
  if (config.machineRevision !== machine.revision) errors.push('El equipo cambió. Vuelve a confirmar los ajustes de este ejercicio.');
  let count = 0;
  for (const [id, quantity] of Object.entries(config.springs)) {
    const spring = machine.springs.find(s => s.id === id);
    if (!Number.isInteger(quantity) || quantity < 0) errors.push('Cantidad de resortes inválida.');
    if (!spring && quantity > 0) errors.push('Un resorte no pertenece a esta máquina.');
    if (spring && quantity > spring.count) errors.push(`${spring.label}: solicitas ${quantity}, tienes ${spring.count}.`);
    count += quantity;
  }
  if (count < 1) errors.push('No se permite entrenar con el carro sin resortes en esta versión.');
  if (!config.confirmed) errors.push('Revisa esta configuración con tu instructor y confírmala.');
  if (!config.footbar.trim() || !config.headrest.trim() || !config.anchor.trim()) errors.push('Indica barra de pies, cabecera y anclaje.');
  return errors;
}
export function springLabel(machine: Machine | undefined, config: Configuration | null): string {
  if (!machine || !config || machine.id !== config.machineId) return 'Por configurar';
  const labels = machine.springs.filter(s => (config.springs[s.id] || 0) > 0).map(s => `${config.springs[s.id]} ${s.label.toLowerCase()}`);
  return labels.length ? labels.join(' + ') : 'Sin resortes';
}
export function springDifference(machine: Machine, from: Configuration | null, to: Configuration): string[] {
  if (!from || from.machineId !== machine.id || to.machineId !== machine.id) return [];
  return machine.springs.flatMap(s => {
    const difference = (to.springs[s.id] || 0) - (from.springs[s.id] || 0);
    return difference ? [`${s.label}: ${difference > 0 ? '+' : ''}${difference}`] : [];
  });
}
// This estimates spring tension, never the effective force received by the person.
// Physical inputs must come from a model-specific documented measurement.
export function springTensionN(machine: Machine, config: Configuration, elongationM: number): number | null {
  if (config.machineId !== machine.id || !Number.isFinite(elongationM) || elongationM < 0 || validateConfiguration(machine, config).length) return null;
  let sum = 0;
  for (const s of machine.springs) {
    const quantity = config.springs[s.id] || 0;
    if (!quantity) continue;
    if (s.initialN === null || s.stiffnessNm === null) return null;
    sum += quantity * (s.initialN + s.stiffnessNm * elongationM);
  }
  return sum;
}
