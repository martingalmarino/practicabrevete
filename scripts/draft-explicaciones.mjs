#!/usr/bin/env node
/**
 * Genera borradores de explicación (40–80 palabras) marcados como "revisar".
 * No publica automáticamente. Uso: npm run data:explicaciones -- a-i
 *
 * Para un subconjunto curado, pasa --publish-ids=a-i-001,a-i-002
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** Explicaciones revisadas a mano (base legal verificable a alto nivel). */
const CURATED = {
  'a-i-001': {
    texto:
      'En la vía solo puedes recoger o dejar pasajeros en los lugares autorizados. Hacerlo en cualquier punto, dejar animales que obstaculicen el tránsito o ejercer comercio ambulatorio en la calzada está prohibido porque pone en riesgo a peatones y conductores. La regla busca ordenar el uso de la vía y evitar detenciones imprevistas.',
    baseLegal: 'D.S. 016-2009-MTC (Reglamento Nacional de Tránsito) — normas sobre uso de la vía; TODO: precisar artículo exacto',
    status: 'revisada',
    publish: true,
  },
  'a-i-002': {
    texto:
      'Los dispositivos de control del tránsito obligan tanto a conductores como a peatones. La única excepción es cuando un efectivo de la Policía Nacional asignado al tránsito indica otra conducta: en ese caso prevalece su instrucción. No basta con que solo un grupo obedezca las señales o semáforos.',
    baseLegal: 'D.S. 016-2009-MTC — obediencia a dispositivos de control y a la autoridad de tránsito; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
  'a-i-003': {
    texto:
      'La señal reglamentaria R-6 prohíbe girar a la izquierda. Esa restricción también impide el giro en U en el mismo punto, porque el giro en U implica un giro a la izquierda. Debes continuar de frente o girar solo donde esté permitido. Identificar el código de la señal ayuda a no confundirla con otras prohibiciones.',
    baseLegal: 'Manual de Dispositivos de Control del Tránsito Automotor / señales reglamentarias R-6; D.S. 016-2009-MTC',
    status: 'revisada',
    publish: true,
  },
  'a-i-004': {
    texto:
      'La señal vertical reglamentaria R-3 indica sentido obligatorio de circulación hacia adelante: el único desplazamiento permitido es continuar de frente. No señala zonas restringidas ni autoriza adelantar. Ante esta señal debes mantener el carril y el sentido indicado, sin giros laterales.',
    baseLegal: 'Manual de Dispositivos de Control del Tránsito Automotor — señal R-3; D.S. 016-2009-MTC',
    status: 'revisada',
    publish: true,
  },
  'a-i-005': {
    texto:
      'La línea central discontinua de color amarillo separa sentidos opuestos y permite cruzar al otro carril para adelantar solo si es seguro y no hay otra prohibición. No es un cruce peatonal ni indica reducción de calzada. Antes de adelantar verifica visibilidad, velocidad y vehículos en sentido contrario.',
    baseLegal: 'Manual de Dispositivos de Control del Tránsito — marcas viales; D.S. 016-2009-MTC',
    status: 'revisada',
    publish: true,
  },
  'a-i-006': {
    texto:
      'El ámbar o amarillo del semáforo advierte que el derecho de paso está por terminar. Debes detenerte antes de la intersección si tu velocidad y ubicación lo permiten; si ya no es seguro frenar, cruza y despeja la intersección. No aceleres para “ganar” el amarillo.',
    baseLegal: 'D.S. 016-2009-MTC — significado de las luces del semáforo; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
  'a-i-007': {
    texto:
      'En el semáforo, el rojo ordena detención, el ámbar o amarillo indica prevención y el verde autoriza el paso cuando la vía está despejada. Memorizar “detención – prevención – paso” evita confusiones con significados inventados como circular más rápido en verde.',
    baseLegal: 'D.S. 016-2009-MTC — semáforos; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
  'a-i-008': {
    texto:
      'Una flecha verde en el semáforo permite continuar con precaución solo en la dirección que indica y desde el carril que controla. No autoriza otros giros ni sustituye a una luz circular en conflicto. Antes de avanzar verifica peatones y vehículos que puedan cruzar tu trayectoria.',
    baseLegal: 'D.S. 016-2009-MTC — semáforos con flechas; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
  'a-i-010': {
    texto:
      'Si ves una flecha roja a la izquierda junto con la luz circular verde, puedes avanzar en los sentidos permitidos por el verde, pero el giro a la izquierda está prohibido por la flecha roja. La flecha direccional prevalece sobre ese movimiento concreto. No interprets el verde circular como autorización de todos los giros.',
    baseLegal: 'D.S. 016-2009-MTC — semáforos con flechas; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
  'a-i-011': {
    texto:
      'Una luz ámbar intermitente te otorga preferencia relativa: reduce la velocidad y continúa con precaución, sin asumir que los demás se detendrán. No equivale a un PARE ni a un CEDA EL PASO de forma automática. Evalúa peatones y vehículos antes de cruzar la intersección.',
    baseLegal: 'D.S. 016-2009-MTC — luces intermitentes del semáforo; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
  'a-i-012': {
    texto:
      'La luz roja intermitente se comporta como una señal de PARE: debes detenerte por completo y solo continuar cuando sea seguro y te corresponda el paso. No necesitas que un policía confirme la orden. Esta equivalencia evita confusiones en intersecciones con semáforo en modo intermitente.',
    baseLegal: 'D.S. 016-2009-MTC — luz roja intermitente equivalente a PARE; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
  'a-i-015': {
    texto:
      'En un cruce a nivel con vía férrea, los vehículos que circulan por la vía férrea tienen preferencia sobre los que cruzan esa línea. Debes detenerte si hay tren o señales activas y nunca intentar “ganar” el cruce. La masa y la distancia de frenado de un tren hacen imposible una maniobra de último segundo.',
    baseLegal: 'D.S. 016-2009-MTC — cruces con vías férreas; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
  'a-i-020': {
    texto:
      'Si otro vehículo te alcanza para adelantarte, no aumentes la velocidad hasta que complete el sobrepaso. Facilitar el adelantamiento seguro reduce el tiempo de exposición en sentido contrario. Frenar de golpe o acelerar para impedir el paso genera riesgo de choque y está desaconsejado por la norma de circulación.',
    baseLegal: 'D.S. 016-2009-MTC — adelantamiento; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
  'a-i-025': {
    texto:
      'Debes ceder el paso a un vehículo de emergencia u oficial cuando emita señales audibles y visibles a la vez (sirena y luces). Solo una de las dos no basta según el criterio del balotario. Facilita el paso sin maniobras bruscas y reanuda la marcha cuando sea seguro.',
    baseLegal: 'D.S. 016-2009-MTC — preferencia de vehículos de emergencia; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
  'a-i-030': {
    texto:
      'En intersecciones sin PARE, CEDA EL PASO ni semáforo, las vías de doble sentido tienen prioridad respecto de las de un solo sentido de igual clasificación. Conocer esta regla evita discusiones en cruces no señalizados. Aun con prioridad, reduce la velocidad y verifica que el otro conductor te ceda el paso.',
    baseLegal: 'D.S. 016-2009-MTC — prioridad en intersecciones no señalizadas; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
  'a-i-040': {
    texto:
      'Durante la conducción debes portar y exhibir, si te lo piden, tu documento de identidad, el SOAT vigente (también puede ser virtual) y la tarjeta de identificación vehicular. Otros papeles pueden ser útiles, pero no sustituyen este conjunto mínimo del balotario. Circular sin ellos expone a sanciones y al inmovilización del vehículo.',
    baseLegal: 'D.S. 016-2009-MTC — documentos obligatorios al conducir; TODO: precisar artículo',
    status: 'revisada',
    publish: true,
  },
};

function draftFor(q) {
  const correcta = q.opciones[q.correcta] || '';
  const texto =
    `La respuesta correcta es: «${correcta}». ` +
    `Esta pregunta del balotario de clase A categoría I evalúa ${q.tema.replace(/-/g, ' ')}. ` +
    `Revisa el enunciado con calma y descarta las opciones que contradigan el Reglamento Nacional de Tránsito. ` +
    `TODO: redactar explicación propia de 40 a 80 palabras citando el artículo exacto tras validación humana.`;
  return {
    texto,
    status: 'revisar',
    baseLegal: q.explicacion?.baseLegal || 'TODO: verificar artículo del Reglamento Nacional de Tránsito',
  };
}

function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

async function main() {
  const id = process.argv[2] || 'a-i';
  const path = join(root, 'src', 'data', 'preguntas', `${id}.json`);
  const questions = JSON.parse(await readFile(path, 'utf8'));

  let curated = 0;
  let drafted = 0;

  for (const q of questions) {
    const c = CURATED[q.id];
    if (c) {
      q.explicacion = {
        texto: c.texto,
        status: c.status,
        baseLegal: c.baseLegal,
      };
      q.publish = Boolean(c.publish && c.status === 'revisada');
      q.updatedAt = new Date().toISOString().slice(0, 10);
      curated++;
      const wc = wordCount(c.texto);
      if (wc < 40 || wc > 80) {
        console.warn(`Aviso ${q.id}: ${wc} palabras (objetivo 40–80)`);
      }
    } else if (!q.explicacion?.texto) {
      q.explicacion = draftFor(q);
      q.publish = false;
      drafted++;
    }
  }

  await writeFile(path, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  console.log(`Curadas: ${curated}; borradores nuevos: ${drafted}; total: ${questions.length}`);
  console.log(`Publicables (publish=true): ${questions.filter((q) => q.publish).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
