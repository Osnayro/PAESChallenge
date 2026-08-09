
/**
 * ============================================================
 * PAES CHALLENGE — BANCO DE COMPETENCIA MATEMÁTICA 2 (M2)
 * 100 preguntas alineadas al temario DEMRE 2025-2026
 * Ejes: Números, Álgebra y Funciones, Geometría, Probabilidad y Estadística
 * ============================================================
 */

const paesM2Questions = [
  // ================================================================
  // EJE: NÚMEROS (25 preguntas)
  // ================================================================
  {
    id: 3001, topic: 'numeros', type: 'multiple',
    question: '¿Cuál es el resultado de simplificar la expresión √18 + √50 - √8?',
    options: ['6√2', '8√2', '10√2', '4√2'],
    correct: 0,
    explanation: '√18 = 3√2, √50 = 5√2 y √8 = 2√2. Luego: 3√2 + 5√2 - 2√2 = 6√2.',
    hint: 'Descompón cada raíz en factores con cuadrados perfectos.',
    points: 150
  },
  {
    id: 3002, topic: 'numeros', type: 'multiple',
    question: 'Al racionalizar la expresión 6 / (√5 - √2), se obtiene:',
    options: ['2(√5 + √2)', '6(√5 + √2)', '2(√5 - √2)', '3(√5 + √2)'],
    correct: 0,
    explanation: 'Multiplicando por el conjugado (√5 + √2): 6(√5 + √2) / (5 - 2) = 6(√5 + √2) / 3 = 2(√5 + √2).',
    hint: 'Multiplica numerador y denominador por el conjugado del denominador.',
    points: 150
  },
  {
    id: 3003, topic: 'numeros', type: 'multiple',
    question: '¿Cuál es el valor de log₂(32) + log₃(1/9)?',
    options: ['3', '7', '5', '2'],
    correct: 0,
    explanation: 'log₂(32) = 5 y log₃(1/9) = -2. Por lo tanto, 5 + (-2) = 3.',
    hint: 'Calcula cada logaritmo por separado.',
    points: 150
  },
  {
    id: 3004, topic: 'numeros', type: 'multiple',
    question: 'Si log(2) = a y log(3) = b, ¿cuál es la representación de log(18) en términos de a y b?',
    options: ['a + 2b', '2a + b', 'a · b²', 'a + b²'],
    correct: 0,
    explanation: 'log(18) = log(2 × 3²) = log(2) + log(3²) = log(2) + 2·log(3) = a + 2b.',
    hint: 'Descompón 18 en factores primos y aplica propiedades de logaritmos.',
    points: 150
  },
  {
    id: 3005, topic: 'numeros', type: 'multiple',
    question: 'Un capital de $1.000.000 se deposita a una tasa del 10% anual compuesto. ¿Cuál es el monto total al cabo de 3 años?',
    options: ['$1.331.000', '$1.300.000', '$1.210.000', '$1.400.000'],
    correct: 0,
    explanation: 'M = C(1 + i)ⁿ = 1.000.000 × (1,1)³ = 1.000.000 × 1,331 = $1.331.000.',
    hint: 'Aplica la fórmula de interés compuesto M = C(1 + i)ⁿ.',
    points: 150
  },
  {
    id: 3006, topic: 'numeros', type: 'multiple',
    question: 'Si a = √3 y b = √2, ¿cuál es el valor de (a + b)(a - b)?',
    options: ['1', '5', '√5', '√3 - √2'],
    correct: 0,
    explanation: 'Diferencia de cuadrados: (a + b)(a - b) = a² - b² = (√3)² - (√2)² = 3 - 2 = 1.',
    hint: 'Aplica la fórmula de diferencia de cuadrados.',
    points: 100
  },
  {
    id: 3007, topic: 'numeros', type: 'multiple',
    question: 'Si logₓ(64) = 3, ¿cuál es el valor de x?',
    options: ['4', '8', '16', '2'],
    correct: 0,
    explanation: 'Por definición de logaritmo, x³ = 64, por lo que x = ∛64 = 4.',
    hint: 'Aplica la definición: logₐ(b) = c ⇔ aᶜ = b.',
    points: 100
  },
  {
    id: 3008, topic: 'numeros', type: 'multiple',
    question: 'La expresión (2³ × 4²) / 8² simplificada equivale a:',
    options: ['2', '4', '1', '1/2'],
    correct: 0,
    explanation: '(2³ × (2²)²) / (2³)² = (2³ × 2⁴) / 2⁶ = 2⁷ / 2⁶ = 2.',
    hint: 'Expresa todo como potencias de 2.',
    points: 150
  },
  {
    id: 3009, topic: 'numeros', type: 'multiple',
    question: 'Un producto cuesta $80.000 y se le aplica un descuento del 20% seguido de un aumento del 20%. ¿Cuál es el precio final?',
    options: ['$76.800', '$80.000', '$64.000', '$83.200'],
    correct: 0,
    explanation: 'Precio con descuento: 80.000 × 0,8 = 64.000. Precio con aumento: 64.000 × 1,2 = $76.800.',
    hint: 'Aplica los porcentajes de forma sucesiva, no los sumes.',
    points: 100
  },
  {
    id: 3010, topic: 'numeros', type: 'multiple',
    question: '¿Cuál de las siguientes igualdades es CORRECTA para todo a, b > 0?',
    options: ['log(a / b) = log(a) - log(b)', 'log(a + b) = log(a) × log(b)', 'log(a × b) = log(a) × log(b)', 'log(a - b) = log(a) / log(b)'],
    correct: 0,
    explanation: 'Por propiedad fundamental del cociente de logaritmos, log(a / b) = log(a) - log(b).',
    hint: 'Repasa las propiedades básicas de los logaritmos.',
    points: 100
  },
  {
    id: 3011, topic: 'numeros', type: 'multiple',
    question: 'Sean a, b reales tales que a < b < 0. ¿Cuál de las siguientes desigualdades es siempre verdadera?',
    options: ['a² < b²', '1/a > 1/b', '|a| < |b|', 'a - b < 0'],
    correct: 3,
    explanation: 'Al restar b a ambos miembros de a < b, obtenemos a - b < 0.',
    hint: 'Prueba con valores concretos como a = -3 y b = -1.',
    points: 150
  },
  {
    id: 3012, topic: 'numeros', type: 'multiple',
    question: 'Si logₓ(81) = 4, ¿cuál es el valor de log₃(x³)?',
    options: ['3', '9', '27', '81'],
    correct: 0,
    explanation: 'x⁴ = 81 implica x = 3. Luego log₃(3³) = 3.',
    hint: 'Primero encuentra x y luego evalúa la expresión.',
    points: 150
  },
  {
    id: 3013, topic: 'numeros', type: 'multiple',
    question: 'Un capital $C se impone a un interés compuesto anual del 5% durante n años. Si el monto acumulado es $M, ¿cuál expresión permite calcular n?',
    options: ['n = (log(M) - log(C)) / log(1,05)', 'n = log(M / C) / 1,05', 'n = log(M / (C × 1,05))', 'n = log(M × C) / log(1,05)'],
    correct: 0,
    explanation: 'M = C(1,05)ⁿ ⇒ M/C = 1,05ⁿ ⇒ log(M) - log(C) = n × log(1,05).',
    hint: 'Aplica logaritmos a ambos lados de la ecuación M = C(1,05)ⁿ.',
    points: 200
  },
  {
    id: 3014, topic: 'numeros', type: 'multiple',
    question: 'Calcula el valor simplificado de (2^(1/2) × 8^(1/6)) / 4^(1/4).',
    options: ['√2', '1', '2', '2^(1/4)'],
    correct: 0,
    explanation: '2^(1/2) × (2³)^(1/6) / (2²)^(1/4) = 2^(1/2) × 2^(1/2) / 2^(1/2) = 2^(1/2) = √2.',
    hint: 'Convierte todas las bases a potencias de 2.',
    points: 200
  },
  {
    id: 3015, topic: 'numeros', type: 'multiple',
    question: 'Resuelve la ecuación log₂(x) + log₂(x - 2) = 3.',
    options: ['4', '-2 y 4', '2', '8'],
    correct: 0,
    explanation: 'log₂(x(x - 2)) = 3 ⇒ x² - 2x = 8 ⇒ x² - 2x - 8 = 0 ⇒ (x - 4)(x + 2) = 0. Como x > 2, x = 4.',
    hint: 'Aplica la propiedad de suma de logaritmos y resuelve la cuadrática.',
    points: 200
  },
  {
    id: 3016, topic: 'numeros', type: 'multiple',
    question: 'Resuelve la ecuación log(x + 3) + log(x - 3) = log(16).',
    options: ['5', '-5 y 5', '25', '√7'],
    correct: 0,
    explanation: 'log(x² - 9) = log(16) ⇒ x² = 25 ⇒ x = 5 (se descarta -5 por el dominio).',
    hint: 'Aplica la propiedad de suma de logaritmos y verifica el dominio.',
    points: 150
  },
  {
    id: 3017, topic: 'numeros', type: 'multiple',
    question: 'Simplifica la expresión (√50 - √18) / √2.',
    options: ['2', '√16', '4√2', '8'],
    correct: 0,
    explanation: '(5√2 - 3√2) / √2 = 2√2 / √2 = 2.',
    hint: 'Descompón las raíces en factores con √2.',
    points: 100
  },
  {
    id: 3018, topic: 'numeros', type: 'multiple',
    question: 'Un bien se deprecia 10% anual. Si cuesta $100.000 originalmente, ¿cuál es su valor tras 2 años?',
    options: ['$80.000', '$81.000', '$90.000', '$89.000'],
    correct: 1,
    explanation: 'V = 100.000 × (0,90)² = 100.000 × 0,81 = $81.000.',
    hint: 'Aplica el factor de depreciación (0,90) dos veces.',
    points: 100
  },
  {
    id: 3019, topic: 'numeros', type: 'multiple',
    question: 'Se puede determinar si x es un número irracional si se sabe que: (1) x² es entero ; (2) x³ es irracional',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 1,
    explanation: 'Si el cubo de un número es irracional, el número x debe ser irracional obligatoriamente. La (2) por sí sola basta.',
    hint: 'Piensa en qué ocurre si elevas un número racional al cubo.',
    points: 150
  },
  {
    id: 3020, topic: 'numeros', type: 'multiple',
    question: 'Se puede calcular logₐ(b) si se conoce: (1) log(b) = 2 ; (2) log(a) = 0,5',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 2,
    explanation: 'Por cambio de base: logₐ(b) = log(b) / log(a) = 2 / 0,5 = 4. Se necesitan ambas.',
    hint: 'Recuerda la fórmula de cambio de base de logaritmos.',
    points: 150
  },
  {
    id: 3021, topic: 'numeros', type: 'multiple',
    question: 'Se puede determinar la tasa de interés anual i si se conoce: (1) El capital inicial C y el monto M ; (2) El número de años n',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 2,
    explanation: 'De M = C(1 + i)ⁿ se requiere C, M y n para despejar i.',
    hint: '¿Cuántas variables necesitas para despejar i de la fórmula?',
    points: 150
  },
  {
    id: 3022, topic: 'numeros', type: 'multiple',
    question: 'Se puede saber si a/b > 0 si: (1) a × b > 0 ; (2) a > 0 y b > 0',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Cada una por sí sola'],
    correct: 3,
    explanation: 'Tanto la multiplicación positiva como tener ambos términos positivos aseguran que el cociente mantenga el signo positivo.',
    hint: '¿Qué condición garantiza que el cociente de dos números sea positivo?',
    points: 150
  },
  {
    id: 3023, topic: 'numeros', type: 'multiple',
    question: 'Se puede calcular el valor de x en log₂(x) = y si: (1) y = 3 ; (2) x es potencia de 2',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 0,
    explanation: 'Con y = 3, por definición x = 2³ = 8. La afirmación (1) por sí sola es suficiente.',
    hint: 'Aplica la definición de logaritmo.',
    points: 100
  },
  {
    id: 3024, topic: 'numeros', type: 'multiple',
    question: 'Se puede determinar si un sistema de ecuaciones no tiene solución si: (1) Las rectas son paralelas ; (2) Tienen distinto coeficiente de posición',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 2,
    explanation: 'Paralelas (1) con distinto coeficiente (2) garantiza rectas no coincidentes y por ende sin intersección.',
    hint: '¿Qué condiciones deben cumplir dos rectas para no tener punto de intersección?',
    points: 150
  },
  {
    id: 3025, topic: 'numeros', type: 'multiple',
    question: 'Se puede saber si a/b > 0 si: (1) a × b > 0 ; (2) a > 0 y b > 0',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Cada una por sí sola'],
    correct: 3,
    explanation: 'Tanto la multiplicación positiva como tener ambos términos positivos aseguran que el cociente mantenga el mismo signo positivo.',
    hint: '¿Qué condición garantiza que el cociente de dos números sea positivo?',
    points: 100
  },

  // ================================================================
  // EJE: ÁLGEBRA Y FUNCIONES (30 preguntas)
  // ================================================================
  {
    id: 3101, topic: 'algebra', type: 'multiple',
    question: 'Dado el sistema { 2x + 3y = 13 ; x - y = 1 }, ¿cuál es el valor de x + y?',
    options: ['5', '3', '7', '4'],
    correct: 0,
    explanation: 'Despejando x = y + 1. Sustituyendo: 2(y + 1) + 3y = 13 ⇒ 5y = 11 ⇒ y = 2, x = 3. Luego x + y = 5.',
    hint: 'Despeja una variable de la segunda ecuación y sustituye en la primera.',
    points: 100
  },
  {
    id: 3102, topic: 'algebra', type: 'multiple',
    question: '¿Para qué valor de k el sistema { kx + 2y = 4 ; 3x + 6y = 12 } tiene infinitas soluciones?',
    options: ['1', '3', '6', '2'],
    correct: 0,
    explanation: 'Deben ser proporcionales: k/3 = 2/6 = 4/12 ⇒ k/3 = 1/3 ⇒ k = 1.',
    hint: 'Para infinitas soluciones las ecuaciones deben ser proporcionales.',
    points: 150
  },
  {
    id: 3103, topic: 'algebra', type: 'multiple',
    question: '¿Cuáles son las soluciones de la ecuación x² - 5x + 6 = 0?',
    options: ['x = 2 y x = 3', 'x = -2 y x = -3', 'x = 1 y x = 6', 'x = -1 y x = -6'],
    correct: 0,
    explanation: 'Factorizando (x - 2)(x - 3) = 0, por lo que las raíces son x = 2 y x = 3.',
    hint: 'Busca dos números que multiplicados den 6 y sumados den -5.',
    points: 100
  },
  {
    id: 3104, topic: 'algebra', type: 'multiple',
    question: 'Si el discriminante (Δ) de una ecuación de segundo grado es menor que cero (Δ < 0), sus raíces son:',
    options: ['Reales e iguales', 'Reales y distintas', 'No reales (complejas conjugadas)', 'Iguales a cero'],
    correct: 2,
    explanation: 'Un discriminante negativo indica que la parábola no corta el eje X, generando raíces complejas/no reales.',
    hint: 'Recuerda la fórmula del discriminante Δ = b² - 4ac.',
    points: 100
  },
  {
    id: 3105, topic: 'algebra', type: 'multiple',
    question: 'Si f(x) = 2^(x - 1) + 3, ¿cuál es el recorrido de la función f?',
    options: [']3, +∞[', '[3, +∞[', ']0, +∞[', 'ℝ'],
    correct: 0,
    explanation: 'Dado que 2^(x-1) > 0 para todo x, el valor de f(x) siempre será estrictamente mayor que 3.',
    hint: '¿Qué valores puede tomar 2^(x-1)?',
    points: 150
  },
  {
    id: 3106, topic: 'algebra', type: 'multiple',
    question: 'Resuelve la ecuación exponencial 9^x - 4 × 3^x + 3 = 0.',
    options: ['x = 0 y x = 1', 'x = 1 y x = 3', 'x = 0 y x = 3', 'x = -1 y x = 0'],
    correct: 0,
    explanation: 'Sea u = 3ˣ ⇒ u² - 4u + 3 = 0 ⇒ (u - 1)(u - 3) = 0. u = 1 ⇒ 3ˣ = 1 ⇒ x = 0; u = 3 ⇒ 3ˣ = 3 ⇒ x = 1.',
    hint: 'Haz el cambio de variable u = 3ˣ.',
    points: 200
  },
  {
    id: 3107, topic: 'algebra', type: 'multiple',
    question: '¿Cuál es el valor del recorrido de la función g(x) = 3·sen(x) - 1?',
    options: ['[-4, 2]', '[-3, 3]', '[-2, 4]', '[-1, 3]'],
    correct: 0,
    explanation: 'Como -1 ≤ sen(x) ≤ 1, multiplicando por 3 resulta -3 ≤ 3·sen(x) ≤ 3. Restando 1: -4 ≤ g(x) ≤ 2.',
    hint: 'Multiplica el recorrido de sen(x) por 3 y luego resta 1.',
    points: 100
  },
  {
    id: 3108, topic: 'algebra', type: 'multiple',
    question: '¿En cuál de los siguientes cuadrantes la función seno es positiva y la función coseno es negativa?',
    options: ['I Cuadrante', 'II Cuadrante', 'III Cuadrante', 'IV Cuadrante'],
    correct: 1,
    explanation: 'En el II Cuadrante (90° a 180°), las coordenadas son (-x, +y), resultando sen(x) > 0 y cos(x) < 0.',
    hint: 'Recuerda los signos de las funciones trigonométricas en cada cuadrante.',
    points: 100
  },
  {
    id: 3109, topic: 'algebra', type: 'multiple',
    question: 'En un estacionamiento hay 30 vehículos entre autos y motos. Si en total se cuentan 90 ruedas, ¿cuántos autos hay?',
    options: ['15', '10', '20', '18'],
    correct: 0,
    explanation: 'Sistema: a + m = 30 y 4a + 2m = 90. Resolviendo: a = 15, m = 15.',
    hint: 'Cada auto tiene 4 ruedas y cada moto 2.',
    points: 100
  },
  {
    id: 3110, topic: 'algebra', type: 'multiple',
    question: 'Si la suma de las raíces de x² - bx + 12 = 0 es 7, ¿cuál es el valor de b?',
    options: ['7', '-7', '12', '5'],
    correct: 0,
    explanation: 'Por propiedades de Vieta, la suma de las raíces x₁ + x₂ = -(-b)/1 = b. Por lo tanto, b = 7.',
    hint: 'La suma de las raíces de ax² + bx + c = 0 es -b/a.',
    points: 150
  },
  {
    id: 3111, topic: 'algebra', type: 'multiple',
    question: 'Simplifica la expresión trigonométrica (1 - cos²(x)) / sen(x).',
    options: ['sen(x)', 'cos(x)', 'tan(x)', '1'],
    correct: 0,
    explanation: 'Usando 1 - cos²(x) = sen²(x): sen²(x) / sen(x) = sen(x).',
    hint: 'Recuerda la identidad fundamental sen²(x) + cos²(x) = 1.',
    points: 150
  },
  {
    id: 3112, topic: 'algebra', type: 'multiple',
    question: 'Encuentra la suma de los cuadrados de las raíces de la ecuación x² - 6x + 4 = 0.',
    options: ['28', '36', '20', '32'],
    correct: 0,
    explanation: 'x₁ + x₂ = 6, x₁ × x₂ = 4. (x₁ + x₂)² = x₁² + x₂² + 2(x₁×x₂) ⇒ 36 = x₁² + x₂² + 8 ⇒ x₁² + x₂² = 28.',
    hint: 'Usa las propiedades de Vieta y la fórmula del cuadrado de la suma.',
    points: 200
  },
  {
    id: 3113, topic: 'algebra', type: 'multiple',
    question: 'Si f(x) = log₃(x - 2), ¿cuál es el dominio de f?',
    options: [']2, +∞[', '[2, +∞[', ']0, +∞[', 'ℝ'],
    correct: 0,
    explanation: 'El argumento del logaritmo debe ser mayor que cero: x - 2 > 0 ⇒ x > 2.',
    hint: 'Recuerda que el argumento de un logaritmo debe ser positivo.',
    points: 100
  },
  {
    id: 3114, topic: 'algebra', type: 'multiple',
    question: '¿Para qué valor del parámetro p el sistema { 3x - py = 6 ; 6x - 8y = 12 } tiene infinitas soluciones?',
    options: ['p = 2', 'p = 4', 'p = -4', 'p = 8'],
    correct: 1,
    explanation: 'Para rectas coincidentes: 3/6 = -p/-8 ⇒ 1/2 = p/8 ⇒ p = 4.',
    hint: 'Las ecuaciones deben ser proporcionales.',
    points: 150
  },
  {
    id: 3115, topic: 'algebra', type: 'multiple',
    question: 'Dada la función f(x) = a × bˣ + c, con a > 0 y b > 1, ¿cuál es la asíntota horizontal de f(x)?',
    options: ['x = c', 'y = a', 'y = c', 'y = 0'],
    correct: 2,
    explanation: 'Cuando x tiende a -infinito, bˣ tiende a 0, por lo que f(x) tiende a c.',
    hint: '¿Qué sucede con bˣ cuando x se hace muy negativo?',
    points: 150
  },
  {
    id: 3116, topic: 'algebra', type: 'multiple',
    question: '¿Cuál es el período de la función trigonométrica g(x) = 4·cos(3x - π) + 2?',
    options: ['2π', '2π/3', 'π/3', '3π'],
    correct: 1,
    explanation: 'El período T = 2π / |B| = 2π / 3.',
    hint: 'El período de cos(Bx) es 2π/|B|.',
    points: 100
  },
  {
    id: 3117, topic: 'algebra', type: 'multiple',
    question: 'Para la función f(x) = x³, ¿cuál afirmación es correcta?',
    options: ['Es simétrica respecto al eje Y', 'Es simétrica respecto al origen', 'Tiene un mínimo en (0,0)', 'Su dominio son solo los reales positivos'],
    correct: 1,
    explanation: 'Como f(-x) = -f(x), es una función impar y simétrica respecto al origen.',
    hint: 'Evalúa f(-x) y compárala con f(x).',
    points: 100
  },
  {
    id: 3118, topic: 'algebra', type: 'multiple',
    question: '¿Cuál es la amplitud de h(x) = -5·sen(2x) + 3?',
    options: ['-5', '5', '3', '2'],
    correct: 1,
    explanation: 'Amplitud = |-5| = 5.',
    hint: 'La amplitud es el valor absoluto del coeficiente que multiplica a la función.',
    points: 100
  },
  {
    id: 3119, topic: 'algebra', type: 'multiple',
    question: 'Resuelve { x + y = 10 ; x - y = 4 }.',
    options: ['x = 7, y = 3', 'x = 6, y = 4', 'x = 8, y = 2', 'x = 5, y = 5'],
    correct: 0,
    explanation: 'Sumando ambas ecuaciones: 2x = 14 ⇒ x = 7, luego y = 3.',
    hint: 'Suma las dos ecuaciones para eliminar y.',
    points: 100
  },
  {
    id: 3120, topic: 'algebra', type: 'multiple',
    question: 'Se puede determinar la solución única del sistema { ax + by = c ; dx + ey = f } si: (1) a×e - b×d ≠ 0 ; (2) c = f = 0',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 0,
    explanation: 'La condición de determinante distinto de cero (ae - bd ≠ 0) garantiza por la Regla de Cramer una solución única.',
    hint: '¿Qué condición garantiza que un sistema 2×2 tenga solución única?',
    points: 150
  },
  {
    id: 3121, topic: 'algebra', type: 'multiple',
    question: 'Se puede determinar si las raíces de x² + bx + c = 0 son reales si: (1) c < 0 ; (2) b = 0',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 0,
    explanation: 'Δ = b² - 4ac. Si c < 0, entonces -4ac > 0, haciendo Δ > 0 (raíces reales y distintas) sin importar b.',
    hint: 'Analiza el signo del discriminante con c < 0.',
    points: 150
  },
  {
    id: 3122, topic: 'algebra', type: 'multiple',
    question: 'Se puede saber si f(x) = aˣ es creciente si se sabe que: (1) a > 1 ; (2) f(2) = 9',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Cada una por sí sola'],
    correct: 3,
    explanation: '(1) por definición determina crecimiento. De (2) a² = 9 ⇒ a = 3 > 1, lo que también lo determina.',
    hint: '¿Qué condición sobre la base determina si una exponencial es creciente?',
    points: 150
  },
  {
    id: 3123, topic: 'algebra', type: 'multiple',
    question: 'Se puede determinar el valor de tan(α) si se conoce: (1) sen(α) = 3/5 ; (2) α pertenece al I Cuadrante',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 2,
    explanation: 'El seno positivo da dos posibles cuadrantes (I o II). La condición (2) fija el signo del coseno a positivo, permitiendo calcular tan(α).',
    hint: '¿En qué cuadrantes el seno es positivo?',
    points: 150
  },
  {
    id: 3124, topic: 'algebra', type: 'multiple',
    question: 'Se puede determinar si un sistema de ecuaciones no tiene solución si: (1) Las rectas son paralelas ; (2) Tienen distinto coeficiente de posición',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 2,
    explanation: 'Paralelas (1) con distinto coeficiente (2) garantiza rectas no coincidentes y por ende sin intersección.',
    hint: '¿Qué condiciones deben cumplir dos rectas para no tener punto de intersección?',
    points: 100
  },
  {
    id: 3125, topic: 'algebra', type: 'multiple',
    question: 'Se puede determinar cos(α) si se conoce: (1) tan(α) = 1 ; (2) α es agudo',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 2,
    explanation: 'tan(α) = 1 para α agudo fija α = 45°, permitiendo determinar cos(45°) = √2/2.',
    hint: '¿Para qué ángulo agudo la tangente vale 1?',
    points: 150
  },
  {
    id: 3126, topic: 'algebra', type: 'multiple',
    question: 'Se puede determinar la solución única del sistema { ax + by = c ; dx + ey = f } si: (1) a×e - b×d ≠ 0 ; (2) c = f = 0',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 0,
    explanation: 'La condición de determinante distinto de cero (ae - bd ≠ 0) garantiza por la Regla de Cramer una solución única.',
    hint: '¿Qué condición garantiza que un sistema 2×2 tenga solución única?',
    points: 100
  },
  {
    id: 3127, topic: 'algebra', type: 'multiple',
    question: 'Se puede saber si f(x) = aˣ es creciente si se sabe que: (1) a > 1 ; (2) f(2) = 9',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Cada una por sí sola'],
    correct: 3,
    explanation: '(1) por definición determina crecimiento. De (2) a² = 9 ⇒ a = 3 > 1, lo que también lo determina.',
    hint: '¿Qué condición sobre la base determina si una exponencial es creciente?',
    points: 100
  },
  {
    id: 3128, topic: 'algebra', type: 'multiple',
    question: 'Se puede determinar si las raíces de x² + bx + c = 0 son reales si: (1) c < 0 ; (2) b = 0',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 0,
    explanation: 'Δ = b² - 4ac. Si c < 0, entonces -4ac > 0, haciendo Δ > 0 (raíces reales y distintas) sin importar b.',
    hint: 'Analiza el signo del discriminante con c < 0.',
    points: 100
  },
  {
    id: 3129, topic: 'algebra', type: 'multiple',
    question: 'Se puede determinar el valor de tan(α) si se conoce: (1) sen(α) = 3/5 ; (2) α pertenece al I Cuadrante',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 2,
    explanation: 'El seno positivo da dos posibles cuadrantes (I o II). La condición (2) fija el signo del coseno a positivo.',
    hint: '¿En qué cuadrantes el seno es positivo?',
    points: 100
  },
  {
    id: 3130, topic: 'algebra', type: 'multiple',
    question: 'Se puede determinar cos(α) si se conoce: (1) tan(α) = 1 ; (2) α es agudo',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 2,
    explanation: 'tan(α) = 1 para α agudo fija α = 45°, permitiendo determinar cos(45°) = √2/2.',
    hint: '¿Para qué ángulo agudo la tangente vale 1?',
    points: 100
  },

  // ================================================================
  // EJE: GEOMETRÍA (25 preguntas)
  // ================================================================
  {
    id: 3201, topic: 'geometria', type: 'multiple',
    question: 'Un triángulo ABC de área 12 cm² se transforma mediante homotecia de razón k = 3. ¿Cuál es el área del triángulo homotético?',
    options: ['36 cm²', '108 cm²', '72 cm²', '144 cm²'],
    correct: 1,
    explanation: 'El área de la figura transformada es k² veces el área original: Área\' = 3² × 12 = 9 × 12 = 108 cm².',
    hint: 'El área se multiplica por el cuadrado de la razón de homotecia.',
    points: 150
  },
  {
    id: 3202, topic: 'geometria', type: 'multiple',
    question: 'En un triángulo rectángulo ABC (recto en C), si tan(A) = 3/4, ¿cuál es el valor de sen(A)?',
    options: ['3/5', '4/5', '3/4', '5/3'],
    correct: 0,
    explanation: 'Opuesto = 3, Adyacente = 4. Hipotenusa = √(3² + 4²) = 5. Luego sen(A) = Opuesto / Hipotenusa = 3/5.',
    hint: 'Usa el teorema de Pitágoras para encontrar la hipotenusa.',
    points: 100
  },
  {
    id: 3203, topic: 'geometria', type: 'multiple',
    question: 'Desde un punto P exterior a una circunferencia se traza una secante PAB y una tangente PT. Si PT = 6 cm y PA = 4 cm, ¿cuánto mide AB?',
    options: ['5 cm', '9 cm', '2 cm', '4,5 cm'],
    correct: 0,
    explanation: 'Por Teorema de la Tangente: PT² = PA × PB ⇒ 36 = 4 × PB ⇒ PB = 9 cm. Luego AB = PB - PA = 9 - 4 = 5 cm.',
    hint: 'Aplica el teorema de la tangente y la secante.',
    points: 200
  },
  {
    id: 3204, topic: 'geometria', type: 'multiple',
    question: 'Si el radio de una esfera se duplica, ¿por qué factor se multiplica su volumen?',
    options: ['2', '4', '8', '16'],
    correct: 2,
    explanation: 'El volumen es proporcional al cubo del radio: V\' = (4/3)π(2R)³ = 8 × [(4/3)πR³] = 8V.',
    hint: 'El volumen de una esfera depende del cubo del radio.',
    points: 100
  },
  {
    id: 3205, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es la ecuación de la recta que pasa por P(1, 2) y es perpendicular a la recta L: y = 2x + 5?',
    options: ['y = -1/2 x + 5/2', 'y = -2x + 4', 'y = 1/2 x + 3/2', 'y = 2x'],
    correct: 0,
    explanation: 'La pendiente m₁ = 2, luego m₂ = -1/2. Ecuación: y - 2 = -1/2(x - 1) ⇒ y = -1/2 x + 5/2.',
    hint: 'La pendiente de una recta perpendicular es el recíproco negativo.',
    points: 150
  },
  {
    id: 3206, topic: 'geometria', type: 'multiple',
    question: 'Una homotecia con razón k = -2 aplicada a un segmento AB produce un segmento A\'B\'. ¿Qué característica se cumple?',
    options: ['Es del doble de tamaño e invertido respecto al centro', 'Es de la mitad de tamaño e invertido', 'Es del doble de tamaño y conserva la orientación', 'Es idéntico al original'],
    correct: 0,
    explanation: '|k| = 2 amplía al doble, y k < 0 invierte la figura respecto al centro de homotecia.',
    hint: 'El signo negativo invierte la orientación; el valor absoluto amplía.',
    points: 100
  },
  {
    id: 3207, topic: 'geometria', type: 'multiple',
    question: 'Si en un triángulo rectángulo cos(θ) = √3/2, ¿cuál es el valor de sen(θ)?',
    options: ['1/2', '√2/2', '√3/3', '1'],
    correct: 0,
    explanation: 'Corresponde a un ángulo notable de 30°: cos(30°) = √3/2 ⇒ sen(30°) = 1/2.',
    hint: 'Recuerda los valores de las funciones trigonométricas para ángulos notables.',
    points: 100
  },
  {
    id: 3208, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es el volumen de una esfera de radio R = 3 cm?',
    options: ['36π cm³', '12π cm³', '108π cm³', '27π cm³'],
    correct: 0,
    explanation: 'V = (4/3)πR³ = (4/3)π(3)³ = (4/3) × 27 × π = 36π cm³.',
    hint: 'Aplica la fórmula V = (4/3)πR³.',
    points: 100
  },
  {
    id: 3209, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es el punto de intersección entre las rectas L1: x + y = 4 y L2: 2x - y = 2?',
    options: ['(2, 2)', '(3, 1)', '(1, 3)', '(4, 0)'],
    correct: 0,
    explanation: 'Sumando ambas ecuaciones: 3x = 6 ⇒ x = 2. Sustituyendo en L1: 2 + y = 4 ⇒ y = 2.',
    hint: 'Suma las ecuaciones para eliminar y.',
    points: 100
  },
  {
    id: 3210, topic: 'geometria', type: 'multiple',
    question: 'En un triángulo inscrito en una semicircunferencia, donde un lado es el diámetro, el ángulo opuesto al diámetro mide siempre:',
    options: ['45°', '60°', '90°', '180°'],
    correct: 2,
    explanation: 'Por Teorema de Tales en la circunferencia, todo ángulo inscrito que abarca un semicírculo (180°) mide 90°.',
    hint: 'Recuerda el Teorema de Tales.',
    points: 100
  },
  {
    id: 3211, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es el ángulo de inclinación de la recta L: √3 x - y + 2 = 0?',
    options: ['60°', '30°', '45°', '120°'],
    correct: 0,
    explanation: 'Despejando y = √3 x + 2. La pendiente es m = √3. Dado que tan(θ) = √3, θ = 60°.',
    hint: 'La pendiente de una recta es la tangente de su ángulo de inclinación.',
    points: 150
  },
  {
    id: 3212, topic: 'geometria', type: 'multiple',
    question: 'Una esfera está inscrita en un cubo de arista a = 6 cm. ¿Cuál es el volumen de la esfera?',
    options: ['36π cm³', '288π cm³', '72π cm³', '108π cm³'],
    correct: 0,
    explanation: 'El diámetro de la esfera es igual a la arista del cubo (d = 6 cm ⇒ R = 3 cm). V = (4/3)π(3³) = 36π cm³.',
    hint: 'El diámetro de la esfera inscrita es igual a la arista del cubo.',
    points: 150
  },
  {
    id: 3213, topic: 'geometria', type: 'multiple',
    question: 'Un punto P(4, -2) se transforma en P\'(-2, 1) mediante una homotecia con centro en el origen. ¿Cuál es la razón k?',
    options: ['-1/2', '-2', '1/2', '2'],
    correct: 0,
    explanation: 'P\' = k × P ⇒ (-2, 1) = k × (4, -2). Despejando: -2 = 4k ⇒ k = -1/2.',
    hint: 'Divide las coordenadas de la imagen entre las del punto original.',
    points: 100
  },
  {
    id: 3214, topic: 'geometria', type: 'multiple',
    question: 'Si a un segmento AB de longitud 12 cm se le aplica una homotecia con razón k = -1,5, ¿cuál es la longitud de A\'B\'?',
    options: ['-18 cm', '8 cm', '18 cm', '24 cm'],
    correct: 2,
    explanation: 'La longitud resultante es |k| × AB = |-1,5| × 12 = 18 cm.',
    hint: 'La longitud siempre es positiva; usa el valor absoluto de k.',
    points: 100
  },
  {
    id: 3215, topic: 'geometria', type: 'multiple',
    question: 'En un triángulo rectángulo, si cos(α) = 5/13, ¿cuál es el valor de tan(α)?',
    options: ['12/13', '12/5', '5/12', '13/12'],
    correct: 1,
    explanation: 'sen(α) = √(1 - (5/13)²) = 12/13. Luego tan(α) = sen/cos = (12/13)/(5/13) = 12/5.',
    hint: 'Encuentra primero sen(α) usando la identidad pitagórica.',
    points: 150
  },
  {
    id: 3216, topic: 'geometria', type: 'multiple',
    question: 'Dos cuerdas AB y CD se cortan en P dentro de una circunferencia. Si AP = 6 cm, PB = 4 cm y CP = 3 cm, ¿cuánto mide PD?',
    options: ['8 cm', '9 cm', '4,5 cm', '2 cm'],
    correct: 0,
    explanation: 'Por teorema de las cuerdas: AP × PB = CP × PD ⇒ 6 × 4 = 3 × PD ⇒ PD = 8 cm.',
    hint: 'Aplica el teorema de las cuerdas.',
    points: 150
  },
  {
    id: 3217, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es el área de la superficie de una esfera cuyo volumen es 12π cm³?',
    options: ['12π cm²', '36π cm²', '4π × 81^(1/3) cm²', '4π × 9^(1/3) cm²'],
    correct: 2,
    explanation: 'V = (4/3)πR³ = 12π ⇒ R³ = 9. Área = 4πR² = 4π(9^(1/3))² = 4π × 81^(1/3) cm².',
    hint: 'Despeja el radio del volumen y sustitúyelo en la fórmula del área.',
    points: 200
  },
  {
    id: 3218, topic: 'geometria', type: 'multiple',
    question: '¿Cuál es la distancia del punto P(3, -2) a la recta L: 4x - 3y + 2 = 0?',
    options: ['2', '4', '5', '20'],
    correct: 1,
    explanation: 'd = |4(3) - 3(-2) + 2| / √(4² + (-3)²) = |12 + 6 + 2| / 5 = 20/5 = 4.',
    hint: 'Aplica la fórmula de distancia de un punto a una recta.',
    points: 150
  },
  {
    id: 3219, topic: 'geometria', type: 'multiple',
    question: 'Si un ángulo inscrito subtiende un arco de 80°, ¿cuánto mide su ángulo central correspondiente?',
    options: ['40°', '80°', '160°', '120°'],
    correct: 1,
    explanation: 'La medida del ángulo central coincide exactamente con la medida del arco que subtiende (80°).',
    hint: 'El ángulo central mide lo mismo que el arco que subtiende.',
    points: 100
  },
  {
    id: 3220, topic: 'geometria', type: 'multiple',
    question: 'Las rectas L1: y = 2x + 1 y L2: y = 2x - 5 son:',
    options: ['Coincidentes', 'Perpendiculares', 'Paralelas no coincidentes', 'Secantes no perpendiculares'],
    correct: 2,
    explanation: 'Tienen igual pendiente (m = 2) y distinto coeficiente de posición (1 ≠ -5).',
    hint: 'Compara las pendientes de ambas rectas.',
    points: 100
  },
  {
    id: 3221, topic: 'geometria', type: 'multiple',
    question: 'Hipotenusa = 10 cm y un ángulo es 30°. ¿Cuánto mide el cateto opuesto?',
    options: ['5 cm', '5√3 cm', '10√3 cm', '2,5 cm'],
    correct: 0,
    explanation: 'sen(30°) = opuesto / 10 ⇒ 1/2 = x/10 ⇒ x = 5 cm.',
    hint: 'Usa sen(30°) = 1/2.',
    points: 100
  },
  {
    id: 3222, topic: 'geometria', type: 'multiple',
    question: 'Si el área de la superficie esférica es 100π cm², ¿cuál es su radio?',
    options: ['5 cm', '10 cm', '25 cm', '50 cm'],
    correct: 0,
    explanation: '4πR² = 100π ⇒ R² = 25 ⇒ R = 5 cm.',
    hint: 'Despeja R de la fórmula del área de la esfera.',
    points: 100
  },
  {
    id: 3223, topic: 'geometria', type: 'multiple',
    question: 'Al aplicar una homotecia con centro en (0,0) y k = 3 al punto P(-2, 5), se obtiene:',
    options: ['(-6, 15)', '(1, 8)', '(-5, 2)', '(6, -15)'],
    correct: 0,
    explanation: 'P\' = k × P = 3 × (-2, 5) = (-6, 15).',
    hint: 'Multiplica cada coordenada por la razón de homotecia.',
    points: 100
  },
  {
    id: 3224, topic: 'geometria', type: 'multiple',
    question: 'Se puede calcular el área de un triángulo rectángulo ABC si se conoce: (1) La longitud de la hipotenusa ; (2) El valor de sen(A)',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 2,
    explanation: 'Con la hipotenusa y sen(A) se obtiene el cateto opuesto, y con Pitágoras el cateto adyacente, permitiendo calcular el área.',
    hint: '¿Qué datos necesitas para calcular el área de un triángulo rectángulo?',
    points: 150
  },
  {
    id: 3225, topic: 'geometria', type: 'multiple',
    question: 'Se puede saber si L1 y L2 son perpendiculares si: (1) L1 tiene ecuación 2x - y = 3 ; (2) L2 pasa por (0,0) y (-2,1)',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 2,
    explanation: 'De (1) m₁ = 2. De (2) m₂ = (1-0)/(-2-0) = -1/2. m₁ × m₂ = -1, demostrando perpendicularidad con ambas juntas.',
    hint: 'Calcula las pendientes y verifica si su producto es -1.',
    points: 150
  },

  // ================================================================
  // EJE: PROBABILIDAD Y ESTADÍSTICA (20 preguntas)
  // ================================================================
  {
    id: 3301, topic: 'estadistica', type: 'multiple',
    question: 'Para los datos {2, 4, 6, 8, 10}, ¿cuál es la desviación estándar poblacional?',
    options: ['√8', '8', '√4', '2'],
    correct: 0,
    explanation: 'Media = 6. Varianza = [(2-6)²+(4-6)²+(6-6)²+(8-6)²+(10-6)²] / 5 = 40/5 = 8. Desviación = √8.',
    hint: 'Calcula la media, las diferencias al cuadrado y luego la raíz de la varianza.',
    points: 150
  },
  {
    id: 3302, topic: 'probabilidad', type: 'multiple',
    question: 'Se lanza un dado de 6 caras. Sabiendo que el resultado es un número par, ¿cuál es la probabilidad de que sea mayor que 3?',
    options: ['2/3', '1/3', '1/2', '1/6'],
    correct: 0,
    explanation: 'Pares B = {2, 4, 6}. Mayores que 3 de ese conjunto A ∩ B = {4, 6}. P(A|B) = 2/3.',
    hint: 'Aplica la fórmula de probabilidad condicional.',
    points: 150
  },
  {
    id: 3303, topic: 'probabilidad', type: 'multiple',
    question: '¿De cuántas formas distintas se pueden elegir 3 estudiantes de un grupo de 5?',
    options: ['10', '60', '20', '15'],
    correct: 0,
    explanation: 'Combinatoria C(5,3) = 5! / (3! × 2!) = (5 × 4) / 2 = 10.',
    hint: 'Usa la fórmula de combinaciones.',
    points: 100
  },
  {
    id: 3304, topic: 'probabilidad', type: 'multiple',
    question: 'Una moneda no cargada se lanza 4 veces. ¿Cuál es la probabilidad de obtener exactamente 2 caras?',
    options: ['3/8', '1/4', '1/2', '5/16'],
    correct: 0,
    explanation: 'Modelo Binomial B(4, 0.5): C(4,2) × (1/2)² × (1/2)² = 6 × 1/16 = 6/16 = 3/8.',
    hint: 'Usa la distribución binomial.',
    points: 150
  },
  {
    id: 3305, topic: 'estadistica', type: 'multiple',
    question: 'Si a todos los datos de un conjunto se les suma una constante c = 5, ¿qué sucede con la varianza?',
    options: ['Se mantiene igual', 'Aumenta en 5', 'Aumenta en 25', 'Se multiplica por 5'],
    correct: 0,
    explanation: 'Sumar una constante traslada todos los datos y la media por igual, por lo que las distancias a la media no cambian.',
    hint: 'La varianza mide dispersión, no posición.',
    points: 100
  },
  {
    id: 3306, topic: 'probabilidad', type: 'multiple',
    question: '¿Cuántas palabras distintas de 4 letras (con o sin sentido) se pueden formar con las letras de "GATO" sin repetir?',
    options: ['24', '12', '16', '256'],
    correct: 0,
    explanation: 'Permutación simple de 4 elementos: 4! = 4 × 3 × 2 × 1 = 24.',
    hint: 'Usa el factorial del número de letras.',
    points: 100
  },
  {
    id: 3307, topic: 'probabilidad', type: 'multiple',
    question: 'Si P(A) = 0,6, P(B) = 0,4 y P(A ∩ B) = 0,2, ¿cuál es el valor de P(B|A)?',
    options: ['1/3', '1/2', '2/3', '1/4'],
    correct: 0,
    explanation: 'P(B|A) = P(A ∩ B) / P(A) = 0,2 / 0,6 = 2/6 = 1/3.',
    hint: 'Aplica la fórmula de probabilidad condicional.',
    points: 100
  },
  {
    id: 3308, topic: 'estadistica', type: 'multiple',
    question: 'En una distribución normal estandarizada Z ~ N(0, 1), ¿cuál es el valor de P(Z ≤ 0)?',
    options: ['0,5', '0', '1', '0,25'],
    correct: 0,
    explanation: 'La distribución normal es simétrica respecto a su media (μ = 0), dividiendo la probabilidad total en dos áreas iguales de 0,5.',
    hint: 'La curva normal es simétrica respecto a la media.',
    points: 100
  },
  {
    id: 3309, topic: 'estadistica', type: 'multiple',
    question: 'El coeficiente de variación de una muestra con media 20 y desviación estándar 4 es:',
    options: ['20%', '5%', '25%', '80%'],
    correct: 0,
    explanation: 'CV = (σ / x̄) × 100% = (4 / 20) × 100% = 0,20 × 100% = 20%.',
    hint: 'Divide la desviación estándar entre la media y multiplica por 100.',
    points: 100
  },
  {
    id: 3310, topic: 'probabilidad', type: 'multiple',
    question: '¿De cuántas formas se pueden organizar 5 libros distintos en un estante?',
    options: ['120', '25', '60', '24'],
    correct: 0,
    explanation: 'Permutación de 5 elementos: 5! = 5 × 4 × 3 × 2 × 1 = 120.',
    hint: 'Usa el factorial del número de libros.',
    points: 100
  },
  {
    id: 3311, topic: 'estadistica', type: 'multiple',
    question: 'Si X ~ N(100, 16), ¿cuál es el valor estandarizado Z correspondiente a X = 108?',
    options: ['2', '0,5', '1', '1,5'],
    correct: 0,
    explanation: 'σ = √16 = 4. Fórmula de Z = (X - μ) / σ = (108 - 100) / 4 = 8 / 4 = 2.',
    hint: 'Aplica la fórmula de estandarización Z = (X - μ) / σ.',
    points: 100
  },
  {
    id: 3312, topic: 'probabilidad', type: 'multiple',
    question: '¿Cuántos comités de 4 personas se pueden formar con 6 hombres y 4 mujeres, si debe haber exactamente 2 hombres?',
    options: ['90', '210', '45', '180'],
    correct: 0,
    explanation: 'C(6,2) × C(4,2) = 15 × 6 = 90.',
    hint: 'Multiplica las combinaciones de hombres por las de mujeres.',
    points: 200
  },
  {
    id: 3313, topic: 'estadistica', type: 'multiple',
    question: 'Si todos los datos de una muestra son iguales a k, ¿cuál es el valor de la varianza?',
    options: ['k', 'k²', '0', '1'],
    correct: 2,
    explanation: 'Al no haber variabilidad de los datos respecto a su media, las desviaciones son cero y la varianza es 0.',
    hint: 'Si todos los datos son iguales, no hay dispersión.',
    points: 100
  },
  {
    id: 3314, topic: 'probabilidad', type: 'multiple',
    question: 'Si A y B son eventos independientes con P(A) = 0,4 y P(B) = 0,5, ¿cuánto vale P(A|B)?',
    options: ['0,2', '0,4', '0,5', '0,9'],
    correct: 1,
    explanation: 'Para eventos independientes, P(A|B) = P(A) = 0,4.',
    hint: 'En eventos independientes, la probabilidad condicional es igual a la probabilidad simple.',
    points: 100
  },
  {
    id: 3315, topic: 'probabilidad', type: 'multiple',
    question: '¿De cuántas formas se pueden sentar 6 personas en una mesa redonda?',
    options: ['720', '120', '360', '64'],
    correct: 1,
    explanation: 'Permutación circular: (6 - 1)! = 5! = 120.',
    hint: 'En permutaciones circulares se fija un elemento y se permutan los demás.',
    points: 150
  },
  {
    id: 3316, topic: 'estadistica', type: 'multiple',
    question: 'Si X ~ N(μ = 50, σ = 5), ¿qué porcentaje aproximado de datos se encuentra en [45, 55]?',
    options: ['50%', '68,3%', '95,4%', '99,7%'],
    correct: 1,
    explanation: 'El intervalo [45, 55] corresponde a μ ± 1σ, que abarca aproximadamente el 68,3% de los datos.',
    hint: 'Recuerda la regla 68-95-99,7.',
    points: 100
  },
  {
    id: 3317, topic: 'probabilidad', type: 'multiple',
    question: '¿Cuántos números de 3 dígitos distintos se forman con {1, 2, 3, 4, 5, 6}?',
    options: ['20', '120', '216', '720'],
    correct: 1,
    explanation: 'Variación V(6, 3) = 6 × 5 × 4 = 120.',
    hint: 'Usa la fórmula de variaciones sin repetición.',
    points: 100
  },
  {
    id: 3318, topic: 'estadistica', type: 'multiple',
    question: 'Si el coeficiente de variación es 20% y la media es 15, ¿cuál es la desviación estándar?',
    options: ['3', '0,3', '75', '300'],
    correct: 0,
    explanation: '0,20 = σ / 15 ⇒ σ = 0,20 × 15 = 3.',
    hint: 'Despeja σ de la fórmula CV = σ / x̄.',
    points: 100
  },
  {
    id: 3319, topic: 'probabilidad', type: 'multiple',
    question: 'Para X ~ B(n=10, p=0,3), ¿cuál es el valor esperado (media)?',
    options: ['3', '2,1', '0,3', '7'],
    correct: 0,
    explanation: 'E(X) = n × p = 10 × 0,3 = 3.',
    hint: 'La media de una binomial es n × p.',
    points: 100
  },
  {
    id: 3320, topic: 'probabilidad', type: 'multiple',
    question: 'Se puede determinar P(A|B) si se conoce: (1) P(A ∩ B) = 0,15 ; (2) P(B) = 0,30',
    options: ['(1) por sí sola', '(2) por sí sola', 'Ambas juntas', 'Se requiere información adicional'],
    correct: 2,
    explanation: 'P(A|B) = P(A ∩ B) / P(B). Se requiere conocer numerador y denominador simultáneamente.',
    hint: 'Recuerda la fórmula de probabilidad condicional.',
    points: 100
  }
];

// ============================================================================
// EXPORTACIÓN
// ============================================================================
const paesBancoM2 = {
  version: "1.0.0",
  totalQuestions: paesM2Questions.length,
  questions: paesM2Questions
};

console.log('📊 Banco de Matemática 2 (M2) cargado: ' + paesM2Questions.length + ' preguntas');
