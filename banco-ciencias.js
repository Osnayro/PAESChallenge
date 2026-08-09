
/**
 * ============================================================
 * PAES CHALLENGE — BANCO DE CIENCIAS (NIVEL 4)
 * 79 preguntas alineadas al temario DEMRE
 * Ejes: Biología, Física, Química
 * ============================================================
 */

const paesCienciasQuestions = [
  // ================================================================
  // EJE: BIOLOGÍA (28 preguntas)
  // ================================================================
  {
    id: 5001, topic: 'biologia', type: 'multiple',
    question: 'La científica Lynn Margulis propuso la teoría endosimbiótica para explicar el origen de algunos organelos celulares. Según esta teoría, hace unos 2500 millones de años, algunos procariontes que utilizaban oxígeno fueron ingeridos por células de mayor tamaño sin ser digeridos, estableciendo una relación de beneficio mutuo. ¿Cuál de las siguientes estructuras celulares se originó según esta teoría?',
    options: ['Ribosoma', 'Mitocondria', 'Peroxisoma', 'Lisosoma'],
    correct: 1,
    explanation: 'La teoría endosimbiótica explica cómo organismos procariontes que utilizaban oxígeno fueron ingeridos por células mayores, dando origen a las mitocondrias.',
    hint: 'Piensa en el organelo encargado de la respiración celular.',
    points: 100
  },
  {
    id: 5002, topic: 'biologia', type: 'multiple',
    question: 'Un grupo de investigación analiza el transporte de proteínas entre el retículo endoplasmático rugoso (RER), el complejo de Golgi (CG) y la membrana plasmática (MP). En el experimento, todos los cultivos se incuban durante 30 minutos antes de cuantificar la radiactividad. ¿Qué variable está controlada en este diseño?',
    options: ['La presencia de droga BFA', 'La temperatura', 'El tiempo de incubación', 'El porcentaje de radiactividad'],
    correct: 2,
    explanation: 'El tiempo de incubación se mantiene constante en 30 minutos para todos los cultivos, por lo que es una variable controlada.',
    hint: 'Busca el parámetro que se mantiene igual en todas las condiciones experimentales.',
    points: 100
  },
  {
    id: 5003, topic: 'biologia', type: 'multiple',
    question: 'En un criadero ocurrió una cruza no deseada entre animales. Para analizar las células involucradas, se necesita un método que separe las células según su tamaño y peso. ¿Qué método es el apropiado?',
    options: ['Cultivo celular', 'Solubilización', 'Centrifugación', 'Microscopía'],
    correct: 2,
    explanation: 'La centrifugación diferencial permite separar células distribuyéndolas según su tamaño y peso.',
    hint: 'Busca el método que aplica fuerza para separar componentes por densidad.',
    points: 100
  },
  {
    id: 5004, topic: 'biologia', type: 'multiple',
    question: 'Los macrófagos son células del sistema inmunológico capaces de desplazarse por los tejidos. Al exponerlos a una droga, pierden la capacidad de desplazarse. ¿Sobre qué estructura celular interfiere la droga?',
    options: ['Vesículas de secreción', 'Citoesqueleto', 'Vesículas del Golgi', 'Enzimas de los lisosomas'],
    correct: 1,
    explanation: 'La pérdida de capacidad de desplazamiento indica una interferencia directa sobre el citoesqueleto, estructura responsable del movimiento celular.',
    hint: '¿Qué estructura celular está relacionada con el movimiento?',
    points: 100
  },
  {
    id: 5005, topic: 'biologia', type: 'multiple',
    question: 'Durante la fecundación, los espermatozoides presentan quimiotaxis, migrando hacia un atrayente químico. Los datos muestran que a mayor concentración del quimioatrayente, mayor es el porcentaje de migración (de 30% a 90%). ¿Qué predicción es correcta?',
    options: [
      'Los espermatozoides aumentarán su movimiento flagelar a concentraciones mayores.',
      'El tiempo necesario para la fecundación disminuirá a concentraciones mayores.',
      'La cantidad de espermatozoides próximos al ovocito disminuirá.',
      'La probabilidad de fecundación aumentará a mayor concentración del quimioatrayente.'
    ],
    correct: 3,
    explanation: 'A mayor concentración del quimioatrayente, mayor es la atracción efectiva de los gametos masculinos, aumentando la probabilidad de fecundación.',
    hint: 'Observa la relación directa entre concentración y porcentaje de migración.',
    points: 100
  },
  {
    id: 5006, topic: 'biologia', type: 'multiple',
    question: 'Un estudio sobre tabaquismo reveló que en mujeres fumadoras los niveles de VEGF (proteína que promueve la generación de vasos sanguíneos) disminuyeron significativamente. ¿Qué inferencia es correcta?',
    options: [
      'El tabaquismo incrementaría la menstruación.',
      'El tabaquismo aumentaría la cantidad de folículos ováricos.',
      'El tabaquismo impediría la implantación del blastocisto.',
      'El tabaquismo disminuiría la cantidad de hormonas sexuales.'
    ],
    correct: 2,
    explanation: 'Al disminuir el VEGF, se reduce la generación de vasos sanguíneos en los tejidos uterinos, interfiriendo con las condiciones necesarias para la implantación del blastocisto.',
    hint: '¿Qué función cumple el VEGF en el útero?',
    points: 100
  },
  {
    id: 5007, topic: 'biologia', type: 'multiple',
    question: 'Un equipo desarrolla un nuevo método anticonceptivo masculino. Para evaluarlo, dividen parejas en dos grupos: uno recibe la inyección y el otro usa condón. Se registran embarazos durante dos años. ¿Qué pregunta de investigación dio origen a este procedimiento?',
    options: [
      '¿Cuál es la cantidad de hombres que utilizan el nuevo método?',
      '¿Qué diferencias existen en las concentraciones de hormonas sexuales?',
      '¿De qué manera influyen las preferencias personales en la elección?',
      '¿Cuál es la eficacia relativa de la inyección comparada con el condón en la prevención de embarazos?'
    ],
    correct: 3,
    explanation: 'El diseño compara la efectividad de la inyección experimental frente al condón mediante el registro de embarazos.',
    hint: 'Busca la pregunta que compara directamente los dos métodos.',
    points: 100
  },
  {
    id: 5008, topic: 'biologia', type: 'multiple',
    question: 'La vasectomía interrumpe el flujo de gametos. Si un hombre se realiza una cirugía de reconexión, ¿qué acción permitiría comprobar que la reversión fue exitosa?',
    options: [
      'Estudiar muestras de semen en el microscopio.',
      'Evaluar la maduración de los espermatozoides.',
      'Evaluar la producción de gametos a nivel testicular.',
      'Estudiar la morfología espermática en los tubos seminíferos.'
    ],
    correct: 0,
    explanation: 'Estudiar muestras de semen en el microscopio después de la reconexión permite comprobar directamente si los gametos volvieron a transitar con éxito.',
    hint: '¿Dónde se puede observar directamente la presencia de espermatozoides?',
    points: 100
  },
  {
    id: 5009, topic: 'biologia', type: 'multiple',
    question: 'Un equipo investiga el virus VHS-1 (herpes genital) y elabora cuatro tests rápidos. El Test 3 da reacción positiva solo ante VHS-1 y negativa ante Hepatitis, Influenza y VIH. ¿Qué test es el apropiado para detectar exclusivamente VHS-1?',
    options: ['Test 1', 'Test 2', 'Test 3', 'Test 4'],
    correct: 2,
    explanation: 'El Test 3 cumple con la especificidad exclusiva requerida al reaccionar únicamente ante el virus VHS-1.',
    hint: 'Busca el test que solo reacciona con un virus y no con los demás.',
    points: 100
  },
  {
    id: 5010, topic: 'biologia', type: 'multiple',
    question: 'Una toxina inhibe proteínas de segregación cromosómica y también moléculas que modulan la apoptosis. ¿Qué inferencia es correcta sobre las células tratadas?',
    options: [
      'Detendrán su ciclo celular en la etapa de replicación.',
      'Presentarán una metafase más prolongada.',
      'Experimentarán una anafase defectuosa seguida de división celular descontrolada.',
      'Retornarán a un estado metafásico para reparar el ADN.'
    ],
    correct: 2,
    explanation: 'La inhibición de proteínas de segregación cromosómica causa anafase defectuosa. Al inhibirse también la apoptosis, las células dañadas no mueren y continúan dividiéndose sin control.',
    hint: 'Relaciona la segregación cromosómica con la fase de la mitosis donde ocurre.',
    points: 100
  },
  {
    id: 5011, topic: 'biologia', type: 'multiple',
    question: 'Un estudiante observa células en división mitótica y cree haber identificado una en telofase. ¿Qué justifica correctamente su identificación?',
    options: [
      'La célula presenta dos zonas de reorganización de cariotecas.',
      'La célula presenta cromosomas dispersos aleatoriamente.',
      'La célula presenta cromosomas en el plano ecuatorial.',
      'La célula presenta centriolos ubicados en los polos.'
    ],
    correct: 0,
    explanation: 'En la telofase ocurre la reorganización de las envolturas nucleares alrededor de los dos conjuntos de cromosomas segregados.',
    hint: '¿Qué estructura se reorganiza al final de la mitosis?',
    points: 100
  },
  {
    id: 5012, topic: 'biologia', type: 'multiple',
    question: 'La meiosis da origen a gametos haploides que, tras fusionarse, forman un cigoto diploide. ¿Cuál es una evidencia del resultado exitoso de la meiosis?',
    options: [
      'Las células del embrión formado son diploides.',
      'Las células resultantes son de diferente tamaño.',
      'Las células germinales incrementan sus genes en cada gameto.',
      'Los gametos se mueven activamente para formar un cigoto.'
    ],
    correct: 0,
    explanation: 'La diploidía de las células del embrión constituye la evidencia directa de que la meiosis produjo gametos haploides que se fusionaron exitosamente.',
    hint: '¿Cuál es la característica cromosómica del cigoto formado?',
    points: 100
  },
  {
    id: 5013, topic: 'biologia', type: 'multiple',
    question: '"La manipulación genética emerge como una herramienta potencial para solucionar la escasez de alimentos a largo plazo." ¿Qué evidencia sustenta esta afirmación?',
    options: [
      'Los cultivos de maíz Bt genéticamente modificados tienen mayor producción que los convencionales.',
      'La polinización puede verse afectada por cultivos transgénicos en áreas silvestres.',
      'La modificación genética de tomates mejora el sabor comparado con los no modificados.',
      'El arroz modificado genéticamente presenta mayor cantidad de vitaminas que el arroz silvestre.'
    ],
    correct: 0,
    explanation: 'Para responder a la escasez de alimentos, la evidencia del maíz Bt demuestra que la modificación genética aumenta el volumen de producción.',
    hint: 'Busca la evidencia relacionada directamente con la producción de alimentos.',
    points: 100
  },
  {
    id: 5014, topic: 'biologia', type: 'multiple',
    question: 'Un equipo estudia pingüinos rey y señala que el comportamiento de guarderías "podría estar incrementando las posibilidades de sobrevivencia de su progenie". ¿A qué componente de la investigación corresponde esta frase?',
    options: ['A una teoría', 'A una inferencia', 'A un modelo', 'A un resultado'],
    correct: 1,
    explanation: 'Es una deducción o interpretación realizada a partir de hechos observados, lo cual califica como una inferencia científica.',
    hint: 'Distingue entre un hecho observado y una interpretación de ese hecho.',
    points: 100
  },
  {
    id: 5015, topic: 'biologia', type: 'multiple',
    question: 'Un estudio sobre el registro fósil de una cuenca glaciar detalla la aparición de humanos, la caza y la posterior extinción de megamamíferos. ¿Qué objetivo de investigación es acorde al estudio?',
    options: [
      'Reconocer las especies de mamíferos que habitan el valle glaciar.',
      'Proponer las causas de la extinción de los megamamíferos del valle glaciar.',
      'Explicar cómo los humanos sobrevivieron a la transformación de su hábitat.',
      'Comparar la distribución de megamamíferos prehistóricos con los actuales.'
    ],
    correct: 1,
    explanation: 'El estudio vincula cronológicamente la aparición humana, la caza y la extinción de megamamíferos, proponiendo causas para dicha extinción.',
    hint: '¿Qué relación causal explora el estudio?',
    points: 100
  },
  {
    id: 5016, topic: 'biologia', type: 'multiple',
    question: 'En células de salamandra coexisten algas unicelulares. Si las algas proporcionan productos de la fotosíntesis y las mitocondrias de la salamandra proveen reactantes para la fotosíntesis, ¿qué inferencia es correcta?',
    options: [
      'La nutrición del alga es de tipo heterótrofa.',
      'La nutrición de la salamandra es de tipo autótrofa.',
      'La fotosíntesis del alga es más eficiente dentro de la salamandra.',
      'El carbono de las moléculas orgánicas del alga proviene de la respiración de la salamandra.'
    ],
    correct: 3,
    explanation: 'Si las mitocondrias de la salamandra proveen CO₂ (reactante de la fotosíntesis), el carbono fijado por el alga proviene de la respiración celular del hospedador.',
    hint: '¿Qué gas producido por la respiración celular es utilizado en la fotosíntesis?',
    points: 100
  },
  {
    id: 5017, topic: 'biologia', type: 'multiple',
    question: 'Las expansinas son proteínas que ablandan la pared del grano de trigo permitiendo su llenado con almidón y gluten. Si se manipula controladamente su expresión, ¿qué resultado se debería obtener?',
    options: [
      'Granos con paredes más resistentes.',
      'Granos de mayor tamaño.',
      'Granos en mayor cantidad.',
      'Granos más hidratados.'
    ],
    correct: 1,
    explanation: 'Potenciar la acción de ablandamiento de las expansinas facilitará que el grano se expanda y adquiera mayor tamaño antes de endurecerse.',
    hint: 'Si la pared se ablanda más, ¿qué puede ocurrir con el contenido del grano?',
    points: 100
  },
  {
    id: 5018, topic: 'biologia', type: 'multiple',
    question: 'En un experimento de fotosíntesis, se ilumina la hoja de la planta 1 y el tallo de la planta 2. La bolsa de la planta 1 se infla, la de la planta 2 no. ¿Qué material permite estudiar la variable independiente?',
    options: ['Campana oscura', 'Bolsa plástica', 'Sistema de riego', 'Sistema de iluminación'],
    correct: 3,
    explanation: 'La variable independiente es la zona de la planta que recibe luz (hoja vs. tallo), manipulada mediante el sistema de iluminación.',
    hint: '¿Qué factor es manipulado deliberadamente por el experimentador?',
    points: 100
  },
  {
    id: 5019, topic: 'biologia', type: 'multiple',
    question: 'Una investigadora busca establecer los tiempos de secreción de un receptor desde el RER, pasando por el Golgi hasta la membrana plasmática. ¿Qué reactivo es adecuado para seguir este recorrido?',
    options: [
      'Reactivo específico para proteínas en el medio de cultivo.',
      'Reactivo específico para proteínas intracelulares.',
      'Reactivo específico para membrana plasmática.',
      'Reactivo específico para endomembranas.'
    ],
    correct: 1,
    explanation: 'Para seguir el tránsito interno del receptor por RER y Golgi, se necesita un reactivo que identifique proteínas intracelulares en todo el recorrido.',
    hint: '¿Dónde se encuentra el receptor durante la mayor parte de su recorrido?',
    points: 100
  },
  {
    id: 5020, topic: 'biologia', type: 'multiple',
    question: 'En la intolerancia a la lactosa, las células intestinales presentan inflamación que disminuye la absorción de nutrientes. ¿Qué cambio celular explica esta disminución?',
    options: [
      'Aumento en la cantidad de membrana plasmática.',
      'Aumento del largo de las microvellosidades.',
      'Disminución en la cantidad de microvellosidades.',
      'Disminución de la membrana basal.'
    ],
    correct: 2,
    explanation: 'La absorción de nutrientes depende del área de contacto provista por las microvellosidades. Su disminución reduce la absorción.',
    hint: '¿Qué estructuras aumentan la superficie de absorción intestinal?',
    points: 100
  },
  {
    id: 5021, topic: 'biologia', type: 'multiple',
    question: 'Un científico sospecha que el ion bicarbonato (HCO₃⁻) activa el movimiento de los espermatozoides. ¿Qué experimento permite evaluar correctamente esta hipótesis?',
    options: [
      'Exponer espermatozoides a diferentes concentraciones de HCO₃⁻ y comparar su motilidad.',
      'Exponer espermatozoides a HCO₃⁻ en distintos tiempos y medir el cambio en su tamaño.',
      'Exponer espermatozoides a diferentes concentraciones de HCO₃⁻ y evaluar su capacidad de penetrar el ovocito.',
      'Exponer espermatozoides a HCO₃⁻ y medir sus cambios morfológicos.'
    ],
    correct: 0,
    explanation: 'Para comprobar si el bicarbonato activa el movimiento flagelar, se debe variar su concentración y cuantificar el efecto sobre la motilidad.',
    hint: '¿Qué variable debe manipularse y qué efecto debe medirse?',
    points: 100
  },
  {
    id: 5022, topic: 'biologia', type: 'multiple',
    question: 'Un estudio sobre DIU con Levonorgestrel encontró que antes del tratamiento el 42,6% presentaba sangrado abundante y después el 82% presentó escaso sangrado. ¿Qué pregunta guió este estudio?',
    options: [
      '¿Cuál es el efecto del DIU+Levo en la cantidad de días del ciclo menstrual?',
      '¿Cuál es el efecto del DIU+Levo en la prevalencia de periodos de sangrado?',
      '¿Cuál es el efecto del DIU+Levo en la cantidad de flujo menstrual?',
      '¿Cuál es el efecto del DIU+Levo en la regulación de los patrones menstruales cíclicos?'
    ],
    correct: 2,
    explanation: 'Las variables medidas se concentran en la abundancia del flujo (sangrado abundante vs. escaso), por lo que la pregunta debe indagar sobre la cantidad de flujo.',
    hint: '¿Qué cambió específicamente después del tratamiento?',
    points: 100
  },
  {
    id: 5023, topic: 'biologia', type: 'multiple',
    question: 'Un estudio identificó agentes infecciosos en hombres con herpes genital en una localidad. ¿Qué situación permitiría repetir el estudio y contrastar los resultados?',
    options: [
      'Reemplazar la localidad muestreada.',
      'Incluir en el muestreo a la población femenina.',
      'Reemplazar las muestras con hombres asintomáticos.',
      'Aplicar un set de identificadores moleculares para otras ITS.'
    ],
    correct: 0,
    explanation: 'Para verificar la reproducibilidad del estudio, se debe mantener la misma metodología pero cambiar la ubicación geográfica.',
    hint: '¿Qué factor debe variar para contrastar resultados manteniendo el método?',
    points: 100
  },
  {
    id: 5024, topic: 'biologia', type: 'multiple',
    question: 'La vincristina inhibe la polimerización de microtúbulos e interrumpe el huso mitótico. Una versión modificada produce que las células no progresen en el ciclo celular. ¿Qué evidencia demuestra este efecto?',
    options: [
      'Aumento en la longitud de los microtúbulos.',
      'Acumulación de células en fase G1/S.',
      'Aumento de tubulina libre en interfase.',
      'Acumulación de células en fase G2/M y profase mitótica.'
    ],
    correct: 3,
    explanation: 'Al impedir la formación del huso mitótico, las células quedan arrestadas en la transición G2/M y profase.',
    hint: '¿En qué fase se detienen las células si no pueden formar el huso mitótico?',
    points: 100
  },
  {
    id: 5025, topic: 'biologia', type: 'multiple',
    question: 'La pancreatitis hereditaria es causada por una mutación en el gen PRSS1. Se decide tratarla incorporando el gen PRSS1 en células pancreáticas mediante terapia génica. ¿Cuál sería el resultado esperado?',
    options: [
      'Formación de ADN recombinante con capacidad de sintetizar el gen.',
      'Generación de nuevas células pancreáticas.',
      'Síntesis de tripsinógeno catiónico por las células modificadas.',
      'Clonación de células pancreáticas.'
    ],
    correct: 2,
    explanation: 'El fin de la terapia génica es lograr la expresión del gen funcional insertado, produciendo la proteína normal (tripsinógeno catiónico).',
    hint: '¿Qué producto proteico se espera que sinteticen las células tratadas?',
    points: 100
  },
  {
    id: 5026, topic: 'biologia', type: 'multiple',
    question: 'Un grupo quiere mejorar el sabor y olor de frutillas mediante manipulación genética. ¿Cuál es el procedimiento correcto?',
    options: [
      'Insertar el gen en un grupo de semillas, germinarlas y caracterizar los frutos.',
      'Hibridar gametos de frutilla con frutos rojos que contienen el gen.',
      'Insertar el gen y contabilizar la cantidad de frutos producidos.',
      'Insertar genes de frutilla en frutos rojos con mejor sabor.'
    ],
    correct: 0,
    explanation: 'Para validar el efecto, se debe insertar el gen en un lote experimental, dejando un grupo control sin modificar, y luego caracterizar los frutos.',
    hint: '¿Qué elementos requiere un experimento controlado?',
    points: 100
  },
  {
    id: 5027, topic: 'biologia', type: 'multiple',
    question: 'Una investigación asocia la menor disponibilidad de agua con mayor grosor de la médula renal en mamíferos. Según las ideas fijistas, ¿qué inferencia es correcta?',
    options: [
      'Los mamíferos con médulas gruesas pudieron sobrevivir en hábitats desérticos.',
      'La menor disponibilidad hídrica estimuló el engrosamiento renal.',
      'Los mamíferos se adaptaron para generar orina concentrada.',
      'Los individuos con médula desarrollada se reprodujeron exitosamente en desiertos.'
    ],
    correct: 0,
    explanation: 'El fijismo postula que las especies no cambian. Aquellos animales que ya poseían médula renal gruesa pudieron habitar regiones áridas.',
    hint: 'El fijismo sostiene que las especies no evolucionan ni se adaptan.',
    points: 100
  },
  {
    id: 5028, topic: 'biologia', type: 'multiple',
    question: 'El modelo básico para plantas leñosas sugiere que la fotosíntesis ocurre fundamentalmente en las hojas. ¿Qué evidencia apoya este modelo?',
    options: [
      'Mayor emanación de CO₂ en hojas que en otros tejidos.',
      'Mayor emanación de O₂ en hojas que en otros tejidos.',
      'Identificación de cloroplastos en raíces y tallos.',
      'Identificación de almidón en raíces y tallos.'
    ],
    correct: 1,
    explanation: 'La producción de O₂ es un subproducto directo de la fotosíntesis. Una mayor liberación en hojas confirma que la fotosíntesis ocurre predominantemente allí.',
    hint: '¿Qué gas se libera como producto de la fotosíntesis?',
    points: 100
  },

  // ================================================================
  // EJE: FÍSICA (23 preguntas)
  // ================================================================
  {
    id: 5101, topic: 'fisica', type: 'multiple',
    question: 'Una investigadora calienta agua con un mechero y hace incidir un láser sobre su superficie, registrando el comportamiento del haz refractado. ¿Qué hipótesis pudo dar origen a este procedimiento?',
    options: [
      'A medida que el ángulo incidente aumenta, el haz refractado se aproxima a la normal.',
      'A medida que el agua aumenta su temperatura, el haz refractado se acerca a la normal.',
      'A medida que el ángulo incidente aumenta, el haz refractado disminuye en intensidad.',
      'A medida que el agua aumenta su temperatura, el haz incidente disminuye en intensidad.'
    ],
    correct: 1,
    explanation: 'El experimento manipula la temperatura del agua mediante el mechero, manteniendo constante el ángulo del láser, para observar el efecto sobre la dirección del haz refractado.',
    hint: '¿Qué variable se está manipulando en el experimento?',
    points: 100
  },
  {
    id: 5102, topic: 'fisica', type: 'multiple',
    question: 'El experimento de Young requiere rendijas con grosores comparables a la longitud de onda de la luz (cientos de nanómetros). ¿Qué situación permitiría obtener un patrón equivalente?',
    options: [
      'La luz del Sol pasando por dos ventanales paralelos.',
      'La luz de una estrella pasando por la lente de una cámara.',
      'La luz de un láser pasando por el agujero de una pared.',
      'La luz de un láser pasando por dos ranuras del grosor de un cabello en papel de aluminio.'
    ],
    correct: 3,
    explanation: 'Para replicar la difracción e interferencia de Young, las aperturas deben tener dimensiones micrométricas, como el grosor de un cabello.',
    hint: '¿Qué tamaño deben tener las rendijas para que ocurra difracción?',
    points: 100
  },
  {
    id: 5103, topic: 'fisica', type: 'multiple',
    question: 'Un equipo de ingeniería biomédica mide la profundidad del corte de láseres en tejido variando la intensidad del haz. ¿Qué recurso permite mostrar mejor estos resultados en un informe?',
    options: [
      'Una representación visual de las ondas emitidas.',
      'Un esquema del montaje experimental.',
      'Un gráfico de profundidad del corte en función de la intensidad del haz.',
      'Una tabla con los datos de frecuencia y profundidad.'
    ],
    correct: 2,
    explanation: 'Para evidenciar la relación entre la variable manipulada (intensidad) y el resultado (profundidad), un gráfico funcional es la representación óptima.',
    hint: '¿Qué tipo de representación muestra mejor la relación entre dos variables continuas?',
    points: 100
  },
  {
    id: 5104, topic: 'fisica', type: 'multiple',
    question: 'Un investigador compara la energía solar que llega a la superficie terrestre con la medida por un satélite fuera de la atmósfera. Observa valles y caídas abruptas en el rango infrarrojo en la superficie. ¿Qué inferencia es correcta?',
    options: [
      'A la superficie terrestre llega radiación de todas las zonas del espectro.',
      'Las estrellas emiten mayor energía en la zona visible.',
      'Los gases atmosféricos transmiten el espectro infrarrojo de manera irregular.',
      'La energía UV emitida por el Sol es en parte absorbida por el espacio.'
    ],
    correct: 2,
    explanation: 'Las caídas abruptas en la curva de superficie para el infrarrojo, a diferencia de la curva regular fuera de la atmósfera, demuestran una transmisión irregular por los gases atmosféricos.',
    hint: 'Compara la forma de las curvas dentro y fuera de la atmósfera.',
    points: 100
  },
  {
    id: 5105, topic: 'fisica', type: 'multiple',
    question: 'Un faro contiene un espejo cóncavo. Para verificar su estado, instalan obstáculos paralelos al eje óptico y observan los rayos reflejados. ¿Cuál es el objetivo de este procedimiento?',
    options: [
      'Comprobar la intensidad lumínica de la ampolleta.',
      'Identificar irregularidades en la superficie del espejo.',
      'Verificar si el obstáculo es adecuado.',
      'Identificar el material del espejo.'
    ],
    correct: 1,
    explanation: 'Colocar obstáculos regulares permite observar si los rayos reflejados sufren desviaciones anómalas, lo que ayuda a localizar daños o irregularidades en la curvatura del espejo.',
    hint: '¿Qué se puede detectar al observar la trayectoria de los rayos reflejados?',
    points: 100
  },
  {
    id: 5106, topic: 'fisica', type: 'multiple',
    question: 'En una habitación oscura, al encender un foco rojo y uno verde, la pared se ve amarilla y las sombras son roja y verde. Al cambiar el verde por azul, la pared se ve fucsia y las sombras roja y azul. ¿Qué afirmación es correcta?',
    options: [
      'La pared se ve del color de una de las luces encendidas.',
      'Cada sombra se ve del color de una de las luces encendidas.',
      'El cubo es transparente a cualquier radiación.',
      'Las sombras se ven de un color igual a la mezcla de las luces.'
    ],
    correct: 1,
    explanation: 'En ambas situaciones, cada sombra se manifiesta bajo el color de uno de los focos emisores: roja y verde en el primer caso, roja y azul en el segundo.',
    hint: 'Observa el color de cada sombra en relación con los focos encendidos.',
    points: 100
  },
  {
    id: 5107, topic: 'fisica', type: 'multiple',
    question: 'Una persona comprime 2 cm un resorte con bloques de distinta masa y mide la aceleración al soltarlos. ¿Qué variable está controlada en el procedimiento?',
    options: [
      'La masa del bloque.',
      'La aceleración que adquiere el bloque.',
      'La superficie donde se encuentra el bloque.',
      'La fuerza normal ejercida sobre el bloque.'
    ],
    correct: 2,
    explanation: 'La superficie horizontal permanece constante para todas las mediciones. La masa se varía deliberadamente (variable independiente) y la aceleración se mide (variable dependiente).',
    hint: '¿Qué factor permanece invariable en todas las mediciones?',
    points: 100
  },
  {
    id: 5108, topic: 'fisica', type: 'multiple',
    question: 'Una persona observa que paracaidistas con masas similares y paracaídas del mismo material no llegan al suelo al mismo tiempo, y afirma que "el tamaño de los paracaídas debe ser distinto". ¿A qué componente corresponde esta afirmación?',
    options: ['A un marco conceptual', 'A un procedimiento', 'A una observación', 'A una inferencia'],
    correct: 3,
    explanation: 'Es una conclusión racional formulada a partir de datos investigados, no un hecho observado directamente, por lo que constituye una inferencia.',
    hint: '¿Es algo observado directamente o deducido a partir de la evidencia?',
    points: 100
  },
  {
    id: 5109, topic: 'fisica', type: 'multiple',
    question: 'Un grupo realiza un experimento con una caja atada a una cuerda que pasa por una polea, colgando masas en el extremo libre. La caja se mantiene en reposo. ¿Qué conclusión es correcta sobre las fuerzas?',
    options: [
      'La fuerza de roce estático aumenta con la tensión de la cuerda.',
      'La fuerza normal aumenta con la tensión de la cuerda.',
      'El peso de la caja aumenta con la tensión de la cuerda.',
      'La fuerza de reacción a la normal aumenta con la tensión de la cuerda.'
    ],
    correct: 0,
    explanation: 'Para mantener el reposo (fuerza neta cero), la fuerza de roce estático debe equilibrar exactamente la fuerza horizontal ejercida por la tensión de la cuerda.',
    hint: '¿Qué fuerza horizontal se opone a la tensión de la cuerda?',
    points: 100
  },
  {
    id: 5110, topic: 'fisica', type: 'multiple',
    question: 'Una persona quiere determinar la relación entre la masa de un objeto y la fuerza máxima horizontal para que comience a moverse. ¿Qué instrumento mide la variable dependiente?',
    options: ['Una regla', 'Una balanza', 'Un cronómetro', 'Un dinamómetro'],
    correct: 3,
    explanation: 'La variable dependiente es la fuerza máxima horizontal. El dinamómetro es el instrumento diseñado para medir magnitudes de fuerza.',
    hint: '¿Qué instrumento mide fuerzas?',
    points: 100
  },
  {
    id: 5111, topic: 'fisica', type: 'multiple',
    question: 'Un grupo estudia la deformación de un resorte al aplicar fuerzas. Los datos entre 3,0 y 6,0 N no se registraron. El gráfico muestra una relación lineal: a 2,0 N la deformación es ~0,25 m, a 7,0 N es ~0,8 m. ¿Qué se espera para fuerzas entre 3,0 y 6,0 N?',
    options: [
      'La deformación tomará valores entre 0,3 y 0,7 m.',
      'Superará el límite elástico al alcanzar 0,7 m.',
      'Será mayor que la registrada con fuerzas sobre 8,5 N.',
      'Decrecerá a medida que la fuerza aplicada aumenta.'
    ],
    correct: 0,
    explanation: 'Por interpolación lineal entre los puntos conocidos, las fuerzas intermedias producirán deformaciones contenidas entre 0,3 y 0,7 metros.',
    hint: 'Observa la tendencia lineal y estima los valores intermedios.',
    points: 100
  },
  {
    id: 5112, topic: 'fisica', type: 'multiple',
    question: 'Un docente mide la estatura de un estudiante de pie y acostado, encontrando que es mayor al estar acostado. Lo explica por la compresión de la columna debido a la gravedad. ¿Qué tecnología debe considerar esta explicación?',
    options: ['Los trajes de astronautas', 'Las plantillas ortopédicas', 'Las camas ergonómicas', 'Los sofás cama'],
    correct: 0,
    explanation: 'En entornos de microgravedad, la columna de los astronautas sufrirá una descompresión, por lo que los trajes espaciales deben prever este cambio antropométrico.',
    hint: '¿En qué contexto la gravedad es mucho menor que en la Tierra?',
    points: 100
  },
  {
    id: 5113, topic: 'fisica', type: 'multiple',
    question: 'Una persona investiga si la falla de San Ramón puede generar sismos de gran magnitud. ¿Qué dato sería relevante para iniciar su investigación?',
    options: [
      'Las características de sismos generados por fallas similares.',
      'La cantidad de sismos registrados en los últimos 2 años.',
      'La cantidad de fallas similares en la placa Sudamericana.',
      'La clasificación de la falla según el desplazamiento de rocas.'
    ],
    correct: 0,
    explanation: 'Para modelar el potencial sísmico, el paso fundamental es contrastar las propiedades de la falla con el historial de actividad documentado en fallas geológicamente análogas.',
    hint: '¿Qué información comparativa ayudaría a predecir el comportamiento de una falla?',
    points: 100
  },
  {
    id: 5114, topic: 'fisica', type: 'multiple',
    question: 'Durante la formación de ciertas rocas, los minerales registran la dirección del campo magnético terrestre. Analizando esta información en placas que se han movido, ¿qué pregunta se puede responder?',
    options: [
      '¿Cuál es la composición de las rocas?',
      '¿Cuál es la velocidad actual de separación de las placas?',
      '¿Cuál es la fuerza de separación entre las placas?',
      '¿Cuál es la dirección de la rotación de las placas?'
    ],
    correct: 3,
    explanation: 'La alineación de los minerales respecto al polo norte a lo largo de millones de años revela cómo han girado físicamente los bloques rocosos.',
    hint: '¿Qué información espacial proporciona el magnetismo registrado en las rocas?',
    points: 100
  },
  {
    id: 5115, topic: 'fisica', type: 'multiple',
    question: 'Un grupo de geólogas modela la dorsal Mesoatlántica variando la velocidad de separación de placas para verificar si cambia la velocidad del flujo ascendente del magma. ¿Qué hipótesis ponen a prueba?',
    options: [
      'La actividad volcánica en Islandia depende de la velocidad de separación de las placas.',
      'La separación de placas ocurre sin afectar al manto.',
      'La velocidad del flujo de magma depende de la zona geográfica.',
      'La separación de placas ocurre por el aumento de temperatura en la corteza.'
    ],
    correct: 0,
    explanation: 'Al variar la tasa de apertura tectónica y observar cambios en la emanación de magma, se prueba si la actividad volcánica está supeditada a la dinámica de separación de placas.',
    hint: '¿Qué relación causal se está investigando?',
    points: 100
  },
  {
    id: 5116, topic: 'fisica', type: 'multiple',
    question: 'Un grupo conecta tres resistencias a una batería. Las corrientes individuales son 3 A, 2 A y 1 A, y la corriente total es 6 A. ¿Qué conclusión es correcta?',
    options: [
      'La potencia disipada es igual a la de cada resistencia.',
      'La resistencia equivalente es mayor que la mayor resistencia individual.',
      'La diferencia de potencial total es igual a la suma de las diferencias individuales.',
      'La intensidad de corriente total es igual a la suma de las intensidades en cada resistencia.'
    ],
    correct: 3,
    explanation: '3 + 2 + 1 = 6 A, lo que comprueba que la corriente total equivale a la suma de las corrientes ramificadas, propio de una conexión en paralelo.',
    hint: 'Suma las corrientes individuales y compáralas con la corriente total.',
    points: 100
  },
  {
    id: 5117, topic: 'fisica', type: 'multiple',
    question: 'En un circuito con dos resistencias, para una misma corriente de 0,1 A, la resistencia 1 registra 3,0 V y la resistencia 2 registra 2,0 V. ¿Qué inferencia es acorde con los resultados?',
    options: [
      'Están en paralelo y R1 es mayor que R2.',
      'Están en paralelo y R1 es menor que R2.',
      'Están en serie y R1 es mayor que R2.',
      'Están en serie y R1 es menor que R2.'
    ],
    correct: 2,
    explanation: 'Compartir la misma corriente con diferentes voltajes denota un arreglo en serie. Por Ley de Ohm, R1 (3,0/0,1 = 30 Ω) es mayor que R2 (2,0/0,1 = 20 Ω).',
    hint: '¿En qué tipo de conexión la corriente es la misma para todos los componentes?',
    points: 100
  },
  {
    id: 5118, topic: 'fisica', type: 'multiple',
    question: 'Se quiere estudiar cómo el área de la sección transversal de un conductor afecta su capacidad para conducir corriente. Usando una analogía con flujo de agua, ¿qué procedimiento permite estudiar esta relación?',
    options: [
      'Variar el largo del tubo y medir la temperatura.',
      'Variar el radio del tubo y medir qué tan rápido se llena el contenedor.',
      'Variar la diferencia de altura y medir la velocidad del agua.',
      'Variar el volumen de agua y medir el tiempo de llegada.'
    ],
    correct: 1,
    explanation: 'En la analogía, el radio del tubo representa el área transversal del conductor, y la rapidez de llenado equivale a la intensidad del flujo eléctrico.',
    hint: '¿Qué parámetro del tubo modifica su área transversal?',
    points: 100
  },
  {
    id: 5119, topic: 'fisica', type: 'multiple',
    question: 'Un rayo de luz pasa por tres medios con índices de refracción n₁ > n₂ > n₃. ¿Cómo se comporta el rayo refractado?',
    options: [
      'Se aleja de la normal en ambas interfaces.',
      'Se aleja de la normal y luego mantiene su dirección.',
      'Se acerca a la normal y luego se aleja de la normal.',
      'Se acerca a la normal en ambas interfaces.'
    ],
    correct: 0,
    explanation: 'Cuando la luz pasa a un medio con menor índice de refracción, el rayo refractado se aleja de la normal. Esto ocurre en ambas transiciones (1→2 y 2→3).',
    hint: '¿Qué sucede con la dirección del rayo al pasar a un medio menos denso ópticamente?',
    points: 100
  },
  {
    id: 5120, topic: 'fisica', type: 'multiple',
    question: 'Un grupo mide ángulos de incidencia y refracción de un láser al pasar por un bloque de acrílico y por agua usando un transportador. ¿Qué pregunta de investigación se responde con esta actividad?',
    options: [
      '¿Cómo varía la intensidad de la luz en dos medios diferentes?',
      '¿Cuál es la distancia recorrida por el haz en dos medios diferentes?',
      '¿Cómo cambia el ángulo de incidencia en dos medios diferentes?',
      '¿Cuál es la razón entre el ángulo de incidencia y el ángulo de refracción?'
    ],
    correct: 3,
    explanation: 'Al medir ambos ángulos con instrumental geométrico, se puede correlacionar matemáticamente mediante razones, lo que se relaciona con la Ley de Snell.',
    hint: '¿Qué ley óptica relaciona los ángulos de incidencia y refracción?',
    points: 100
  },
  {
    id: 5121, topic: 'fisica', type: 'multiple',
    question: 'Un reporte científico afirma que "aunque cambie la rapidez de propagación de una onda al pasar a otro medio, su frecuencia se mantiene constante". ¿Qué gráfico representa correctamente esta afirmación?',
    options: [
      'Gráfico A: línea diagonal creciente.',
      'Gráfico B: línea curva decreciente.',
      'Gráfico C: línea vertical (frecuencia constante para cualquier velocidad).',
      'Gráfico D: línea horizontal (velocidad constante).'
    ],
    correct: 2,
    explanation: 'Una línea vertical sobre el eje de velocidad indica que la frecuencia (eje vertical) permanece invariable independientemente de los cambios en la velocidad (eje horizontal).',
    hint: '¿Cómo se representa gráficamente un valor que no cambia?',
    points: 100
  },
  {
    id: 5122, topic: 'fisica', type: 'multiple',
    question: 'En el estudio de la caída de los cuerpos se asume ausencia de roce con el aire y aceleración constante. ¿Para qué se establecen estas condiciones?',
    options: [
      'Para fortalecer las hipótesis planteadas.',
      'Para modelar el fenómeno utilizando situaciones simplificadas.',
      'Para disminuir las mediciones asociadas.',
      'Para que los datos se ajusten mejor a los teóricos.'
    ],
    correct: 1,
    explanation: 'Despreciar variables complejas como la resistencia aerodinámica constituye una abstracción metodológica para construir un modelo simplificado y analíticamente manejable.',
    hint: '¿Qué finalidad tiene simplificar las condiciones en un modelo científico?',
    points: 100
  },
  {
    id: 5123, topic: 'fisica', type: 'multiple',
    question: 'Un cajón de masa m se mueve con aceleración constante a en línea recta. Para que continúe con velocidad constante en el mismo sentido, ¿qué fuerza debe aplicarse?',
    options: [
      '2ma en sentido contrario al movimiento.',
      'ma en sentido contrario al movimiento.',
      '2ma en el mismo sentido del movimiento.',
      'ma en el mismo sentido del movimiento.'
    ],
    correct: 1,
    explanation: 'Para anular la aceleración y lograr velocidad constante (fuerza neta cero), se debe aplicar una fuerza equilibrante de magnitud ma en dirección opuesta.',
    hint: 'Para que la fuerza neta sea cero, ¿cómo debe ser la fuerza aplicada?',
    points: 100
  },

  // ================================================================
  // EJE: QUÍMICA (28 preguntas)
  // ================================================================
  {
    id: 5201, topic: 'quimica', type: 'multiple',
    question: 'Un modelo con dos trozos de cartón (uno de alta densidad y otro de baja densidad) se presionan entre sí, quedando el de baja densidad sobre el otro. ¿Qué fenómeno tectónico representa este modelo?',
    options: ['Subducción', 'Colisión continental', 'Contacto transformante', 'Divergencia de placas'],
    correct: 0,
    explanation: 'La subducción es el fenómeno donde una placa más densa se hunde bajo un bloque menos denso al converger.',
    hint: '¿Qué ocurre cuando una placa se desliza bajo otra?',
    points: 100
  },
  {
    id: 5202, topic: 'quimica', type: 'multiple',
    question: 'Una docente enciende ampolletas LED de 9 W, 20 W y 30 W y pide a los estudiantes comparar el brillo. ¿Cuál es el objetivo de la actividad?',
    options: [
      'Comprobar que el brillo de todas las ampolletas es el mismo.',
      'Establecer una relación entre la potencia eléctrica y el brillo.',
      'Medir el consumo eléctrico de cada ampolleta.',
      'Determinar el voltaje de conexión de cada ampolleta.'
    ],
    correct: 1,
    explanation: 'La docente manipula la potencia nominal y pide evaluar la variación del brillo, buscando establecer el vínculo entre ambas magnitudes.',
    hint: '¿Qué relación se investiga al variar la potencia y observar el brillo?',
    points: 100
  },
  {
    id: 5203, topic: 'quimica', type: 'multiple',
    question: 'Un grupo midió masa y volumen de muestras de cobre para calcular su densidad. La profesora indica que hay un problema de confiabilidad. ¿Qué factor perjudicó la confiabilidad?',
    options: [
      'La cantidad de muestras utilizadas.',
      'Los valores de volúmenes registrados.',
      'El uso de un valor de densidad referencial.',
      'La procedencia de las muestras.'
    ],
    correct: 1,
    explanation: 'Los volúmenes exhiben lecturas con poca precisión instrumental (1,0 mL, 2,0 mL, 1,5 mL), lo que compromete la exactitud y fiabilidad de los cálculos.',
    hint: '¿Qué característica de las mediciones afecta su precisión?',
    points: 100
  },
  {
    id: 5204, topic: 'quimica', type: 'multiple',
    question: 'Un científico afirma que una cuchara de galio podría doblarse con el calor de las manos o "desaparecer" en una sopa caliente, ya que este metal se funde a 29,76 °C. ¿A qué componente corresponde esta afirmación?',
    options: ['A una predicción', 'A una evidencia', 'A una observación', 'A una teoría'],
    correct: 0,
    explanation: 'Es una deducción anticipada basada en propiedades termodinámicas establecidas (punto de fusión bajo), proyectando lo que ocurrirá ante escenarios futuros.',
    hint: '¿Es algo que ya ocurrió o que se espera que ocurra?',
    points: 100
  },
  {
    id: 5205, topic: 'quimica', type: 'multiple',
    question: 'Según el modelo de Bohr, a medida que el electrón está más alejado del núcleo, se requiere menor energía para separarlo. ¿Qué variables representan correctamente esta relación en un gráfico?',
    options: [
      'Variable independiente: cantidad de electrones | Variable dependiente: número de órbitas.',
      'Variable independiente: energía | Variable dependiente: cantidad de electrones.',
      'Variable independiente: número de órbitas | Variable dependiente: distancia.',
      'Variable independiente: distancia del electrón al núcleo | Variable dependiente: energía.'
    ],
    correct: 3,
    explanation: 'La distancia del electrón al núcleo (causa) determina la energía requerida para separarlo (efecto).',
    hint: '¿Cuál es la causa y cuál es el efecto en esta relación?',
    points: 100
  },
  {
    id: 5206, topic: 'quimica', type: 'multiple',
    question: 'En una tabla de especies químicas, la especie X tiene 16 protones y 17 electrones. ¿Qué inferencia es correcta?',
    options: [
      'La especie R es un anión.',
      'La especie J es un catión.',
      'La especie X es un anión.',
      'La especie Z es un átomo neutro.'
    ],
    correct: 2,
    explanation: 'Un anión posee un exceso neto de electrones respecto a sus protones. La especie X tiene 16 protones y 17 electrones, por lo que es un anión.',
    hint: '¿Qué tipo de ion tiene más electrones que protones?',
    points: 100
  },
  {
    id: 5207, topic: 'quimica', type: 'multiple',
    question: 'En la molécula de estireno (anillo bencénico unido a un vinilo), ¿cuál es el número correcto de enlaces?',
    options: [
      'σ(C-C): 6 | π(C-C): 1 | σ(C-H): 5',
      'σ(C-C): 4 | π(C-C): 6 | σ(C-H): 7',
      'σ(C-C): 8 | π(C-C): 3 | σ(C-H): 7',
      'σ(C-C): 8 | π(C-C): 1 | σ(C-H): 8'
    ],
    correct: 2,
    explanation: 'La estructura del estireno tiene 8 enlaces simples σ entre carbonos, 3 enlaces π en los dobles enlaces conjugados y 7 enlaces σ carbono-hidrógeno.',
    hint: 'Cuenta los enlaces simples y dobles en la estructura del estireno.',
    points: 100
  },
  {
    id: 5208, topic: 'quimica', type: 'multiple',
    question: '¿Cuál es el nombre correcto, según la IUPAC, de un compuesto con cadena principal de 7 carbonos, grupo carbonilo terminal y sustituyentes metilo en posiciones 3 y 6?',
    options: [
      '3,6-dimetilheptanal',
      '3-metil-5-isopropilpentanona',
      '3-butil-3-butanal',
      '3,6-dimetilheptanona'
    ],
    correct: 0,
    explanation: 'La cadena de 7 carbonos con grupo carbonilo terminal (aldehído, sufijo "-al") y metilos en posiciones 3 y 6 se nombra 3,6-dimetilheptanal.',
    hint: '¿Qué sufijo usa la IUPAC para los aldehídos?',
    points: 100
  },
  {
    id: 5209, topic: 'quimica', type: 'multiple',
    question: 'Un grupo evalúa cambios en propiedades de aceites al variar la temperatura usando 50 g de cada uno. ¿Qué componente del experimento se podría cambiar sin afectar la reproducibilidad?',
    options: [
      'El tipo de aceite evaluado.',
      'La propiedad física estudiada.',
      'La masa utilizada de cada aceite.',
      'La temperatura a la que se mide la densidad.'
    ],
    correct: 2,
    explanation: 'La densidad es una propiedad intensiva: su magnitud no depende de la cantidad de masa analizada. Variar los 50 g iniciales no altera los valores de densidad obtenidos.',
    hint: '¿Qué tipo de propiedad no depende de la cantidad de materia?',
    points: 100
  },
  {
    id: 5210, topic: 'quimica', type: 'multiple',
    question: 'Un estudiante grafica una propiedad X para compuestos orgánicos. Al desplazarse hacia la izquierda (de 9 a 3 átomos de carbono), la curva describe una trayectoria descendente. ¿Qué afirmación es correcta?',
    options: [
      'A medida que aumenta el número de átomos de carbono, X es menor que cero.',
      'La propiedad X disminuye a medida que disminuye la temperatura.',
      'A medida que disminuye el número de átomos de carbono, la propiedad X disminuye.',
      'La propiedad X se mantiene constante para compuestos con más de 8 átomos de carbono.'
    ],
    correct: 2,
    explanation: 'Al reducir la cantidad de átomos de carbono, el valor de la propiedad X desciende progresivamente.',
    hint: 'Observa la dirección de la curva al moverse por el eje horizontal.',
    points: 100
  },
  {
    id: 5211, topic: 'quimica', type: 'multiple',
    question: 'Se muestran datos de producción de hidrógeno verde a partir de agua usando cuatro métodos. Método 3: 1,5 mol H₂ con 15 L de agua. ¿Cuál método presenta mayor eficiencia?',
    options: ['Método 1', 'Método 2', 'Método 3', 'Método 4'],
    correct: 2,
    explanation: 'La eficiencia se calcula como mol/L: M3 = 1,5/15 = 0,10 mol/L, el mayor coeficiente relativo entre los cuatro métodos.',
    hint: 'Divide los moles obtenidos entre el volumen de agua utilizado.',
    points: 100
  },
  {
    id: 5212, topic: 'quimica', type: 'multiple',
    question: 'En la reacción N₂(g) + 2 O₂(g) → 2 NO₂(g), ¿qué predicción es correcta según la ley de conservación de la materia?',
    options: [
      'En cada ensayo, la masa de NO₂ será igual a la suma de masas de N₂ y O₂.',
      'Cuando reaccionen completamente, la suma de masas de reactivos será igual a la masa de NO₂.',
      'Al aumentar O₂ manteniendo N₂ constante, la masa de NO₂ siempre aumentará.',
      'Para masa constante de NO₂, la masa de N₂ debe ser inversamente proporcional a la de O₂.'
    ],
    correct: 1,
    explanation: 'Por la ley de conservación de la materia, cuando todos los reactivos se transforman completamente, la masa del producto es igual a la suma de las masas de los reactivos.',
    hint: '¿Qué establece la ley de conservación de la materia?',
    points: 100
  },
  {
    id: 5213, topic: 'quimica', type: 'multiple',
    question: 'Si se dispone de 6,02 × 10²³ moléculas (1 mol) de cada compuesto, ¿cuál tiene la mayor masa? (Masas atómicas: H=1, C=12, N=14, O=16, F=19, Be=9)',
    options: ['H₂O', 'NH₃', 'CH₄', 'HF'],
    correct: 3,
    explanation: 'Masas molares: H₂O=18, NH₃=17, CH₄=16, HF=20 g/mol. El fluoruro de hidrógeno (HF) tiene la mayor masa molar.',
    hint: 'Calcula la masa molar de cada compuesto sumando las masas atómicas.',
    points: 100
  },
  {
    id: 5214, topic: 'quimica', type: 'multiple',
    question: '¿Cuál de los siguientes compuestos tiene la menor masa relativa de nitrógeno? (Masas: N=14, O=16)',
    options: ['NO', 'N₃O₅', 'N₂O', 'NO₂'],
    correct: 3,
    explanation: 'NO₂: la proporción de nitrógeno es 14/(14+32) = 14/46 ≈ 30,4%, la menor entre las opciones.',
    hint: 'Divide la masa de nitrógeno entre la masa total del compuesto.',
    points: 100
  },
  {
    id: 5215, topic: 'quimica', type: 'multiple',
    question: 'Un grupo prepara soluciones de KMnO₄ con concentraciones de 1,0; 0,2; 0,01 y 0,002 mol/L manteniendo constantes volumen, agitación, luz y temperatura. ¿Qué hipótesis es pertinente?',
    options: [
      'El tiempo de agitación afecta la tonalidad del color.',
      'La variación de la concentración afecta la tonalidad del color.',
      'El tiempo de exposición a la luz solar afecta la tonalidad.',
      'La variación de la temperatura cambia la tonalidad.'
    ],
    correct: 1,
    explanation: 'El único parámetro manipulado es la concentración molar, buscando observar su efecto en la tonalidad cromática resultante.',
    hint: '¿Cuál es la única variable que cambia entre las soluciones?',
    points: 100
  },
  {
    id: 5216, topic: 'quimica', type: 'multiple',
    question: 'Una profesora pide preparar una solución de glucosa 6 mol/L. Un estudiante disuelve 108 g de glucosa (masa molar 180 g/mol) en 100 mL de agua, pero el procedimiento es incorrecto. ¿Cuál es el procedimiento adecuado?',
    options: [
      'Disolver 108 g en 0,5 L de agua y agregar 0,5 L de agua.',
      'Agregar 100 g de agua a los 108 g de glucosa.',
      'Agregar agua sobre los 108 g de glucosa hasta completar un volumen de 100 mL.',
      'Disolver 108 g, tomar 2 mL y disolver en 100 mL de agua.'
    ],
    correct: 2,
    explanation: '108 g = 0,6 moles. Para 6 mol/L se requiere un volumen total de 0,1 L (100 mL). Se debe aforar agregando solvente hasta completar exactamente 100 mL.',
    hint: '¿El volumen final debe ser exactamente 100 mL o se debe agregar 100 mL de agua?',
    points: 100
  },
  {
    id: 5217, topic: 'quimica', type: 'multiple',
    question: '¿Cuál es la concentración de una solución acuosa que contiene 1,0 mol de NaCl en 500 mL de solución?',
    options: ['2,0 mol/L', '1,5 mol/L', '1,0 mol/L', '0,5 mol/L'],
    correct: 0,
    explanation: 'Molaridad = moles / volumen (L) = 1,0 mol / 0,5 L = 2,0 mol/L.',
    hint: 'Convierte los mL a litros antes de dividir.',
    points: 100
  },
  {
    id: 5218, topic: 'quimica', type: 'multiple',
    question: 'Un grupo quemó una muestra, obtuvo CO₂ y H₂O, los masó, calculó C e H, determinó O por diferencia y estableció la fórmula empírica. ¿A qué componente corresponde esta descripción?',
    options: ['A un resultado', 'A una conclusión', 'A una predicción', 'A un procedimiento'],
    correct: 3,
    explanation: 'El texto detalla cronológicamente las acciones técnicas ejecutadas (quemar, masar, calcular), lo que constituye la descripción de un procedimiento experimental.',
    hint: '¿Describe acciones realizadas o interpretaciones de los datos?',
    points: 100
  },
  {
    id: 5219, topic: 'quimica', type: 'multiple',
    question: 'En una clase, se realizan ensayos de solubilidad con muestras W, X, Y, Z. X+Z produce dos fases; X+Y produce una fase homogénea. Al mezclar X, Y y Z, ¿qué se observará?',
    options: [
      'Tres fases separadas.',
      'Una sola fase homogénea.',
      'Dos fases: X+Y juntos y Z separado.',
      'Dos fases: X+Z juntos y Y separado.'
    ],
    correct: 2,
    explanation: 'X e Y son miscibles entre sí (forman una fase), mientras que Z es inmiscible con X (y por tanto con la mezcla X+Y), por lo que Z quedará como una fase separada.',
    hint: '¿Qué sustancias son miscibles entre sí según los ensayos previos?',
    points: 100
  },
  {
    id: 5220, topic: 'quimica', type: 'multiple',
    question: 'En la producción de carbonato de litio se estudian parámetros en cuatro ensayos. Los ensayos 1 y 3 comparten velocidad de agitación (150 rpm) y concentración (2 mol/L), variando solo la temperatura (25 °C vs 45 °C). ¿Qué relación permite este análisis?',
    options: [
      'Relacionar ensayos 1 y 3 permite analizar el efecto de la velocidad de agitación.',
      'Relacionar ensayos 2 y 3 permite analizar el efecto de la concentración.',
      'Relacionar ensayos 1 y 3 permite analizar el efecto de la temperatura.',
      'Relacionar ensayos 1 y 4 permite analizar el efecto de la concentración.'
    ],
    correct: 2,
    explanation: 'Al compartir todos los parámetros excepto la temperatura, los ensayos 1 y 3 permiten aislar y analizar exclusivamente el efecto de la temperatura.',
    hint: '¿Qué variable es la única que difiere entre los ensayos 1 y 3?',
    points: 100
  },
  {
    id: 5221, topic: 'quimica', type: 'multiple',
    question: 'Un grupo hace mezclas con agua, aceite, témpera, vitamina C y harina. La Preparación 1 muestra "dos fases inmiscibles" y la Preparación 4 da "una masa blanca con múltiples grumos". ¿Qué afirmación es correcta?',
    options: [
      'En las preparaciones 1 y 4 se formaron mezclas heterogéneas.',
      'En las preparaciones 2 y 3 se formaron nuevos compuestos.',
      'En las preparaciones 2 y 4 se formaron mezclas homogéneas.',
      'En las preparaciones 1 y 3 se formaron nuevas sustancias.'
    ],
    correct: 0,
    explanation: 'Una mezcla heterogénea tiene componentes distinguibles visualmente. Dos fases inmiscibles y una masa con grumos son ejemplos de sistemas heterogéneos.',
    hint: '¿Qué caracteriza a una mezcla heterogénea?',
    points: 100
  },
  {
    id: 5222, topic: 'quimica', type: 'multiple',
    question: 'Una mezcla contiene cristales de NaCl, agua destilada y aceite de oliva. Al agitar, el aceite se separa del agua y los cristales de NaCl se disuelven. ¿Qué procedimiento permite recuperar el NaCl?',
    options: [
      'Evaporar el agua y luego separar las partículas del aceite por tamizado.',
      'Separar el aceite por decantación y luego evaporar el agua.',
      'Filtrar las partículas sólidas y luego decantar el agua del aceite.',
      'Tamizar el aceite y luego filtrar las partículas del agua.'
    ],
    correct: 1,
    explanation: 'El aceite (inmiscible) se separa primero por decantación. Luego, la evaporación del agua permite recuperar los cristales de NaCl disueltos.',
    hint: '¿En qué orden deben separarse los componentes según sus propiedades?',
    points: 100
  },
  {
    id: 5223, topic: 'quimica', type: 'multiple',
    question: 'Un grupo investiga cómo diferenciar funciones orgánicas mediante ensayos químicos. ¿Qué recurso de comunicación es adecuado para informar los resultados?',
    options: [
      'Una reseña científica sobre las propiedades de las funciones orgánicas.',
      'Un modelo científico de las reacciones de los compuestos.',
      'Un esquema de la relación entre funciones orgánicas y sus reacciones.',
      'Una tabla que muestre para cada compuesto la sustancia con que reacciona y los aspectos observables.'
    ],
    correct: 3,
    explanation: 'Una tabla comparativa vincula cada grupo funcional con su reactivo específico y el cambio físico observable, siendo la herramienta óptima para sistematizar esta información.',
    hint: '¿Qué formato permite comparar fácilmente múltiples compuestos y sus reacciones?',
    points: 100
  },
  {
    id: 5224, topic: 'quimica', type: 'multiple',
    question: '¿Cuál de las siguientes representaciones corresponde a una amida?',
    options: [
      'HC(=O)-OH',
      'HC(=O)-CH₃',
      'HC(=O)-O-CH₃',
      'H₃C-C(=O)-NH₂'
    ],
    correct: 3,
    explanation: 'La función amida se identifica por el grupo carbonilo enlazado a un nitrógeno (R-C(=O)-NR\'R\'\'). La opción D muestra esta conectividad (acetamida).',
    hint: '¿Qué átomo está unido al carbonilo en una amida?',
    points: 100
  },
  {
    id: 5225, topic: 'quimica', type: 'multiple',
    question: 'Un grupo simula condiciones de lanzamiento espacial. Según los datos, la relación Al/HCl es 1,0/0,6 = 5/3. ¿Cuántos moles de Al se necesitan para producir exactamente 3 mol de HCl?',
    options: ['2,0 mol', '3,0 mol', '4,0 mol', '5,0 mol'],
    correct: 3,
    explanation: 'Aplicando la proporción: 3 mol HCl × (5 mol Al / 3 mol HCl) = 5,0 mol de Al.',
    hint: 'Usa la relación estequiométrica como factor de conversión.',
    points: 100
  },
  {
    id: 5226, topic: 'quimica', type: 'multiple',
    question: 'Un grupo combina 2,0 g de azufre con 3,0, 3,5 y 4,0 g de hierro, obteniendo 4,7, 5,5 y 5,5 g de producto. La masa se estanca en 5,5 g. ¿Qué inferencia es correcta?',
    options: [
      'Si reaccionan 4,0 g de azufre con 7,0 g de hierro, no quedará reactivo en exceso.',
      'Si reacciona 1,0 g de azufre con 2,0 g de hierro, no quedará reactivo en exceso.',
      'Con 6,0 g de hierro y 2,0 g de azufre, el hierro será el reactivo limitante.',
      'Con 2,0 g de hierro y 2,0 g de azufre, el azufre será el reactivo limitante.'
    ],
    correct: 0,
    explanation: 'La relación estequiométrica exacta es 2,0 g S : 3,5 g Fe. Duplicando proporcionalmente a 4,0 g S y 7,0 g Fe, ambos reactivos se consumirán completamente.',
    hint: '¿Cuál es la proporción exacta en la que reaccionan el azufre y el hierro?',
    points: 100
  },
  {
    id: 5227, topic: 'quimica', type: 'multiple',
    question: 'Una empresa observa que al aumentar la cantidad de quitamanchas añadida, la capacidad limpiadora aumenta, pero después de cierta cantidad deja de aumentar. ¿Qué gráfico muestra correctamente estos resultados?',
    options: [
      'Gráfico A: línea siempre creciente.',
      'Gráfico B: línea que crece y luego se estabiliza en una meseta horizontal.',
      'Gráfico C: línea siempre decreciente.',
      'Gráfico D: línea que decrece y luego se estabiliza.'
    ],
    correct: 1,
    explanation: 'El comportamiento descrito (aumento inicial seguido de estabilización) corresponde a una curva con pendiente positiva que luego forma una meseta horizontal.',
    hint: '¿Cómo se representa gráficamente un valor que crece y luego se mantiene constante?',
    points: 100
  },
  {
    id: 5228, topic: 'quimica', type: 'multiple',
    question: '¿Qué volumen de disolución 1,50 mol/L de KOH se necesita para obtener 0,15 mol de KOH?',
    options: ['0,100 mL', '0,225 mL', '10,0 mL', '100 mL'],
    correct: 3,
    explanation: 'Volumen = moles / Molaridad = 0,15 mol / 1,50 mol/L = 0,1 L = 100 mL.',
    hint: 'Despeja el volumen de la fórmula de molaridad.',
    points: 100
  }
];

// ============================================================================
// EXPORTACIÓN
// ============================================================================
const paesBancoCiencias = {
  version: "1.0.0",
  totalQuestions: paesCienciasQuestions.length,
  questions: paesCienciasQuestions
};

console.log('🔬 Banco de Ciencias cargado: ' + paesCienciasQuestions.length + ' preguntas');
