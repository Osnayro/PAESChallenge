/**
 * ============================================================
 * PAES CHALLENGE — BANCO DE COMPETENCIA MATEMÁTICA 1 (M1)
 * Banco completo de 100 preguntas alineado al temario DEMRE
 * Ejes: Números, Álgebra y Funciones, Geometría, Probabilidad y Estadística
 * ============================================================
 */

const paesM1Questions = [
  // ================================================================
  // EJE 1: NÚMEROS (Preguntas 1 a 25)
  // ================================================================
  {
    id: 1, topic: 'numeros', type: 'multiple',
    question: 'Un termómetro marcaba -4 °C a las 6:00 a.m. Si la temperatura subió 2 °C cada hora durante 5 horas consecutivas, ¿qué temperatura marcaba a las 11:00 a.m.?',
    options: ['4 °C', '6 °C', '8 °C', '10 °C'],
    correct: 1,
    explanation: 'Aumento total = 5 h × 2 °C/h = 10 °C. Temperatura final = -4 + 10 = 6 °C.',
    hint: 'Multiplica la cantidad de horas por el aumento horario y súmalo a la temperatura inicial.',
    points: 100
  },
  {
    id: 2, topic: 'numeros', type: 'multiple',
    question: 'Para preparar una receta se necesitan 700 g de carne picada, 1 kg de champiñones y 2 cebollas. Los precios son: 100 g de carne = $900, 0,5 kg de champiñones = $3.500, 1 cebolla = $200. ¿Cuánto dinero se necesita para comprar los ingredientes?',
    options: ['$4.600', '$8.100', '$10.000', '$13.700'],
    correct: 3,
    explanation: 'Carne: 7 × $900 = $6.300. Champiñones: 2 × $3.500 = $7.000. Cebollas: 2 × $200 = $400. Total = 6.300 + 7.000 + 400 = $13.700.',
    hint: 'Calcula por separado el costo de cada ingrediente según la cantidad necesaria.',
    points: 100
  },
  {
    id: 3, topic: 'numeros', type: 'multiple',
    question: 'Un auto recorre 5 km de A a B y 25 km de B a C. Rinde 10 km por litro. ¿Cuántos litros necesita para ir de A a C, ida y vuelta, pasando por B?',
    options: ['2', '3', '4', '6'],
    correct: 3,
    explanation: 'Distancia ida (A→B→C) = 5 + 25 = 30 km. Ida y vuelta = 60 km. Consumo = 60 / 10 = 6 litros.',
    hint: 'Calcula la distancia total del trayecto completo y divídela por el rendimiento.',
    points: 100
  },
  {
    id: 4, topic: 'numeros', type: 'multiple',
    question: '¿Cuál es el número cuya tercera parte es 0,09?',
    options: ['2,7', '0,3', '0,27', '0,03'],
    correct: 2,
    explanation: 'Sea x el número: x / 3 = 0,09 ⟹ x = 0,09 × 3 = 0,27.',
    hint: 'Multiplica 0,09 por 3 para encontrar el número original.',
    points: 100
  },
  {
    id: 5, topic: 'numeros', type: 'multiple',
    question: 'Para resolver - (4/6 × -8/12) + (2/30 + 2/60 - 4/10), una persona realiza un procedimiento en 4 pasos. En el Paso 2 afirma que (4/6 × -8/12) es igual a 1. ¿En cuál paso cometió el error?',
    options: ['Paso 1', 'Paso 2', 'Paso 3', 'Paso 4'],
    correct: 1,
    explanation: '(4/6) × (-8/12) = (2/3) × (-2/3) = -4/9, lo cual es distinto de 1. El error se cometió en el Paso 2.',
    hint: 'Calcula correctamente el producto dentro del primer paréntesis.',
    points: 150
  },
  {
    id: 6, topic: 'numeros', type: 'multiple',
    question: 'Una escalera tiene 20 peldaños entre piso y piso, cada uno de 15 cm de altura. Si n es la cantidad de peldaños subidos, ¿qué condición garantiza que la persona completó un número entero de pisos?',
    options: ['15 + n es divisible por 20', 'n es divisible por 20', '15 · n es divisible por 300', '15 + n es divisible por 300'],
    correct: 2,
    explanation: 'Un piso equivale a 20 peldaños = 300 cm. La altura alcanzada es 15n cm. Para completar pisos enteros, 15n debe ser múltiplo de 300.',
    hint: 'Calcula la altura total de un piso (300 cm) y compárala con la altura acumulada 15n.',
    points: 150
  },
  {
    id: 7, topic: 'numeros', type: 'multiple',
    question: 'Una calculadora tiene botones para agregar dos ceros (00) o tres ceros (000). ¿Cuál acción permite formar el número 10¹⁰ a partir del número 1?',
    options: ['1 y siete veces 000', '1 y ocho veces 00', '1, dos veces 000 y dos veces 00', '1, tres veces 000 y una vez 00'],
    correct: 2,
    explanation: '10¹⁰ es un 1 seguido de 10 ceros. Dos veces "000" agrega 6 ceros y dos veces "00" agrega 4 ceros (6 + 4 = 10 ceros).',
    hint: 'Cuenta cuántos ceros en total agrega cada combinación.',
    points: 100
  },
  {
    id: 8, topic: 'numeros', type: 'multiple',
    question: 'Al factorizar la expresión 2²·3 + 2²·5, una persona indica en el Paso 4 que el resultado es 2⁴(3+5). ¿En cuál paso cometió el error?',
    options: ['Paso 1', 'Paso 2', 'Paso 3', 'Paso 4'],
    correct: 3,
    explanation: 'Al extraer el factor común 2², se obtiene 2²(3+5) = 4(8) = 32, no 2⁴(3+5). El error está en el Paso 4.',
    hint: 'El factor común término a término es 2², no 2⁴.',
    points: 150
  },
  {
    id: 9, topic: 'numeros', type: 'multiple',
    question: 'Leonardo elige el número 2. Saca una tarjeta blanca: "Disminuye el número en cinco unidades" y luego una gris: "Eleva el resultado al cubo". ¿Qué expresión aplica correctamente las instrucciones?',
    options: ['(2 - 5)³', '3 · (2 - 5)', '3 · (5 - 2)', '(5 - 2)³'],
    correct: 0,
    explanation: 'Primero se resta 5 al número 2: (2 - 5). Luego se eleva el resultado al cubo: (2 - 5)³.',
    hint: 'Aplica las operaciones en el orden descrito.',
    points: 100
  },
  {
    id: 10, topic: 'numeros', type: 'multiple',
    question: 'Si p es el 25% de k, ¿qué expresión representa el valor de k?',
    options: ['p / 25', 'p / 75', '(100 · p) / 75', '(100 · p) / 25'],
    correct: 3,
    explanation: 'p = (25 / 100) · k ⟹ k = (100 · p) / 25 = 4p.',
    hint: 'Despeja k de la ecuación de porcentaje.',
    points: 100
  },
  {
    id: 11, topic: 'numeros', type: 'multiple',
    question: '¿Cuánto es el 75% del 75% de 100?',
    options: ['5625', '150', '56,25', '1,5'],
    correct: 2,
    explanation: '0,75 × 0,75 × 100 = 0,5625 × 100 = 56,25.',
    hint: 'Convierte los porcentajes a decimales y multiplica por 100.',
    points: 100
  },
  {
    id: 12, topic: 'numeros', type: 'multiple',
    question: 'En 2022, 3.000 millones de personas jugaban videojuegos. En 2023 esta cifra aumentó en 120 millones. ¿Cuál es el porcentaje de aumento?',
    options: ['2,5%', '4%', '25%', '40%'],
    correct: 1,
    explanation: 'Porcentaje de aumento = (120 / 3000) × 100% = 0,04 × 100% = 4%.',
    hint: 'Divide la cantidad del incremento entre el valor base original.',
    points: 100
  },
  {
    id: 13, topic: 'numeros', type: 'multiple',
    question: 'En 2021 se generaron 80.155 GWh de electricidad, lo que representó un 4,5% más que en 2020. ¿Qué expresión representa la electricidad generada en 2020?',
    options: ['80.155 / 104,5', '(80.155 · 100) / 104,5', '(80.155 · 104,5) / 100', '80.155 / (104,5 · 100)'],
    correct: 1,
    explanation: 'Sea E el valor de 2020. E · (104,5 / 100) = 80.155 ⟹ E = (80.155 · 100) / 104,5.',
    hint: 'El valor de 2021 corresponde al 104,5% de la producción de 2020.',
    points: 150
  },
  {
    id: 14, topic: 'numeros', type: 'multiple',
    question: 'Un producto costaba $25.000. Se rebaja un 20% y luego se le aplica un 25% de descuento adicional sobre el precio ya rebajado. ¿Qué expresión representa el precio final?',
    options: ['0,2 × 0,25 × 25.000', '(0,2 + 0,25) × 25.000', '0,8 × 0,75 × 25.000', '(0,8 + 0,75) × 25.000'],
    correct: 2,
    explanation: 'Tras el 20% de descuento se paga el 80% (0,8). Tras el 25% de descuento adicional se paga el 75% (0,75). Precio = 0,8 × 0,75 × 25.000.',
    hint: 'Calcula el factor de pago final asociando multiplicativamente cada descuento.',
    points: 100
  },
  {
    id: 15, topic: 'numeros', type: 'multiple',
    question: 'El sueldo líquido mensual de una persona es $M. Gasta 3/5 de su sueldo y ahorra el resto. ¿Cuál es el ahorro total en 12 meses?',
    options: ['(2/5)M', '(24/5)M', '(36/5)M', '(57/5)M'],
    correct: 1,
    explanation: 'Ahorro mensual = M - (3/5)M = (2/5)M. Ahorro anual = 12 × (2/5)M = (24/5)M.',
    hint: 'Calcula primero la fracción que ahorra al mes y multiplica por 12.',
    points: 100
  },
  {
    id: 16, topic: 'numeros', type: 'multiple',
    question: 'José tiene 90 dulces y se queda con 18. Reparte el resto en partes iguales entre 8 amigos. ¿Cuántos dulces recibe cada amigo?',
    options: ['8', '9', '10', '11'],
    correct: 1,
    explanation: 'Dulces a repartir = 90 - 18 = 72. Cada amigo recibe: 72 ÷ 8 = 9.',
    hint: 'Resta los dulces que conserva José antes de dividir.',
    points: 100
  },
  {
    id: 17, topic: 'numeros', type: 'multiple',
    question: 'Si 30 corresponde al 20% de una cantidad X, ¿cuál es el valor de X?',
    options: ['6', '50', '150', '600'],
    correct: 2,
    explanation: '0,20 · X = 30 ⟹ X = 30 / 0,20 = 150.',
    hint: 'Divide 30 entre 0,20 o multiplica por 5.',
    points: 100
  },
  {
    id: 18, topic: 'numeros', type: 'multiple',
    question: '¿Cuál es el resultado de reducir la expresión (2² · 2³)² / 2⁴?',
    options: ['2⁴', '2⁶', '2⁸', '2¹⁰'],
    correct: 1,
    explanation: '(2² · 2³)² / 2⁴ = (2⁵)² / 2⁴ = 2¹⁰ / 2⁴ = 2⁶.',
    hint: 'Aplica las propiedades de potencias de igual base.',
    points: 100
  },
  {
    id: 19, topic: 'numeros', type: 'multiple',
    question: 'Una persona recorre 2/5 de un camino el primer día y 1/3 del resto el segundo día. ¿Qué fracción del camino total le falta por recorrer?',
    options: ['2/5', '1/5', '4/15', '2/15'],
    correct: 0,
    explanation: 'Queda tras día 1: 1 - 2/5 = 3/5. Día 2 recorre: (1/3) × (3/5) = 1/5. Total recorrido = 2/5 + 1/5 = 3/5. Le falta: 1 - 3/5 = 2/5.',
    hint: 'Calcula la fracción sobrante tras el primer día.',
    points: 150
  },
  {
    id: 20, topic: 'numeros', type: 'multiple',
    question: 'Si la raíz cuadrada de x es igual a 8, ¿cuál es el valor de x + 5?',
    options: ['13', '69', '64', '37'],
    correct: 1,
    explanation: '√x = 8 ⟹ x = 64. Luego: x + 5 = 64 + 5 = 69.',
    hint: 'Eleva 8 al cuadrado para hallar x y luego suma 5.',
    points: 100
  },
  {
    id: 21, topic: 'numeros', type: 'multiple',
    question: '¿Cuál es el valor numérico de (-3)³ + (-2)² - (-1)⁵?',
    options: ['-22', '-24', '-30', '-28'],
    correct: 0,
    explanation: '(-3)³ = -27, (-2)² = 4, (-1)⁵ = -1. Calculando: -27 + 4 - (-1) = -27 + 4 + 1 = -22.',
    hint: 'Ten cuidado con el signo al elevar bases negativas a exponentes pares o impares.',
    points: 100
  },
  {
    id: 22, topic: 'numeros', type: 'multiple',
    question: 'Tres barras de hierro miden 12 m, 18 m y 24 m. Se quieren cortar en trozos de igual longitud, la mayor posible y sin sobrantes. ¿Cuánto medirá cada trozo?',
    options: ['3 m', '6 m', '12 m', '4 m'],
    correct: 1,
    explanation: 'Calculamos el MCD(12, 18, 24) = 6. Cada trozo medirá 6 m.',
    hint: 'Calcula el Máximo Común Divisor entre las tres longitudes.',
    points: 100
  },
  {
    id: 23, topic: 'numeros', type: 'multiple',
    question: 'Si el precio de una polera se aumenta en un 10% y luego al nuevo precio se le aplica un descuento del 10%, ¿qué ocurre con el precio final respecto al inicial?',
    options: ['Aumenta un 1%', 'Disminuye un 1%', 'Se mantiene igual', 'Disminuye un 2%'],
    correct: 1,
    explanation: 'P_final = P × (1 + 0,10) × (1 - 0,10) = P × 1,10 × 0,90 = 0,99 P. Esto representa una disminución del 1%.',
    hint: 'Multiplica los factores de variación 1,10 y 0,90.',
    points: 150
  },
  {
    id: 24, topic: 'numeros', type: 'multiple',
    question: '¿A cuál de los siguientes números decimales equivale la fracción 7/8?',
    options: ['0,875', '0,78', '0,825', '0,85'],
    correct: 0,
    explanation: '7 ÷ 8 = 0,875.',
    hint: 'Realiza la división directa del numerador entre el denominador.',
    points: 100
  },
  {
    id: 25, topic: 'numeros', type: 'multiple',
    question: 'Si a = 3,2 × 10⁶ y b = 8 × 10³, ¿cuál es el valor de a / b escrito en notación científica?',
    options: ['4 × 10²', '4 × 10³', '0,4 × 10³', '40 × 10¹'],
    correct: 0,
    explanation: '(3,2 / 8) × (10⁶ / 10³) = 0,4 × 10³ = 4 × 10².',
    hint: 'Divide los coeficientes y resta los exponentes de la base 10.',
    points: 100
  },

  // ================================================================
  // EJE 2: ÁLGEBRA Y FUNCIONES (Preguntas 26 a 50)
  // ================================================================
  {
    id: 26, topic: 'algebra', type: 'multiple',
    question: 'El ingreso I(x) y la ganancia G(x) de una empresa se modelan como I(x) = 1000x + 600.000 y G(x) = 750x + 450.000. Si G(x) = I(x) - C(x), ¿cuál es la función de costo C(x)?',
    options: ['C(x) = 250x + 150.000', 'C(x) = 250x - 150.000', 'C(x) = 1750x - 1.050.000', 'C(x) = 1750x + 1.050.000'],
    correct: 0,
    explanation: 'C(x) = I(x) - G(x) = (1000x + 600.000) - (750x + 450.000) = 250x + 150.000.',
    hint: 'Despeja C(x) de la relación G(x) = I(x) - C(x).',
    points: 100
  },
  {
    id: 27, topic: 'algebra', type: 'multiple',
    question: 'Una pista rectangular mide (3x+4) m de largo y (2x-9) m de ancho. Se disponen de (20x+20) m de cinta para demarcar todo el borde. ¿Cuántos metros de cinta sobran?',
    options: ['(10x+30) m', '(10x+10) m', '(15x+15) m', '(15x+25) m'],
    correct: 0,
    explanation: 'Perímetro = 2(3x + 4) + 2(2x - 9) = 10x - 10. Sobran: (20x + 20) - (10x - 10) = 10x + 30.',
    hint: 'Calcula el perímetro sumando el doble del largo más el doble del ancho y réstalo a la cinta total.',
    points: 150
  },
  {
    id: 28, topic: 'algebra', type: 'multiple',
    question: 'Para un glaseado se mezclan gotas rojas y amarillas en razón 3:5. Si se usan 30 gotas amarillas, ¿cuántas gotas rojas se necesitan?',
    options: ['18', '28', '30', '32'],
    correct: 0,
    explanation: 'Rojo / Amarillo = 3 / 5 ⟹ Rojo / 30 = 3 / 5 ⟹ Rojo = (3 × 30) / 5 = 18.',
    hint: 'Plantea una proporción R/A = 3/5.',
    points: 100
  },
  {
    id: 29, topic: 'algebra', type: 'multiple',
    question: 'La cantidad p (en kg) de comida para un perro se modela como p = m · 0,025, donde m es la masa del perro en kg. ¿Cómo se interpreta el valor 0,025 en este contexto?',
    options: [
      '25 gramos de alimento por cada kg de masa del perro',
      '250 gramos de alimento por cada kg de masa del perro',
      'La masa del perro es 25 veces la cantidad de alimento',
      'La masa del perro es 250 veces la cantidad de alimento'
    ],
    correct: 0,
    explanation: '0,025 kg equivalen a 25 gramos. Significa que por cada kg de masa corporal se requieren 25 g de alimento.',
    hint: 'Convierte 0,025 kg a gramos multiplicando por 1000.',
    points: 100
  },
  {
    id: 30, topic: 'algebra', type: 'multiple',
    question: 'Cada 4 galletas aportan 180 kcal. Una persona consumió x galletas y un jugo de 90 kcal, ingiriendo 405 kcal en total. ¿Cuántas galletas consumió?',
    options: ['2', '7', '9', '11'],
    correct: 1,
    explanation: 'Calorías de galletas = 45 por galleta. Ecuación: 45x + 90 = 405 ⟹ 45x = 315 ⟹ x = 7.',
    hint: 'Determina las calorías aportadas por una sola galleta.',
    points: 100
  },
  {
    id: 31, topic: 'algebra', type: 'multiple',
    question: 'Daniela compra 7 lápices y le sobran $900. Marcos compra 6 lápices del mismo precio y le sobran $2.330. Si ambos tenían la misma cantidad de dinero, ¿cuál es el precio de cada lápiz?',
    options: ['$110', '$248', '$1.430', '$3.230'],
    correct: 2,
    explanation: 'Sea P el precio del lápiz: 7P + 900 = 6P + 2330 ⟹ P = 1430.',
    hint: 'Iguala la cantidad total de dinero de Daniela y Marcos.',
    points: 100
  },
  {
    id: 32, topic: 'algebra', type: 'multiple',
    question: 'Los nacimientos en tres años consecutivos son: 2019 = 5x+4, 2020 = 3x+5, 2021 = x+2. Si la cantidad de 2019 fue menor que la suma de 2020 y 2021, ¿qué desigualdad representa esta situación?',
    options: ['5x+4 < 4x+7', '5x+4 < 2x+7', '5x+4 > 2x+7', '5x+4 > 4x+7'],
    correct: 0,
    explanation: 'Suma 2020 + 2021 = (3x+5) + (x+2) = 4x+7. La condición 2019 < (2020 + 2021) es 5x+4 < 4x+7.',
    hint: 'Suma las expresiones de 2020 y 2021 y plantea la inecuación "menor que".',
    points: 100
  },
  {
    id: 33, topic: 'algebra', type: 'multiple',
    question: 'Las gráficas de gastos acumulados e ingresos acumulados de un emprendimiento se intersecan en el mes 6. ¿Qué representa dicho punto de intersección?',
    options: [
      'El mes de mayor ingreso acumulado',
      'El mes donde los ingresos acumulados igualan a los gastos acumulados',
      'El mes a partir del cual ya no hay más gastos',
      'El mes donde los ingresos igualan a los gastos iniciales'
    ],
    correct: 1,
    explanation: 'El punto de intersección entre dos funciones representa la igualdad de sus valores.',
    hint: 'Analiza la definición geométrica de la intersección entre dos curvas.',
    points: 100
  },
  {
    id: 34, topic: 'algebra', type: 'multiple',
    question: 'Un estanque tiene 720 litros de agua y se vacía a razón constante de 3 litros por minuto. ¿Qué función f(x) modela la cantidad de agua remanente en el estanque tras x minutos?',
    options: ['f(x) = -3x + 720', 'g(x) = 3x - 720', 'p(x) = (x-720)/3', 'h(x) = (-x+720)/3'],
    correct: 0,
    explanation: 'Agua remanente = Agua inicial - (litros/min × min) = 720 - 3x = -3x + 720.',
    hint: 'La pendiente es negativa porque el agua disminuye.',
    points: 100
  },
  {
    id: 35, topic: 'algebra', type: 'multiple',
    question: 'En el sistema de ecuaciones: 2000x + 1500y = 18000 y x + y = 10, donde $2.000 es el precio del kilo de cuadernos y $1.500 el del kilo de libros, ¿qué representa la variable y?',
    options: [
      'El precio total de los libros',
      'El número total de libros comprados',
      'Los kilogramos de libros comprados',
      'Los kilogramos de cuadernos comprados'
    ],
    correct: 2,
    explanation: 'Al ser 1500 el costo por kg de libros, la variable y asociada a dicho coeficiente representa los kg de libros comprados.',
    hint: 'Identifica el valor unitario que acompaña a la variable y.',
    points: 100
  },
  {
    id: 36, topic: 'algebra', type: 'multiple',
    question: 'Un terreno rectangular tiene un área de 192 m² y su ancho mide 4 m menos que su largo L. ¿Cuánto mide el largo L?',
    options: ['12 m', '16 m', '20 m', '24 m'],
    correct: 1,
    explanation: 'L(L - 4) = 192 ⟹ L² - 4L - 192 = 0 ⟹ (L - 16)(L + 12) = 0. Como L > 0, L = 16 m.',
    hint: 'Plantea la ecuación cuadrática del área.',
    points: 150
  },
  {
    id: 37, topic: 'algebra', type: 'multiple',
    question: 'Una función cuadrática f tiene eje de simetría en x = 1 y su gráfica pasa por el punto (5, 7). ¿Para cuál de los siguientes valores de x se cumple también f(x) = 7?',
    options: ['4', '-3', '-4', '-5'],
    correct: 1,
    explanation: 'Por simetría, la distancia de 5 al eje x = 1 es 4 unidades. Hacia la izquierda: 1 - 4 = -3.',
    hint: 'Utiliza la simetría del eje x = 1 respecto a los valores del dominio.',
    points: 150
  },
  {
    id: 38, topic: 'algebra', type: 'multiple',
    question: 'La distancia recorrida por un objeto en caída libre es d(t) = (a · t²) / 2. Si a = 10 m/s², ¿cuántos segundos tarda en recorrer 45 metros?',
    options: ['3 s', '4,5 s', '√45 s', '9 s'],
    correct: 0,
    explanation: '45 = (10 · t²) / 2 ⟹ 45 = 5t² ⟹ t² = 9 ⟹ t = 3 segundos.',
    hint: 'Sustituye d = 45 y a = 10 en la fórmula y despeja t.',
    points: 100
  },
  {
    id: 39, topic: 'algebra', type: 'multiple',
    question: 'Si (p - 3)² - 36 = 0, ¿cuál de los siguientes números es una solución para p?',
    options: ['-15', '-9', '9', '15'],
    correct: 2,
    explanation: '(p - 3)² = 36 ⟹ p - 3 = 6 o p - 3 = -6. Luego, p = 9 o p = -3. La opción presente es 9.',
    hint: 'Aplica raíz cuadrada a ambos lados de la igualdad.',
    points: 100
  },
  {
    id: 40, topic: 'algebra', type: 'multiple',
    question: 'Si (x + 5) · P = x² - x - 30, con x ≠ -5, ¿a qué expresión es equivalente P?',
    options: ['x - 35', 'x² - 6', 'x + 6', 'x - 6'],
    correct: 3,
    explanation: 'Factorizando el trinomio: x² - x - 30 = (x + 5)(x - 6). Por lo tanto, P = x - 6.',
    hint: 'Factoriza el trinomio buscando dos números que multiplicados den -30 y sumados -1.',
    points: 100
  },
  {
    id: 41, topic: 'algebra', type: 'multiple',
    question: '¿Cuál es la solución del sistema de ecuaciones 2x + y = 10 y x - y = 2?',
    options: ['x = 4, y = 2', 'x = 3, y = 4', 'x = 2, y = 6', 'x = 5, y = 0'],
    correct: 0,
    explanation: 'Sumando ambas ecuaciones: 3x = 12 ⟹ x = 4. Reemplazando en x - y = 2 ⟹ 4 - y = 2 ⟹ y = 2.',
    hint: 'Utiliza el método de reducción sumando las ecuaciones.',
    points: 100
  },
  {
    id: 42, topic: 'algebra', type: 'multiple',
    question: '¿Cuál de los siguientes puntos pertenece a la gráfica de la función f(x) = 2x² - 3x + 1?',
    options: ['(0, 0)', '(1, 0)', '(2, 5)', '(-1, 4)'],
    correct: 1,
    explanation: 'Evaluando f(1): 2(1)² - 3(1) + 1 = 2 - 3 + 1 = 0. Por lo tanto, (1, 0) pertenece a la gráfica.',
    hint: 'Reemplaza la coordenada x de cada punto en la función.',
    points: 100
  },
  {
    id: 43, topic: 'algebra', type: 'multiple',
    question: '¿Para qué valor de k el sistema de ecuaciones x + ky = 4 y 2x + 4y = 8 tiene infinitas soluciones?',
    options: ['1', '2', '4', '8'],
    correct: 1,
    explanation: 'Para tener infinitas soluciones las ecuaciones deben ser proporcionales: 1/2 = k/4 = 4/8 ⟹ k = 2.',
    hint: 'Iguala las razones entre coeficientes correspondientes.',
    points: 150
  },
  {
    id: 44, topic: 'algebra', type: 'multiple',
    question: 'Si f(x) = 3x - 5, ¿cuál es el valor de f(-2)?',
    options: ['-11', '-1', '1', '11'],
    correct: 0,
    explanation: 'f(-2) = 3(-2) - 5 = -6 - 5 = -11.',
    hint: 'Sustituye x por -2 en la función.',
    points: 100
  },
  {
    id: 45, topic: 'algebra', type: 'multiple',
    question: '¿Cuál es el dominio de la función real f(x) = 5 / (x - 4)?',
    options: ['Todos los reales excepto x = 0', 'Todos los reales excepto x = 4', 'Todos los reales mayores a 4', 'Todos los reales positivos'],
    correct: 1,
    explanation: 'La división por cero no está definida. Por tanto, x - 4 ≠ 0 ⟹ x ≠ 4.',
    hint: 'Encuentra el valor que indetermina la fracción.',
    points: 100
  },
  {
    id: 46, topic: 'algebra', type: 'multiple',
    question: 'Si 3x - 7 = 2(x + 4), ¿cuál es el valor de x?',
    options: ['12', '15', '11', '13'],
    correct: 1,
    explanation: '3x - 7 = 2x + 8 ⟹ 3x - 2x = 8 + 7 ⟹ x = 15.',
    hint: 'Aplica propiedad distributiva en el miembro derecho.',
    points: 100
  },
  {
    id: 47, topic: 'algebra', type: 'multiple',
    question: 'Un plan de telefonía cobra un monto fijo mensual de $5.000 más $50 por cada minuto consumido. ¿Qué función f(x) modela el cobro total mensual en función de los x minutos consumidos?',
    options: ['f(x) = 50x + 5000', 'f(x) = 5000x + 50', 'f(x) = 5050x', 'f(x) = (x/50) + 5000'],
    correct: 0,
    explanation: 'El costo variable depende de x (50x) y se suma al cargo fijo (5000): f(x) = 50x + 5000.',
    hint: 'Identifica el término constante y el término afín a los minutos.',
    points: 100
  },
  {
    id: 48, topic: 'algebra', type: 'multiple',
    question: '¿Cuáles son las soluciones reales de la ecuación cuadrática x² - 7x + 10 = 0?',
    options: ['x = -2, x = -5', 'x = 2, x = 5', 'x = 1, x = 10', 'x = -1, x = -10'],
    correct: 1,
    explanation: '(x - 2)(x - 5) = 0 ⟹ x₁ = 2, x₂ = 5.',
    hint: 'Busca dos números que multiplicados den 10 y sumados den -7.',
    points: 100
  },
  {
    id: 49, topic: 'algebra', type: 'multiple',
    question: 'Si el triple de un número entero x aumentado en 8 no supera a 29, ¿cuál es el mayor valor entero posible para x?',
    options: ['6', '7', '8', '9'],
    correct: 1,
    explanation: '3x + 8 ≤ 29 ⟹ 3x ≤ 21 ⟹ x ≤ 7. El mayor número entero que cumple la inecuación es 7.',
    hint: 'Plantea y resuelve la inecuación 3x + 8 ≤ 29.',
    points: 100
  },
  {
    id: 50, topic: 'algebra', type: 'multiple',
    question: '¿Cuál es la pendiente de la recta que pasa por los puntos A(2, 3) y B(6, 11)?',
    options: ['2', '3', '4', '1/2'],
    correct: 0,
    explanation: 'm = (y₂ - y₁) / (x₂ - x₁) = (11 - 3) / (6 - 2) = 8 / 4 = 2.',
    hint: 'Utiliza la fórmula de la pendiente m = (y₂ - y₁) / (x₂ - x₁).',
    points: 100
  },

  // ================================================================
  // EJE 3: GEOMETRÍA (Preguntas 51 a 75)
  // ================================================================
  {
    id: 51, topic: 'geometria', type: 'multiple',
    question: 'Un trapecio rectángulo tiene un área de 0,76 m² y sus bases paralelas miden 0,6 m y 1,3 m. ¿Cuál es su altura?',
    options: ['1,444 m', '0,80 m', '0,722 m', '0,40 m'],
    correct: 1,
    explanation: 'Área = [(b₁ + b₂) / 2] · h ⟹ 0,76 = [(0,6 + 1,3) / 2] · h ⟹ 0,76 = 0,95 · h ⟹ h = 0,80 m.',
    hint: 'Despeja h en la fórmula del área del trapecio.',
    points: 100
  },
  {
    id: 52, topic: 'geometria', type: 'multiple',
    question: 'Se construye un bloque sólido en forma de L usando cubos idénticos de arista 2 cm. Si el volumen total de la figura es de 56 cm³, ¿cuántos cubos se utilizaron en su construcción?',
    options: ['6', '7', '8', '9'],
    correct: 1,
    explanation: 'Volumen de 1 cubo = 2³ = 8 cm³. Número de cubos = 56 / 8 = 7 cubos.',
    hint: 'Calcula el volumen de un solo cubo y divide el volumen total entre este valor.',
    points: 150
  },
  {
    id: 53, topic: 'geometria', type: 'multiple',
    question: 'Una caja cúbica tiene caras cuadradas exteriores de área 25 cm² cada una. ¿Qué expresión representa la superficie exterior total en cm²?',
    options: ['6 · 5²', '6 · 5⁴', '6 · 5⁶', '6 · 5¹²'],
    correct: 0,
    explanation: 'Un cubo tiene 6 caras. Si cada cara mide 25 cm² = 5² cm², el área total es 6 · 5² cm².',
    hint: 'El cubo tiene 6 caras planas congruentes.',
    points: 100
  },
  {
    id: 54, topic: 'geometria', type: 'multiple',
    question: 'Se dobla un papel cuadrado por la mitad y se realiza un corte en el borde del doblez. Al desdoblar la hoja, ¿qué propiedad geométrica presenta la figura obtenida?',
    options: ['Una figura asimétrica', 'Una figura con simetría axial', 'Una figura con simetría central', 'Una figura sin simetría'],
    correct: 1,
    explanation: 'El doblez actúa como eje de simetría (reflexión), produciendo una figura con simetría axial.',
    hint: 'El pliegue del papel funciona como un espejo.',
    points: 100
  },
  {
    id: 55, topic: 'geometria', type: 'multiple',
    question: 'Un vector representado en un plano cartesiano va del origen (0,0) al punto (3,3), apuntando al Noreste. ¿Qué par de transformaciones logran que el vector resultante apunte exactamente al Oeste?',
    options: [
      'Reflexión respecto al eje X y luego respecto a la recta y = x',
      'Reflexión respecto al origen y luego rotación de 45° en sentido horario',
      'Reflexión respecto al eje Y únicamente',
      'Traslación según vector (-3, -3)'
    ],
    correct: 1,
    explanation: 'Al reflejar (3,3) respecto al origen se obtiene (-3,-3) (Suroeste). Luego, una rotación de 45° en sentido horario lo orienta hacia el Oeste.',
    hint: 'Sigue el cambio de orientación angular paso a paso.',
    points: 150
  },
  {
    id: 56, topic: 'geometria', type: 'multiple',
    question: 'El vector u se define desde (-2,3) hasta (-5,1) y el vector v desde (2,3) hasta (5,5). ¿Qué relación es correcta entre ellos?',
    options: [
      'Tienen distinta dirección',
      'Tienen distinto sentido',
      'Tienen distinta magnitud',
      'Están en el semieje positivo de las X'
    ],
    correct: 1,
    explanation: 'u = (-3, -2) y v = (3, 2). Se observa que u = -v, por lo que poseen igual magnitud y dirección, pero distinto sentido.',
    hint: 'Calcula las componentes de cada vector restando punto final menos punto inicial.',
    points: 100
  },
  {
    id: 57, topic: 'geometria', type: 'multiple',
    question: 'En un plano de coordenadas donde cada cuadrícula mide 2 unidades, un objeto se desplaza 4 cuadrículas a la derecha y 2 cuadrículas hacia abajo. ¿Qué vector representa este desplazamiento?',
    options: ['(8, -4)', '(-4, 2)', '(10, -6)', '(2, -2)'],
    correct: 0,
    explanation: 'Componente x = 4 × 2 = 8 unidades. Componente y = 2 × (-2) = -4 unidades. Vector = (8, -4).',
    hint: 'Multiplica la cantidad de cuadrículas por la dimensión de cada una.',
    points: 100
  },
  {
    id: 58, topic: 'geometria', type: 'multiple',
    question: 'Cuatro círculos tienen perímetros de 12π m, 10π m, 8π m y 4π m. ¿Cuál es la suma de sus áreas?',
    options: ['(17)²π m²', '81π m²', '34π m²', '17π m²'],
    correct: 1,
    explanation: 'Radios: 6, 5, 4 y 2 m. Áreas: 36π, 25π, 16π, 4π. Suma = 36π + 25π + 16π + 4π = 81π m².',
    hint: 'Determina los radios dividiendo los perímetros por 2π y luego suma sus áreas (π r²).',
    points: 150
  },
  {
    id: 59, topic: 'geometria', type: 'multiple',
    question: 'Un triángulo rectángulo tiene catetos de 6 cm y 8 cm. ¿Cuál es la longitud de su hipotenusa?',
    options: ['10 cm', '12 cm', '14 cm', '100 cm'],
    correct: 0,
    explanation: 'h² = 6² + 8² = 36 + 64 = 100 ⟹ h = 10 cm.',
    hint: 'Aplica el Teorema de Pitágoras.',
    points: 100
  },
  {
    id: 60, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es el perímetro de un rectángulo de área 48 cm² cuyo ancho mide 6 cm?',
    options: ['14 cm', '28 cm', '16 cm', '32 cm'],
    correct: 1,
    explanation: 'Largo = 48 / 6 = 8 cm. Perímetro = 2 · (8 + 6) = 28 cm.',
    hint: 'Calcula primero la medida del largo a partir del área.',
    points: 100
  },
  {
    id: 61, topic: 'geometria', type: 'multiple',
    question: 'Al trasladar el punto P(-3, 4) según el vector v = (5, -2), ¿cuáles son las coordenadas del punto resultante P\'?',
    options: ['(-8, 6)', '(2, 2)', '(-2, -2)', '(8, -6)'],
    correct: 1,
    explanation: 'P\' = (-3 + 5, 4 + (-2)) = (2, 2).',
    hint: 'Suma componente a componente las coordenadas del punto y del vector.',
    points: 100
  },
  {
    id: 62, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es el volumen de un cilindro recto de radio basal 3 cm y altura 10 cm?',
    options: ['30π cm³', '60π cm³', '90π cm³', '180π cm³'],
    correct: 2,
    explanation: 'V = π · r² · h = π · 3² · 10 = 90π cm³.',
    hint: 'Utiliza V = π r² h.',
    points: 100
  },
  {
    id: 63, topic: 'geometria', type: 'multiple',
    question: 'Si el punto A(2, -5) se refleja con respecto al eje X, ¿cuáles son sus nuevas coordenadas?',
    options: ['(-2, -5)', '(2, 5)', '(-2, 5)', '(5, -2)'],
    correct: 1,
    explanation: 'La reflexión respecto al eje X mantiene constante x y cambia el signo de y: (2, 5).',
    hint: 'Al reflejar sobre el eje X, solo cambia el signo de la ordenada y.',
    points: 100
  },
  {
    id: 64, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es el área total de la superficie de un cubo de arista 4 cm?',
    options: ['16 cm²', '64 cm²', '96 cm²', '128 cm²'],
    correct: 2,
    explanation: 'Área total = 6 × (arista)² = 6 × 4² = 6 × 16 = 96 cm².',
    hint: 'Calcula el área de una cara y multiplícala por 6.',
    points: 100
  },
  {
    id: 65, topic: 'geometria', type: 'multiple',
    question: 'Un triángulo equilátero tiene un perímetro de 18 cm. ¿Cuánto mide cada uno de sus lados?',
    options: ['3 cm', '6 cm', '9 cm', '12 cm'],
    correct: 1,
    explanation: 'Lado = Perímetro / 3 = 18 / 3 = 6 cm.',
    hint: 'Los tres lados de un triángulo equilátero son congruentes.',
    points: 100
  },
  {
    id: 66, topic: 'geometria', type: 'multiple',
    question: 'Al rotar el punto P(4, 2) respecto al origen en 90° en sentido antihorario, ¿cuáles son sus nuevas coordenadas?',
    options: ['(-2, 4)', '(2, -4)', '(-4, -2)', '(-2, -4)'],
    correct: 0,
    explanation: 'La rotación de 90° antihoraria transforma (x, y) en (-y, x). Por lo tanto: (4, 2) ↦ (-2, 4).',
    hint: 'Recuerda que (x, y) ↦ (-y, x) en rotaciones de 90° antihorarias.',
    points: 150
  },
  {
    id: 67, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es el área de un círculo cuya circunferencia mide 10π cm?',
    options: ['10π cm²', '25π cm²', '50π cm²', '100π cm²'],
    correct: 1,
    explanation: 'Perímetro = 2πr = 10π ⟹ r = 5 cm. Área = π · r² = π · 5² = 25π cm².',
    hint: 'Obtén el radio dividiendo el perímetro por 2π.',
    points: 100
  },
  {
    id: 68, topic: 'geometria', type: 'multiple',
    question: 'Si la hipotenusa de un triángulo rectángulo isósceles mide 10 cm, ¿cuánto mide cada cateto c?',
    options: ['5 cm', '5√2 cm', '10√2 cm', '2,5 cm'],
    correct: 1,
    explanation: 'c² + c² = 10² ⟹ 2c² = 100 ⟹ c² = 50 ⟹ c = √50 = 5√2 cm.',
    hint: 'Plantea Pitágoras asumiendo que ambos catetos son iguales.',
    points: 150
  },
  {
    id: 69, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es el volumen de un paralelepípedo recto de dimensiones 5 cm de largo, 4 cm de ancho y 3 cm de alto?',
    options: ['12 cm³', '20 cm³', '60 cm³', '94 cm³'],
    correct: 2,
    explanation: 'Volumen = largo × ancho × alto = 5 × 4 × 3 = 60 cm³.',
    hint: 'Multiplica sus tres dimensiones.',
    points: 100
  },
  {
    id: 70, topic: 'geometria', type: 'multiple',
    question: 'Dos triángulos son semejantes con razón de semejanza 1 : 3. Si el área del triángulo menor es 12 cm², ¿cuál es el área del triángulo mayor?',
    options: ['36 cm²', '72 cm²', '108 cm²', '144 cm²'],
    correct: 2,
    explanation: 'La razón de áreas es el cuadrado de la razón de semejanza: (1/3)² = 1/9. Área mayor = 12 × 9 = 108 cm².',
    hint: 'Eleva al cuadrado la razón entre los lados para encontrar la relación de áreas.',
    points: 150
  },
  {
    id: 71, topic: 'geometria', type: 'multiple',
    question: 'Un rombo tiene diagonales que miden 12 cm y 16 cm. ¿Cuál es el perímetro del rombo?',
    options: ['20 cm', '40 cm', '48 cm', '52 cm'],
    correct: 1,
    explanation: 'Las semi-diagonales forman un triángulo rectángulo con catetos de 6 cm y 8 cm. Lado = √(6² + 8²) = 10 cm. Perímetro = 4 × 10 = 40 cm.',
    hint: 'Las diagonales de un rombo son perpendiculares y se cortan en su punto medio.',
    points: 150
  },
  {
    id: 72, topic: 'geometria', type: 'multiple',
    question: 'Un cono recto tiene un radio basal de 6 cm y una altura de 8 cm. ¿Cuál es el valor de su generatriz?',
    options: ['10 cm', '12 cm', '14 cm', '100 cm'],
    correct: 0,
    explanation: 'g² = r² + h² = 6² + 8² = 36 + 64 = 100 ⟹ g = 10 cm.',
    hint: 'El radio, la altura y la generatriz forman un triángulo rectángulo.',
    points: 100
  },
  {
    id: 73, topic: 'geometria', type: 'multiple',
    question: 'En la figura, si L₁ // L₂ y un ángulo alterno interno mide 65°, ¿cuánto mide su ángulo suplementario adyacente?',
    options: ['65°', '115°', '125°', '180°'],
    correct: 1,
    explanation: 'Ángulos suplementarios suman 180°. El ángulo adyacente mide 180° - 65° = 115°.',
    hint: 'Dos ángulos adyacentes sobre una misma línea recta suman 180°.',
    points: 100
  },
  {
    id: 74, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es el área lateral de un cilindro recto con radio basal de 4 cm y altura de 5 cm?',
    options: ['20π cm²', '40π cm²', '80π cm²', '100π cm²'],
    correct: 1,
    explanation: 'Área lateral = 2π · r · h = 2π · 4 · 5 = 40π cm².',
    hint: 'Utiliza la fórmula A_lateral = 2π r h.',
    points: 100
  },
  {
    id: 75, topic: 'geometria', type: 'multiple',
    question: 'Un cuadrado de lado 6 cm se dilata mediante una homotecia de centro en el origen y razón k = 2,5. ¿Cuál es la longitud del lado de la figura homotética?',
    options: ['12 cm', '15 cm', '18 cm', '30 cm'],
    correct: 1,
    explanation: 'Nuevo lado = lado original × |k| = 6 × 2,5 = 15 cm.',
    hint: 'Multiplica el lado original por la razón de homotecia.',
    points: 100
  },

  // ================================================================
  // EJE 4: PROBABILIDAD Y ESTADÍSTICA (Preguntas 76 a 100)
  // ================================================================
  {
    id: 76, topic: 'estadistica', type: 'multiple',
    question: 'En un informe estadístico sobre el flujo migratorio registrado año a año durante una década, ¿cuál es el término genérico que representa la categoría de mayor frecuencia en una distribución?',
    options: ['Media', 'Mediana', 'Rango', 'Moda'],
    correct: 3,
    explanation: 'La moda corresponde al valor o categoría que presenta la mayor frecuencia absoluta en una distribución de datos.',
    hint: 'Identifica cuál medida de tendencia central señala el valor más frecuente.',
    points: 100
  },
  {
    id: 77, topic: 'estadistica', type: 'multiple',
    question: 'En una empresa se registran las edades de sus trabajadores: [18-24]: 5, [25-34]: 7, [35-44]: 14, [45-54]: 11, 55 o más: 13. Un beneficio aplica a quienes no superen los 34 años. ¿Cuántos trabajadores pueden acceder al beneficio?',
    options: ['6', '7', '9', '12'],
    correct: 3,
    explanation: 'Trabajadores con ≤ 34 años: intervalo 18-24 (5) + intervalo 25-34 (7) = 12 personas.',
    hint: 'Suma las frecuencias de los dos primeros tramos de edad.',
    points: 100
  },
  {
    id: 78, topic: 'estadistica', type: 'multiple',
    question: 'En una evaluación de desempeño, un diagrama radial asigna a un perfil los siguientes valores de 0 a 100: Fuerza física = 80, Defensa física = 70, Fuerza mágica = 90, Defensa mágica = 30. ¿Cuál es el atributo con menor desempeño?',
    options: ['Fuerza mágica', 'Defensa mágica', 'Defensa física', 'Fuerza física'],
    correct: 1,
    explanation: 'El menor puntaje corresponde a Defensa mágica (30 puntos).',
    hint: 'Busca el atributo con el menor valor numérico asignado.',
    points: 100
  },
  {
    id: 79, topic: 'estadistica', type: 'multiple',
    question: 'La antigüedad en años de los estudiantes en una institución es: 1 año: 24, 2 años: 15, 3 años: 12, 4 años: 8, 5 años: 12, 6 años: 29, 7 años: 14, 8 años: 9, 9 o más años: 16. ¿Cuántos estudiantes tienen 5 años o más de antigüedad?',
    options: ['12', '35', '68', '80'],
    correct: 3,
    explanation: 'Suma desde 5 años en adelante: 12 + 29 + 14 + 9 + 16 = 80 estudiantes.',
    hint: 'Suma las frecuencias absolutas asociadas a 5, 6, 7, 8 y 9+ años.',
    points: 100
  },
  {
    id: 80, topic: 'estadistica', type: 'multiple',
    question: 'Si en un grupo de 10 personas ocupadas 5 son mujeres y 5 son hombres, ¿qué porcentaje de la muestra representan las mujeres?',
    options: ['5%', '10%', '25%', '50%'],
    correct: 3,
    explanation: '5 de 10 equivale a (5/10) × 100% = 50%.',
    hint: 'Expresa la relación 5 de 10 como un porcentaje.',
    points: 100
  },
  {
    id: 81, topic: 'estadistica', type: 'multiple',
    question: 'Una variable toma el valor 0 con frecuencia P, el valor 1 con frecuencia Q y el valor 2 con frecuencia R. ¿Qué expresión representa la media aritmética (promedio) de estos datos?',
    options: [
      '(P+Q+2R)/(P+Q+R)',
      'R/(P+Q+R)',
      '(0·P+1·Q+2·R)/(P+Q+R)',
      '(2·R)/(P+Q+R)'
    ],
    correct: 2,
    explanation: 'El promedio ponderado se calcula multiplicando cada valor por su frecuencia y dividiendo por la suma de frecuencias: (0·P + 1·Q + 2·R) / (P + Q + R).',
    hint: 'Aplica la fórmula general del promedio para datos agrupados por frecuencia.',
    points: 100
  },
  {
    id: 82, topic: 'estadistica', type: 'multiple',
    question: 'Una planta medía 2 cm al ser plantada. En 5 semanas de crecimiento continuo alcanzó 14 cm. ¿Cuál fue su crecimiento promedio por semana?',
    options: ['2 cm', '2,4 cm', '3 cm', '7,5 cm'],
    correct: 1,
    explanation: 'Crecimiento acumulado = 14 - 2 = 12 cm. Promedio por semana = 12 / 5 = 2,4 cm/semana.',
    hint: 'Resta la altura inicial a la final antes de dividir por el número de semanas.',
    points: 100
  },
  {
    id: 83, topic: 'estadistica', type: 'multiple',
    question: 'En un taller mecánico, la cantidad de autos reparados por día durante una semana fue: 3, 5, 2, 5, 8, 5, 7. ¿Cuál es el valor que representa la moda de este grupo de datos?',
    options: ['2', '3', '5', '7'],
    correct: 2,
    explanation: 'El número 5 se repite 3 veces, siendo el valor con mayor frecuencia en la muestra.',
    hint: 'Identifica cuál es el dato que más se repite.',
    points: 100
  },
  {
    id: 84, topic: 'estadistica', type: 'multiple',
    question: 'En un experimento se miden 5 distancias de reacción: 10, 9, 15, 8 y 18 cm. El promedio obtenido es 12 cm. Si la tabla de equivalencias indica que a 12 cm le corresponden 0,16 s, ¿cuál es el tiempo promedio de reacción?',
    options: ['0,10 s', '0,14 s', '0,16 s', '0,17 s'],
    correct: 2,
    explanation: 'Promedio de distancia = (10+9+15+8+18)/5 = 60/5 = 12 cm. Según la tabla dada, a 12 cm le corresponden 0,16 s.',
    hint: 'Calcula el promedio aritmético de las mediciones en cm y consulta la equivalencia.',
    points: 100
  },
  {
    id: 85, topic: 'probabilidad', type: 'multiple',
    question: 'Un juego de memoria tiene 20 tarjetas volteadas (10 parejas idénticas). Se voltea una primera tarjeta que resulta ser un "rayo". ¿Cuál es la probabilidad de voltear el segundo "rayo" en la siguiente tarjeta?',
    options: ['1/20', '1/19', '2/20', '2/19'],
    correct: 1,
    explanation: 'Quedan 19 tarjetas cubiertas (casos posibles) y entre ellas exactamente 1 tarjeta "rayo" (caso favorable). P = 1 / 19.',
    hint: 'Resta la tarjeta extraída del total disponible.',
    points: 100
  },
  {
    id: 86, topic: 'estadistica', type: 'multiple',
    question: 'En una empresa, los años de servicio de los empleados son: 1 año: 2 pers., 2 años: 4, 3 años: 5, 4 años: 4, 5 años: 2, 6 años: 6, 7 años: 2, 8 años: 5, 9 años: 3, 10 años: 2. ¿Cuántos empleados reciben bono si se exigen como mínimo 6 años de servicio?',
    options: ['12', '17', '18', '23'],
    correct: 2,
    explanation: 'Sumamos las frecuencias desde 6 hasta 10 años: 6 + 2 + 5 + 3 + 2 = 18 empleados.',
    hint: 'Suma los trabajadores correspondientes a 6, 7, 8, 9 y 10 años de antigüedad.',
    points: 100
  },
  {
    id: 87, topic: 'probabilidad', type: 'multiple',
    question: 'En un grupo de 20 personas, 7 prefieren Rock, 4 Pop, 3 Rap y 6 Reguetón. ¿Cuál es la probabilidad de que al elegir a una persona al azar prefiera Rock?',
    options: ['1/7', '7/13', '13/20', '7/20'],
    correct: 3,
    explanation: 'Casos favorables = 7. Casos totales = 20. P = 7 / 20.',
    hint: 'Aplica la Regla de Laplace: Casos Favorables / Casos Totales.',
    points: 100
  },
  {
    id: 88, topic: 'probabilidad', type: 'multiple',
    question: 'Al lanzar dos dados comunes de 6 caras no cargados, ¿cuál es la probabilidad de que la suma de sus puntos sea igual a 7?',
    options: ['1/6', '1/12', '5/36', '7/36'],
    correct: 0,
    explanation: 'Casos favorables: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) ⟹ 6 combinaciones de 36 posibles. P = 6 / 36 = 1 / 6.',
    hint: 'Determina las combinaciones de lanzamientos que suman 7 sobre 36 totales.',
    points: 100
  },
  {
    id: 89, topic: 'estadistica', type: 'multiple',
    question: 'Dada la serie de datos: 4, 8, 6, 10, 12, 8, 14. ¿Cuál es su mediana?',
    options: ['6', '8', '9', '10'],
    correct: 1,
    explanation: 'Ordenamos de menor a mayor: 4, 6, 8, 8, 10, 12, 14. Como hay 7 datos, la mediana es el 4.º término: 8.',
    hint: 'Ordena los datos de menor a mayor y ubica el dato central.',
    points: 100
  },
  {
    id: 90, topic: 'probabilidad', type: 'multiple',
    question: 'En una bolsa hay 4 bolitas rojas, 5 azules y 3 verdes. Si se extrae una bolita al azar, ¿cuál es la probabilidad de que NO sea azul?',
    options: ['5/12', '7/12', '3/12', '4/12'],
    correct: 1,
    explanation: 'Total de bolitas = 12. Bolitas no azules = 4 rojas + 3 verdes = 7. P(No Azul) = 7 / 12.',
    hint: 'Resta las bolitas azules del total para obtener las favorables.',
    points: 100
  },
  {
    id: 91, topic: 'estadistica', type: 'multiple',
    question: 'El promedio aritmético de 4 números es 15. Si se elimina el número 9, ¿cuál es el nuevo promedio de los 3 números restantes?',
    options: ['15', '16', '17', '18'],
    correct: 2,
    explanation: 'Suma inicial = 4 × 15 = 60. Nueva suma = 60 - 9 = 51. Nuevo promedio = 51 / 3 = 17.',
    hint: 'Obtén la suma de los valores multiplicando la cantidad de datos por el promedio.',
    points: 150
  },
  {
    id: 92, topic: 'probabilidad', type: 'multiple',
    question: 'Si se lanza una moneda justa 3 veces seguidas, ¿cuál es la probabilidad de obtener exactamente dos caras y una cruz?',
    options: ['1/8', '3/8', '1/2', '5/8'],
    correct: 1,
    explanation: 'Casos posibles = 2³ = 8. Combinaciones favorables con 2 caras y 1 cruz: (C,C,X), (C,X,C), (X,C,C) ⟹ 3 casos. P = 3/8.',
    hint: 'Enumera todas las combinaciones posibles de 3 lanzamientos.',
    points: 100
  },
  {
    id: 93, topic: 'estadistica', type: 'multiple',
    question: 'En un curso de 30 estudiantes, el promedio de notas de los 20 hombres es 5,0 y el promedio de las 10 mujeres es 6,0. ¿Cuál es el promedio ponderado del curso?',
    options: ['5,33', '5,50', '5,67', '5,80'],
    correct: 0,
    explanation: 'Suma notas = (20 × 5,0) + (10 × 6,0) = 100 + 60 = 160. Promedio del curso = 160 / 30 ≈ 5,33.',
    hint: 'Calcula el total de puntos sumando el grupo de hombres y mujeres.',
    points: 150
  },
  {
    id: 94, topic: 'probabilidad', type: 'multiple',
    question: 'Una urna contiene 4 bolas rojas y 6 bolas azules. Se extrae una bola al azar con reposición y luego una segunda bola. ¿Cuál es la probabilidad de que ambas sean rojas?',
    options: ['4/25', '2/15', '12/25', '16/100'],
    correct: 0,
    explanation: 'Al ser con reposición, los eventos son independientes. P(1ª roja) = 4/10 = 2/5. P(2ª roja) = 2/5. P(ambas) = (2/5) × (2/5) = 4/25.',
    hint: 'Al ser con reposición, las probabilidades de cada extracción no cambian.',
    points: 150
  },
  {
    id: 95, topic: 'estadistica', type: 'multiple',
    question: '¿Cuál es el rango de la siguiente serie de datos: 12, 5, 22, 17, 30, 9, 14?',
    options: ['18', '22', '25', '30'],
    correct: 2,
    explanation: 'Dato máximo = 30, dato mínimo = 5. Rango = 30 - 5 = 25.',
    hint: 'Resta el dato menor al dato mayor.',
    points: 100
  },
  {
    id: 96, topic: 'probabilidad', type: 'multiple',
    question: 'En una tómbola con 100 boletos numerados del 1 al 100, ¿cuál es la probabilidad de sacar un número que sea múltiplo de 20?',
    options: ['1/20', '1/10', '1/5', '1/25'],
    correct: 0,
    explanation: 'Múltiplos de 20 entre 1 y 100: 20, 40, 60, 80, 100 (5 números). P = 5 / 100 = 1 / 20.',
    hint: 'Cuenta cuántos múltiplos de 20 existen entre 1 y 100.',
    points: 100
  },
  {
    id: 97, topic: 'estadistica', type: 'multiple',
    question: 'Las estaturas en cm de 5 personas son: 160, 165, 170, 175 y 180. Si una sexta persona de 170 cm se une al grupo, ¿qué ocurre con el promedio del grupo?',
    options: ['Aumenta', 'Disminuye', 'Se mantiene igual', 'Aumenta en 1 cm'],
    correct: 2,
    explanation: 'El promedio inicial es (160+165+170+175+180)/5 = 170 cm. Al incorporar un valor igual al promedio existente, la media no cambia.',
    hint: 'Compara el valor del dato incorporado con el promedio de la muestra original.',
    points: 100
  },
  {
    id: 98, topic: 'probabilidad', type: 'multiple',
    question: 'Si A y B son eventos mutuamente excluyentes con P(A) = 0,3 y P(B) = 0,4, ¿cuál es el valor de P(A ∪ B)?',
    options: ['0,12', '0,35', '0,70', '0,80'],
    correct: 2,
    explanation: 'Al ser mutuamente excluyentes, P(A ∩ B) = 0. Luego, P(A ∪ B) = P(A) + P(B) = 0,3 + 0,4 = 0,70.',
    hint: 'Para eventos mutuamente excluyentes se suman directamente las probabilidades.',
    points: 100
  },
  {
    id: 99, topic: 'estadistica', type: 'multiple',
    question: 'En un gráfico de barras que muestra la cantidad de libros leídos por persona al año, la barra correspondiente a "3 libros" tiene una frecuencia relativa de 0,35. ¿Qué porcentaje del total representa dicho grupo?',
    options: ['0,35%', '3,5%', '35%', '350%'],
    correct: 2,
    explanation: 'Porcentaje = Frecuencia Relativa × 100% = 0,35 × 100% = 35%.',
    hint: 'Multiplica la frecuencia relativa por 100 para obtener el porcentaje.',
    points: 100
  },
  {
    id: 100, topic: 'probabilidad', type: 'multiple',
    question: 'En una caja hay 10 ampolletas, de las cuales 2 están defectuosas. Si se extrae una ampolleta al azar, ¿cuál es la probabilidad de que esté en buen estado?',
    options: ['1/5', '2/5', '3/5', '4/5'],
    correct: 3,
    explanation: 'Ampolletas en buen estado = 10 - 2 = 8. P(buen estado) = 8 / 10 = 4 / 5.',
    hint: 'Calcula primero la cantidad de ampolletas no defectuosas.',
    points: 100
  }
];

// ============================================================================
// EXPORTACIÓN
// ============================================================================
const paesBancoM1 = {
  version: "2.0.0",
  totalQuestions: paesM1Questions.length,
  questions: paesM1Questions
};

console.log('📐 Banco de Matemática 1 (M1) verificado y actualizado: ' + paesM1Questions.length + ' preguntas');
