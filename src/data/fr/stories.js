/* Mismos cinco cuentos que en inglés, pero escritos en francés, no
   traducidos palabra por palabra: cada idioma dice las cosas a su
   manera (en francés «bonjour» sirve para la mañana y la tarde). */

export const STORIES = [
  {
    id: "chat-gris",
    title: "Le petit chat gris",
    title_es: "El gatito gris",
    blurb: "Un gato curioso, un pájaro azul y un árbol demasiado alto. Presente y vocabulario de casa y jardín.",
    level: "Fácil",
    cefr: "A1",
    pages: [
      {
        illustration: "Mimi en la puerta de una casita, con el parque al fondo",
        sentences: [
          ["Le petit chat s'appelle Mimi.", "El gatito se llama Mimi."],
          ["Il est gris et blanc.", "Es gris y blanco."],
          ["Il habite dans une petite maison.", "Vive en una casa pequeña."],
          ["La maison est près du parc.", "La casa está cerca del parque."],
          ["Mimi aime beaucoup le parc.", "A Mimi le gusta mucho el parque."],
        ],
      },
      {
        illustration: "Un pájaro azul cantando en la rama de un árbol",
        sentences: [
          ["Aujourd'hui, il fait beau.", "Hoy hace buen tiempo."],
          ["Mimi sort dans le jardin.", "Mimi sale al jardín."],
          ["Il voit un oiseau bleu.", "Ve un pájaro azul."],
          ["L'oiseau chante dans l'arbre.", "El pájaro canta en el árbol."],
          ["Mimi écoute la chanson.", "Mimi escucha la canción."],
        ],
      },
      {
        illustration: "El gato agarrado a una rama muy alta, mirando hacia abajo",
        sentences: [
          ["Le chat monte sur l'arbre.", "El gato sube al árbol."],
          ["Mais l'arbre est très haut.", "Pero el árbol es muy alto."],
          ["Mimi a peur.", "Mimi tiene miedo."],
          ["Il ne peut pas descendre.", "No puede bajar."],
          ["Il appelle : « Miaou ! Miaou ! »", "Llama: «¡Miau! ¡Miau!»"],
        ],
      },
      {
        illustration: "Léa parada en una silla, con el gato en brazos",
        sentences: [
          ["Une petite fille arrive.", "Llega una nena."],
          ["Elle s'appelle Léa.", "Se llama Léa."],
          ["Léa monte sur une chaise.", "Léa se sube a una silla."],
          ["Elle prend le chat dans ses bras.", "Toma al gato en sus brazos."],
          ["Maintenant, Mimi est content.", "Ahora Mimi está contento."],
          ["Il joue avec Léa dans le jardin.", "Juega con Léa en el jardín."],
        ],
      },
    ],
  },

  {
    id: "salutations",
    title: "Bonjour !",
    title_es: "¡Buen día!",
    blurb: "Cómo saludar a la mañana, a la tarde y a la noche. Ojo: en francés «bonjour» sirve para las dos primeras.",
    level: "Fácil",
    cefr: "A1",
    pages: [
      {
        illustration: "Dos personas saludándose en la vereda, con sol de mañana",
        sentences: [
          ["Bonjour ! Comment vas-tu ?", "¡Buen día! ¿Cómo estás?"],
          ["Je vais très bien, merci.", "Estoy muy bien, gracias."],
          ["Je m'appelle Ana. Et toi ?", "Me llamo Ana. ¿Y vos?"],
          ["Je m'appelle Tom. Enchanté.", "Me llamo Tom. Encantado."],
        ],
      },
      {
        illustration: "Un reloj marcando las tres de la tarde sobre una plaza",
        sentences: [
          ["Bonjour, monsieur.", "Buenas tardes, señor."],
          ["Bonjour. Comment va votre journée ?", "Buenas tardes. ¿Cómo va su día?"],
          ["C'est une bonne journée, merci.", "Es un buen día, gracias."],
          ["À plus tard !", "¡Hasta luego!"],
        ],
      },
      {
        illustration: "Una ventana iluminada de noche, con la luna afuera",
        sentences: [
          ["Bonsoir, madame.", "Buenas noches, señora."],
          ["Bonsoir. Vous êtes fatigué ?", "Buenas noches. ¿Está cansado?"],
          ["Oui, un peu. Bonne nuit.", "Sí, un poco. Buenas noches."],
          ["Bonne nuit. À demain.", "Buenas noches. Hasta mañana."],
        ],
      },
    ],
  },

  {
    id: "directions",
    title: "Où est la gare ?",
    title_es: "¿Dónde queda la estación?",
    blurb: "Preguntar por un lugar, entender la respuesta y saber si queda cerca o lejos.",
    level: "Fácil",
    cefr: "A1",
    pages: [
      {
        illustration: "Una persona con un mapa preguntando en una esquina",
        sentences: [
          ["Excusez-moi, où est la gare ?", "Disculpe, ¿dónde queda la estación?"],
          ["C'est près d'ici. Allez tout droit.", "Queda cerca. Siga derecho."],
          ["Puis tournez à gauche au coin.", "Después doble a la izquierda en la esquina."],
          ["Merci beaucoup !", "¡Muchas gracias!"],
        ],
      },
      {
        illustration: "Una parada de colectivo con el cartel del aeropuerto",
        sentences: [
          ["Comment aller à l'aéroport ?", "¿Cómo llego al aeropuerto?"],
          ["Vous pouvez prendre le bus.", "Puede tomar el colectivo."],
          ["L'arrêt de bus est à droite.", "La parada está a la derecha."],
          ["C'est loin ?", "¿Queda lejos?"],
        ],
      },
      {
        illustration: "Dos manos sosteniendo un mapa desplegado de la ciudad",
        sentences: [
          ["Non, c'est dix minutes.", "No, son diez minutos."],
          ["Avez-vous un plan ?", "¿Tiene un mapa?"],
          ["Oui, le voici.", "Sí, acá está."],
          ["Vous êtes très aimable. Au revoir !", "Es muy amable. ¡Adiós!"],
        ],
      },
    ],
  },

  {
    id: "journee-ville",
    title: "Une journée en ville",
    title_es: "Un día en la ciudad",
    blurb: "Los nombres de los lugares de todos los días y cómo decir dónde está cada uno.",
    level: "Fácil",
    cefr: "A1",
    pages: [
      {
        illustration: "Un mercado con puestos de fruta y pan por la mañana",
        sentences: [
          ["Le matin, je vais au marché.", "A la mañana voy al mercado."],
          ["Le supermarché est à côté de la banque.", "El supermercado está al lado del banco."],
          ["J'achète du pain et des fruits.", "Compro pan y fruta."],
          ["Ensuite je marche jusqu'au parc.", "Después camino hasta el parque."],
        ],
      },
      {
        illustration: "Una calle con un hotel, un museo y una farmacia",
        sentences: [
          ["À midi je mange au restaurant.", "Al mediodía como en un restaurante."],
          ["L'hôtel est en face du musée.", "El hotel está enfrente del museo."],
          ["L'hôpital est derrière l'école.", "El hospital está detrás de la escuela."],
          ["La pharmacie ouvre à neuf heures.", "La farmacia abre a las nueve."],
        ],
      },
      {
        illustration: "Una estación de tren al atardecer, con gente esperando",
        sentences: [
          ["Le soir je vais à la gare.", "A la tarde voy a la estación."],
          ["L'aéroport est loin de la ville.", "El aeropuerto queda lejos de la ciudad."],
          ["J'attends à l'arrêt de bus.", "Espero en la parada del colectivo."],
          ["Je rentre à la maison. Quelle longue journée !", "Vuelvo a casa. ¡Qué día largo!"],
        ],
      },
    ],
  },

  {
    id: "cafe",
    title: "Au café",
    title_es: "En el café",
    blurb: "Pedir una mesa, pedir de tomar, pedir que te hablen más despacio y pagar la cuenta.",
    level: "Fácil",
    cefr: "A1",
    pages: [
      {
        illustration: "La entrada de un café con mesas junto a la ventana",
        sentences: [
          ["Bonjour ! Une table pour deux, s'il vous plaît.", "¡Hola! Una mesa para dos, por favor."],
          ["Bien sûr. Suivez-moi.", "Por supuesto. Síganme."],
          ["Puis-je voir la carte ?", "¿Puedo ver el menú?"],
          ["Voilà.", "Acá tiene."],
        ],
      },
      {
        illustration: "Un café con leche y un vaso de agua sobre la mesa",
        sentences: [
          ["Je voudrais un café au lait.", "Quisiera un café con leche."],
          ["Et un verre d'eau, s'il vous plaît.", "Y un vaso de agua, por favor."],
          ["Pardon, je ne comprends pas.", "Perdón, no entiendo."],
          ["Pouvez-vous parler plus lentement ?", "¿Puede hablar más despacio?"],
        ],
      },
      {
        illustration: "La cuenta en un platito con unas monedas al lado",
        sentences: [
          ["C'est combien ?", "¿Cuánto es?"],
          ["Huit euros, s'il vous plaît.", "Ocho euros, por favor."],
          ["L'addition, s'il vous plaît.", "La cuenta, por favor."],
          ["Merci ! Bonne journée.", "¡Gracias! Buen día."],
        ],
      },
    ],
  },
];
