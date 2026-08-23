/* Cada oración es un par [inglés, español] ya alineado.
   La alineación se hace al ingestar, nunca al leer: si se tradujera
   la página entera y después se volviera a cortar, la cantidad de
   oraciones podría no coincidir y la traducción quedaría corrida. */

export const STORIES = [
  {
    id: "grey-cat",
    title: "The Little Grey Cat",
    title_es: "El gatito gris",
    blurb: "Un gato curioso, un pájaro azul y un árbol demasiado alto. Presente simple y vocabulario de casa y jardín.",
    level: "Fácil",
    cefr: "A1",
    pages: [
      {
        illustration: "Mimi en la puerta de una casita, con el parque al fondo",
        sentences: [
          ["The little cat's name is Mimi.", "El gatito se llama Mimi."],
          ["He is grey and white.", "Es gris y blanco."],
          ["He lives in a small house.", "Vive en una casa pequeña."],
          ["The house is near the park.", "La casa está cerca del parque."],
          ["Mimi loves the park.", "A Mimi le encanta el parque."],
        ],
      },
      {
        illustration: "Un pájaro azul cantando en la rama de un árbol",
        sentences: [
          ["Today it's sunny.", "Hoy está soleado."],
          ["Mimi goes out into the garden.", "Mimi sale al jardín."],
          ["He sees a blue bird.", "Ve un pájaro azul."],
          ["The bird sings in the tree.", "El pájaro canta en el árbol."],
          ["Mimi listens to the song.", "Mimi escucha la canción."],
        ],
      },
      {
        illustration: "El gato agarrado a una rama muy alta, mirando hacia abajo",
        sentences: [
          ["The cat climbs up the tree.", "El gato sube al árbol."],
          ["But the tree is very tall.", "Pero el árbol es muy alto."],
          ["Mimi is afraid.", "Mimi tiene miedo."],
          ["He can't come down.", "No puede bajar."],
          ["He calls: “Meow! Meow!”", "Llama: «¡Miau! ¡Miau!»"],
        ],
      },
      {
        illustration: "Lea parada en una silla, con el gato en brazos",
        sentences: [
          ["A little girl arrives.", "Llega una nena."],
          ["Her name is Lea.", "Se llama Lea."],
          ["Lea climbs onto a chair.", "Lea se sube a una silla."],
          ["She takes the cat in her arms.", "Toma al gato en sus brazos."],
          ["Now Mimi is happy.", "Ahora Mimi está contento."],
          ["He plays with Lea in the garden.", "Juega con Lea en el jardín."],
        ],
      },
    ],
  },

  {
    id: "greetings",
    title: "Good Morning!",
    title_es: "¡Buen día!",
    blurb: "Cómo saludar a la mañana, a la tarde y a la noche, y qué contestar cuando te preguntan cómo estás.",
    level: "Fácil",
    cefr: "A1",
    pages: [
      {
        illustration: "Dos personas saludándose en la vereda, con sol de mañana",
        sentences: [
          ["Good morning! How are you?", "¡Buen día! ¿Cómo estás?"],
          ["I am very well, thank you.", "Estoy muy bien, gracias."],
          ["My name is Ana. And you?", "Me llamo Ana. ¿Y vos?"],
          ["My name is Tom. Nice to meet you.", "Me llamo Tom. Encantado."],
        ],
      },
      {
        illustration: "Un reloj marcando las tres de la tarde sobre una plaza",
        sentences: [
          ["Good afternoon, sir.", "Buenas tardes, señor."],
          ["Good afternoon. How is your day?", "Buenas tardes. ¿Cómo va tu día?"],
          ["It is a good day, thank you.", "Es un buen día, gracias."],
          ["See you later!", "¡Hasta luego!"],
        ],
      },
      {
        illustration: "Una ventana iluminada de noche, con la luna afuera",
        sentences: [
          ["Good evening, madam.", "Buenas noches, señora."],
          ["Good evening. Are you tired?", "Buenas noches. ¿Estás cansado?"],
          ["Yes, a little. Good night.", "Sí, un poco. Buenas noches."],
          ["Good night. See you tomorrow.", "Buenas noches. Hasta mañana."],
        ],
      },
    ],
  },

  {
    id: "directions",
    title: "Where Is the Station?",
    title_es: "¿Dónde queda la estación?",
    blurb: "Preguntar por un lugar, entender la respuesta y saber si queda cerca o lejos.",
    level: "Fácil",
    cefr: "A1",
    pages: [
      {
        illustration: "Una persona con un mapa preguntando en una esquina",
        sentences: [
          ["Excuse me, where is the station?", "Disculpe, ¿dónde queda la estación?"],
          ["It is near. Go straight ahead.", "Queda cerca. Siga derecho."],
          ["Then turn left at the corner.", "Después doble a la izquierda en la esquina."],
          ["Thank you very much!", "¡Muchas gracias!"],
        ],
      },
      {
        illustration: "Una parada de colectivo con el cartel del aeropuerto",
        sentences: [
          ["How do I get to the airport?", "¿Cómo llego al aeropuerto?"],
          ["You can take the bus.", "Puede tomar el colectivo."],
          ["The bus stop is on the right.", "La parada está a la derecha."],
          ["Is it far?", "¿Queda lejos?"],
        ],
      },
      {
        illustration: "Dos manos sosteniendo un mapa desplegado de la ciudad",
        sentences: [
          ["No, it is ten minutes.", "No, son diez minutos."],
          ["Do you have a map?", "¿Tiene un mapa?"],
          ["Yes, here it is.", "Sí, acá está."],
          ["You are very kind. Goodbye!", "Es muy amable. ¡Adiós!"],
        ],
      },
    ],
  },

  {
    id: "city-day",
    title: "A Day in the City",
    title_es: "Un día en la ciudad",
    blurb: "Los nombres de los lugares de todos los días y cómo decir dónde está cada uno.",
    level: "Fácil",
    cefr: "A1",
    pages: [
      {
        illustration: "Un mercado con puestos de fruta y pan por la mañana",
        sentences: [
          ["In the morning I go to the market.", "A la mañana voy al mercado."],
          ["The supermarket is next to the bank.", "El supermercado está al lado del banco."],
          ["I buy bread and fruit.", "Compro pan y fruta."],
          ["Then I walk to the park.", "Después camino hasta el parque."],
        ],
      },
      {
        illustration: "Una calle con un hotel, un museo y una farmacia",
        sentences: [
          ["At noon I eat in a restaurant.", "Al mediodía como en un restaurante."],
          ["The hotel is in front of the museum.", "El hotel está enfrente del museo."],
          ["The hospital is behind the school.", "El hospital está detrás de la escuela."],
          ["The pharmacy opens at nine.", "La farmacia abre a las nueve."],
        ],
      },
      {
        illustration: "Una estación de tren al atardecer, con gente esperando",
        sentences: [
          ["In the evening I go to the train station.", "A la tarde voy a la estación de tren."],
          ["The airport is far from the city.", "El aeropuerto queda lejos de la ciudad."],
          ["I wait at the bus stop.", "Espero en la parada del colectivo."],
          ["I go home. What a long day!", "Vuelvo a casa. ¡Qué día largo!"],
        ],
      },
    ],
  },

  {
    id: "cafe",
    title: "At the Café",
    title_es: "En el café",
    blurb: "Pedir una mesa, pedir de tomar, pedir que te hablen más despacio y pagar la cuenta.",
    level: "Fácil",
    cefr: "A1",
    pages: [
      {
        illustration: "La entrada de un café con mesas junto a la ventana",
        sentences: [
          ["Hello! A table for two, please.", "¡Hola! Una mesa para dos, por favor."],
          ["Of course. Follow me, please.", "Por supuesto. Síganme, por favor."],
          ["Can I see the menu?", "¿Puedo ver el menú?"],
          ["Here you are.", "Acá tiene."],
        ],
      },
      {
        illustration: "Un café con leche y un vaso de agua sobre la mesa",
        sentences: [
          ["I would like a coffee with milk.", "Quisiera un café con leche."],
          ["And a glass of water, please.", "Y un vaso de agua, por favor."],
          ["Sorry, I do not understand.", "Perdón, no entiendo."],
          ["Can you speak more slowly?", "¿Puede hablar más despacio?"],
        ],
      },
      {
        illustration: "La cuenta en un platito con unas monedas al lado",
        sentences: [
          ["How much is it?", "¿Cuánto es?"],
          ["Eight euros, please.", "Ocho euros, por favor."],
          ["The bill, please.", "La cuenta, por favor."],
          ["Thank you! Have a good day.", "¡Gracias! Que tengas un buen día."],
        ],
      },
    ],
  },
];
