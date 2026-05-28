import type { ExerciseKey } from '../types';

export type SpanishExerciseCopy = {
  rationale: string;
  formCues: string[];
  commonMistakes: string[];
};

export const genericSpanishExerciseCopy: Record<ExerciseKey, SpanishExerciseCopy> = {
  'barbell-bench-press': {
    rationale: 'Movimiento base para desarrollar fuerza y masa en el tren superior. Permite aplicar sobrecarga progresiva de forma medible mientras entrena pectorales, tríceps y deltoides anteriores con alta transferencia a otros empujes.',
    formCues: ['Retráe y deprime las escápulas antes de sacar la barra.', 'Mantén muñeca, codo y barra alineados durante todo el recorrido.', 'Toca el pecho con control y empuja la barra ligeramente hacia atrás, no vertical pura.'],
    commonMistakes: ['Rebotar la barra en el pecho para completar repeticiones.', 'Perder tensión escapular y dejar que los hombros se adelanten.'],
  },
  'incline-dumbbell-press': {
    rationale: 'Excelente para enfatizar la porción superior del pectoral y mejorar simetrías entre lados. Las mancuernas permiten un recorrido más natural y una contracción más libre que la barra.',
    formCues: ['Usa un banco a 30–45° para mantener el foco en pectoral superior.', 'Baja las mancuernas hacia los lados del pecho alto con control.', 'Presiona sin chocar las mancuernas arriba; busca tensión continua.'],
    commonMistakes: ['Inclinar demasiado el banco y convertirlo en press de hombro.', 'Bajar sin control y perder estabilidad escapular.'],
  },
  'cable-crossover': {
    rationale: 'Aislamiento útil para añadir volumen de calidad al pectoral con tensión constante. Es especialmente valioso al final de la sesión para acumular estímulo sin cargar tanto articulaciones.',
    formCues: ['Inclínate levemente hacia delante y fija el torso.', 'Lleva los brazos en arco, no como un press.', 'Cruza ligeramente la línea media y pausa la contracción.'],
    commonMistakes: ['Usar demasiado peso y balancear el cuerpo.', 'Doblar y estirar los codos como si fuera una extensión de tríceps.'],
  },
  'barbell-overhead-press': {
    rationale: 'Press vertical fundamental para fuerza de hombros, tríceps y estabilidad del core. Bien ejecutado construye hombros fuertes y mejora la capacidad de producir fuerza por encima de la cabeza.',
    formCues: ['Aprieta glúteos y abdomen antes de iniciar cada repetición.', 'Mueve la cabeza hacia atrás solo lo necesario para que pase la barra.', 'Termina con la barra sobre la línea media del pie y bíceps cerca de las orejas.'],
    commonMistakes: ['Arquear la zona lumbar para compensar falta de movilidad.', 'Empujar la barra hacia delante y perder la línea vertical.'],
  },
  'cable-triceps-pushdown': {
    rationale: 'Aislamiento directo de tríceps con tensión constante. Es ideal para acumular volumen sin fatigar tanto hombros o pecho después de los presses principales.',
    formCues: ['Fija los codos junto al torso durante toda la serie.', 'Extiende por completo sin dejar que los hombros roten hacia delante.', 'Controla la subida hasta sentir estiramiento en el tríceps.'],
    commonMistakes: ['Convertirlo en un empuje de hombros usando el torso.', 'Usar impulso y perder la contracción final.'],
  },
  'barbell-bent-over-row': {
    rationale: 'Remo pesado para construir espalda densa y fuerte. Refuerza dorsales, romboides, trapecio medio y erectores, además de mejorar la estabilidad necesaria para peso muerto y presses.',
    formCues: ['Haz bisagra de cadera y mantén la columna neutra.', 'Lleva la barra hacia abdomen alto o esternón bajo según tu ángulo.', 'Tira con los codos, no con las manos.'],
    commonMistakes: ['Enderezar el torso en cada repetición para ayudar con impulso.', 'Redondear la espalda baja al fatigarte.'],
  },
  'lat-pulldown': {
    rationale: 'Jalón vertical clave para desarrollar dorsales y mejorar el patrón de dominada. Permite ajustar la carga y trabajar el rango completo con gran control técnico.',
    formCues: ['Inicia deprimiendo las escápulas antes de flexionar los codos.', 'Lleva la barra al pecho alto, no detrás del cuello.', 'Permite extensión completa arriba sin perder control.'],
    commonMistakes: ['Balancear el torso para mover más peso.', 'Tirar con bíceps sin activar primero la espalda.'],
  },
  'seated-cable-row': {
    rationale: 'Remo horizontal estable para desarrollar espalda media y mejorar postura. La polea mantiene tensión constante y permite concentrarse en retracción escapular de calidad.',
    formCues: ['Siéntate alto con costillas abajo y columna neutra.', 'Tira el agarre hacia la parte baja del esternón.', 'Pausa un segundo juntando escápulas sin encoger hombros.'],
    commonMistakes: ['Inclinarse demasiado atrás para completar el tirón.', 'Redondear la espalda al dejar volver el cable.'],
  },
  'cable-face-pull': {
    rationale: 'Movimiento preventivo y de rendimiento para deltoide posterior, trapecio medio/bajo y rotadores externos. Ayuda a equilibrar el volumen de empujes y a mantener hombros saludables.',
    formCues: ['Tira la cuerda hacia la cara con codos altos.', 'Separa las manos al final y rota externamente.', 'Usa carga ligera y busca rango limpio, no ego.'],
    commonMistakes: ['Bajar los codos y convertirlo en un remo común.', 'Cargar demasiado y perder rotación externa.'],
  },
  'barbell-curl': {
    rationale: 'Ejercicio básico para sobrecargar bíceps con una herramienta estable. Bien controlado desarrolla fuerza de flexión de codo y masa en los brazos.',
    formCues: ['Mantén codos cerca del torso y quietos.', 'Sube sin balancear la cadera.', 'Baja completo con 2–3 segundos de control.'],
    commonMistakes: ['Usar impulso lumbar para iniciar la repetición.', 'No extender el codo completamente abajo.'],
  },
  'barbell-back-squat': {
    rationale: 'Patrón dominante de rodilla esencial para fuerza y masa de tren inferior. Entrena cuádriceps, glúteos, aductores y core con una alta demanda sistémica.',
    formCues: ['Respira profundo y crea presión abdominal antes de bajar.', 'Mantén rodillas alineadas con los dedos del pie.', 'Baja hasta una profundidad que puedas controlar sin perder columna neutra.'],
    commonMistakes: ['Colapsar rodillas hacia dentro al subir.', 'Relajarse en la parte baja y perder tensión.'],
  },
  'romanian-deadlift': {
    rationale: 'Uno de los mejores ejercicios para isquios y glúteos por su carga en posición alargada. Refuerza la bisagra de cadera y protege la cadena posterior.',
    formCues: ['Empuja la cadera hacia atrás antes de bajar la barra.', 'Mantén una ligera flexión de rodilla constante.', 'Baja hasta sentir máximo estiramiento sin redondear la espalda.'],
    commonMistakes: ['Convertirlo en sentadilla doblando demasiado las rodillas.', 'Buscar más rango a costa de perder neutralidad lumbar.'],
  },
  'leg-press': {
    rationale: 'Permite añadir volumen pesado de piernas con menor demanda técnica y axial que la sentadilla. Es muy útil para acumular trabajo de cuádriceps y glúteos con seguridad.',
    formCues: ['Apoya toda la espalda contra el respaldo.', 'Baja hasta donde la pelvis no se despegue del asiento.', 'Empuja con todo el pie sin bloquear agresivamente las rodillas.'],
    commonMistakes: ['Bajar tanto que la cadera se enrolla y carga la zona lumbar.', 'Bloquear rodillas entre repeticiones y perder tensión.'],
  },
  'lying-leg-curl': {
    rationale: 'Aísla la función de flexión de rodilla de los isquios, complementando bisagras como el peso muerto rumano. Es clave para desarrollo completo y salud de rodilla.',
    formCues: ['Mantén la cadera pegada al banco.', 'Curl hasta acercar talones a glúteos sin levantar la pelvis.', 'Controla la bajada y estira completamente abajo.'],
    commonMistakes: ['Levantar caderas para mover más peso.', 'Hacer repeticiones parciales y rápidas.'],
  },
  'standing-calf-raise': {
    rationale: 'Trabaja el gastrocnemio con rodilla extendida, importante para estética, estabilidad de tobillo y rendimiento en saltos o carrera. Los gemelos responden bien a rango completo y volumen.',
    formCues: ['Sube lo más alto posible sobre la punta del pie.', 'Pausa abajo en estiramiento sin rebotar.', 'Mantén rodillas extendidas pero no bloqueadas agresivamente.'],
    commonMistakes: ['Rebotar usando el tendón de Aquiles.', 'Usar rango corto y demasiado peso.'],
  },
  'barbell-incline-bench-press': {
    rationale: 'Variante pesada para pecho superior y deltoide anterior con alta capacidad de sobrecarga. Complementa el press plano y mejora fuerza en distintos ángulos de empuje.',
    formCues: ['Banco a 30–45° y escápulas retraídas.', 'Toca la parte alta del pecho con control.', 'Mantén antebrazos verticales en la parte baja.'],
    commonMistakes: ['Usar una inclinación excesiva.', 'Tocar demasiado alto cerca del cuello.'],
  },
  'pull-up': {
    rationale: 'Jalón vertical con peso corporal que desarrolla dorsales, bíceps y control escapular. Es una referencia excelente de fuerza relativa del tren superior.',
    formCues: ['Empieza desde colgado completo y escápulas controladas.', 'Piensa en llevar codos hacia las costillas.', 'Sube hasta que la barbilla pase la barra sin patear.'],
    commonMistakes: ['Usar kipping cuando el objetivo es fuerza o hipertrofia.', 'Recortar la parte baja para hacer más repeticiones.'],
  },
  'dumbbell-shoulder-press': {
    rationale: 'Press vertical con mayor libertad articular que la barra. Desarrolla deltoides y tríceps mientras permite corregir diferencias entre lados.',
    formCues: ['Mantén costillas abajo y glúteos activos.', 'Baja las mancuernas hasta cerca de la línea de orejas.', 'Presiona en un arco natural sin chocar arriba.'],
    commonMistakes: ['Arquear la espalda para compensar carga excesiva.', 'Hacer medias repeticiones sin bajar suficiente.'],
  },
  'dumbbell-hammer-curl': {
    rationale: 'Trabaja braquial, braquiorradial y bíceps en agarre neutro. Aporta grosor al brazo y mejora fuerza de agarre.',
    formCues: ['Mantén palmas enfrentadas todo el recorrido.', 'Evita que los codos se vayan hacia delante.', 'Baja hasta extensión completa con control.'],
    commonMistakes: ['Supinar arriba y convertirlo en curl tradicional.', 'Balancear el torso para levantar más peso.'],
  },
  'skull-crusher': {
    rationale: 'Aísla el tríceps, especialmente la cabeza larga, en una posición de gran estiramiento. Es excelente para completar el trabajo que los presses no cubren totalmente.',
    formCues: ['Mantén codos apuntando arriba y relativamente fijos.', 'Baja la barra hacia frente o detrás de la cabeza con control.', 'Extiende fuerte sin bloquear con violencia.'],
    commonMistakes: ['Dejar que los codos se abran demasiado.', 'Usar carga excesiva y acortar el rango.'],
  },
  'hack-squat': {
    rationale: 'Variante guiada que permite enfatizar cuádriceps con alta estabilidad. Es útil para volumen pesado de piernas sin tanta demanda de equilibrio como la sentadilla libre.',
    formCues: ['Mantén espalda y cadera pegadas al respaldo.', 'Coloca pies donde puedas bajar profundo sin despegar talones.', 'Controla la bajada y empuja con el pie completo.'],
    commonMistakes: ['Poner los pies demasiado altos y perder énfasis en cuádriceps.', 'Rebotar abajo o perder contacto con el respaldo.'],
  },
  'barbell-glute-bridge': {
    rationale: 'Carga directamente la extensión de cadera y la contracción máxima de glúteos. Es una alternativa estable y efectiva para fortalecer el bloqueo de cadera.',
    formCues: ['Coloca la barra sobre el pliegue de la cadera con protección.', 'Termina con pelvis en ligera retroversión y glúteos apretados.', 'Mantén costillas abajo para no hiperextender la zona lumbar.'],
    commonMistakes: ['Arquear la espalda en lugar de extender la cadera.', 'Empujar solo con talones y perder contacto del pie completo.'],
  },
  'leg-extension': {
    rationale: 'Aislamiento directo de cuádriceps que permite fatigar el músculo sin carga axial. Es especialmente útil para trabajar la contracción final de la extensión de rodilla.',
    formCues: ['Ajusta el rodillo justo por encima del tobillo.', 'Extiende por completo y pausa arriba.', 'Baja controlado sin dejar caer la carga.'],
    commonMistakes: ['Usar demasiado peso y balancear el cuerpo.', 'No llegar a extensión completa.'],
  },
  'bulgarian-split-squat': {
    rationale: 'Ejercicio unilateral exigente para cuádriceps, glúteos y estabilidad de cadera. Ayuda a corregir asimetrías que los movimientos bilaterales pueden ocultar.',
    formCues: ['Coloca el pie delantero lo bastante lejos para controlar la rodilla.', 'Baja verticalmente manteniendo equilibrio.', 'Empuja con el pie delantero, no con la pierna trasera.'],
    commonMistakes: ['Poner el pie delantero demasiado cerca del banco.', 'Cargar demasiado antes de dominar estabilidad y profundidad.'],
  },
  'barbell-good-morning': {
    rationale: 'Fortalece erectores, glúteos e isquios en bisagra de cadera. Es un accesorio técnico potente para sentadilla y peso muerto cuando se carga con prudencia.',
    formCues: ['Usa carga moderada y prioriza control.', 'Empuja cadera atrás manteniendo columna neutra.', 'Detén el recorrido antes de que la espalda se redondee.'],
    commonMistakes: ['Tratarlo como un máximo de fuerza.', 'Flexionar rodillas en exceso y convertirlo en sentadilla.'],
  },
  'close-grip-bench-press': {
    rationale: 'Variante específica para fortalecer tríceps y bloqueo del press de banca. Mantiene transferencia al patrón de empuje horizontal con mayor demanda de extensión de codo.',
    formCues: ['Usa un agarre cerrado pero cómodo para muñecas.', 'Mantén la misma retracción escapular que en el press normal.', 'Baja con codos controlados cerca del torso.'],
    commonMistakes: ['Cerrar demasiado el agarre y molestar muñecas.', 'Perder arco y tensión de espalda alta.'],
  },
  dips: {
    rationale: 'Empuje con peso corporal muy efectivo para tríceps, pecho inferior y estabilidad escapular. Puede progresarse con lastre cuando la técnica es sólida.',
    formCues: ['Baja hasta un rango cómodo sin dolor anterior de hombro.', 'Mantén codos ligeramente hacia atrás, no totalmente abiertos.', 'Bloquea arriba controlando escápulas.'],
    commonMistakes: ['Forzar profundidad más allá de tu movilidad.', 'Balancear piernas para completar repeticiones.'],
  },
  'barbell-deadlift': {
    rationale: 'Levantamiento global para fuerza de cadena posterior y producción total de fuerza. Entrena glúteos, espalda, agarre y braceo con alta transferencia atlética.',
    formCues: ['Coloca la barra sobre el mediopié antes de tirar.', 'Crea tensión en dorsales y abdomen antes de despegar.', 'Empuja el suelo y mantén la barra pegada al cuerpo.'],
    commonMistakes: ['Tirar de golpe sin quitar la holgura de la barra.', 'Dejar que la barra se aleje y aumente la carga lumbar.'],
  },
  'dumbbell-lateral-raise': {
    rationale: 'Aislamiento clave para deltoide lateral y amplitud visual de hombros. Funciona mejor con control, rango consistente y tensión continua.',
    formCues: ['Inclínate apenas hacia delante y lidera con los codos.', 'Sube hasta altura de hombros sin encoger trapecios.', 'Baja lento manteniendo tensión.'],
    commonMistakes: ['Usar balanceo para mover mancuernas demasiado pesadas.', 'Convertirlo en encogimiento de trapecio.'],
  },
  'goblet-squat': {
    rationale: 'Sentadilla accesible para reforzar patrón, movilidad y posición de torso. Es excelente como accesorio técnico o trabajo de volumen moderado.',
    formCues: ['Sostén la carga pegada al pecho.', 'Mantén pecho alto y codos apuntando abajo.', 'Pausa abajo sin perder el pie completo en el suelo.'],
    commonMistakes: ['Relajar el core en la parte baja.', 'Usar una carga que obliga a inclinarte hacia delante.'],
  },
  'kettlebell-swing': {
    rationale: 'Movimiento balístico de bisagra que desarrolla potencia de cadera y acondicionamiento. Bien ejecutado entrena glúteos e isquios sin convertirse en una sentadilla.',
    formCues: ['Carga la cadera atrás como en un peso muerto rumano.', 'Explota con extensión de cadera; los brazos solo guían.', 'Termina alto y firme, sin hiperextender lumbar.'],
    commonMistakes: ['Levantar la kettlebell con hombros.', 'Doblar demasiado rodillas y convertirlo en sentadilla.'],
  },
  'mountain-climbers': {
    rationale: 'Finalizador de core y acondicionamiento que eleva frecuencia cardiaca rápidamente. Entrena estabilidad de tronco mientras las caderas se mueven a alta velocidad.',
    formCues: ['Mantén hombros sobre muñecas.', 'Conserva cadera a la altura de hombros.', 'Lleva rodillas al pecho rápido sin perder postura.'],
    commonMistakes: ['Elevar demasiado la cadera al fatigarte.', 'Mover lento y perder el estímulo metabólico.'],
  },
  'push-up': {
    rationale: 'Empuje básico de peso corporal para pecho, tríceps y core. Es útil como finalizador, trabajo de volumen o referencia de control corporal.',
    formCues: ['Mantén cuerpo en línea recta de cabeza a talones.', 'Baja el pecho hacia el suelo con codos a 30–60°.', 'Empuja separando ligeramente el suelo al final.'],
    commonMistakes: ['Dejar caer la cadera o hacer “gusano”.', 'Recortar profundidad para sumar repeticiones.'],
  },
  burpee: {
    rationale: 'Movimiento de cuerpo completo para acondicionamiento intenso. Combina empuje, cambio de nivel y salto, elevando rápidamente la demanda cardiovascular.',
    formCues: ['Aterriza con pies firmes antes de saltar.', 'Mantén el core activo en la parte de flexión.', 'Busca ritmo sostenible en lugar de salir demasiado rápido.'],
    commonMistakes: ['Eliminar la flexión o el salto y reducir demasiado el estímulo.', 'Perder postura lumbar al caer al suelo.'],
  },
  'incline-dumbbell-curl': {
    rationale: 'Curl que coloca el bíceps en posición estirada, especialmente la cabeza larga. Es excelente para hipertrofia cuando se ejecuta con control y rango completo.',
    formCues: ['Deja los brazos colgar detrás del torso.', 'No adelantes el codo para iniciar la repetición.', 'Supina y contrae fuerte arriba.'],
    commonMistakes: ['Usar impulso del hombro.', 'Bajar rápido y perder el estiramiento bajo carga.'],
  },
  'box-jump': {
    rationale: 'Ejercicio de potencia para tren inferior que entrena producción rápida de fuerza. Es útil para rendimiento atlético siempre que cada repetición sea explosiva y limpia.',
    formCues: ['Carga con una pequeña flexión de cadera y rodilla.', 'Salta con intención máxima y aterriza suave.', 'Baja caminando del cajón para reducir impacto.'],
    commonMistakes: ['Usar un cajón demasiado alto y aterrizar en sentadilla profunda.', 'Hacer repeticiones fatigado perdiendo explosividad.'],
  },
};
