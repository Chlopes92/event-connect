// TODO => category ?
export interface EventCard {
  id: number;
  title: string;
  price: string;
  date: string;
  address: string;
  image: string;
  seats: number | string;
  description: string;
  program: string[];
  publicInfo: string;
  contact: {
    organizer: string;
    email: string;
    phone: string;
    website?: string;
  };
}

export const EVENTS_MOCK: EventCard[] = [
  {
    id: 1,
    title: "L’Odyssée des Couleurs",
    price: "20,00 €",
    date: "12/04",
    address: "Théâtre Lumière, 12 rue des Arts, Paris 3e",
    image: "assets/events/comedy.png",
    seats: 500,
    description: `L’Odyssée des Couleurs est une comédie musicale originale et flamboyante,
      mêlant chant, danse, théâtre et mise en scène immersive. Ce spectacle tout public raconte
      l’histoire de Nova, une jeune fille née dans un monde sans couleurs, qui décide de partir
      en quête des émotions perdues pour rendre sa vie plus vibrante. ...`,
    program: [
      "19h00 : Ouverture des portes – accueil musical dans le hall",
      "20h00 : Début du spectacle - Acte I – Le Monde Gris",
      "Acte II – La Rencontre avec la Joie",
      "Acte III – La Tempête des Larmes",
      "Acte IV – Le Feu de la Colère",
      "Acte V – Le Lever de l’Espoir",
      "21h45 : Standing ovation & rencontre libre avec les artistes"
    ],
    publicInfo: "À partir de 6 ans – Spectacle familial, accessible PMR – Durée : 1h45",
    contact: {
      organizer: "Compagnie Indigo Fusion",
      email: "contact@indigofusion.fr",
      phone: "01 72 98 32 15",
      website: "http://www.indigofusion.fr"
    }
  },
  {
    id: 2,
    title: "Lumières en Mouvement",
    price: "Gratuit",
    date: "15/04",
    address: "Atelier des Lumières, 38 rue Saint-Maur, 75011 Paris",
    image: "assets/events/digital-immersion.png",
    seats: 800,
    description: `Lumières en Mouvement est une exposition immersive qui transforme l’espace
      en un univers sensoriel total avec projections 360°, mapping et spatialisation sonore.`,
    program: [
      "10h00 – 12h30 : Parcours Naissance de la lumière",
      "14h00 – 15h30 : Atelier enfants Peindre avec la lumière",
      "16h00 – 17h30 : Expérience immersive Dans les rêves de Monet",
      "18h00 – 20h00 : Nocturne : mix visuel + musique ambient live"
    ],
    publicInfo: "Tout public. Enfants dès 6 ans. Accessible PMR. Français / anglais.",
    contact: {
      organizer: "Studio ArtTech",
      email: "contact@arttechstudio.fr",
      phone: "01 80 52 99 32",
      website: "http://www.arttechstudio.fr"
    }
  },
  {
    id: 3,
    title: "Fête Foraine Nocturne",
    price: "25,00 €",
    date: "18/04",
    address: "Esplanade de La Défense, Paris",
    image: "assets/events/funfair.png",
    seats: "env. 10 000 personnes attendues",
    description: `Quand tombe la nuit, La Défense se transforme en un immense parc féérique
      avec plus de 50 stands et manèges, une grande roue panoramique et spectacles.`,
    program: [
      "15h00 : Ouverture du site – food trucks & attractions",
      "17h00 : Parade lumineuse avec échassiers, confettis & musiciens",
      "19h00 : Animations interactives",
      "21h00 : DJ set & bal en plein air",
      "22h30 : Feu d’artifice final"
    ],
    publicInfo: "Tout public – Accès libre en continu – Zones enfants + ado/adultes",
    contact: {
      organizer: "Mairie de Paris – Service Animation Urbaine",
      email: "animations@paris.fr",
      phone: "01 44 67 83 20"
    }
  },
  {
    id: 4,
    title: "Colores del Sur",
    price: "10,00 €",
    date: "18/04",
    address: "Parc André Citroën, Paris 15e",
    image: "assets/events/latin-festival.png",
    seats: 2000,
    description: `Colores del Sur est un festival festif et musical aux couleurs de l’Amérique latine
      avec musiques, danses, gastronomie et performances.`,
    program: [
      "13h00 : Ouverture & défilé folklorique",
      "14h30 : Cours de danse collective",
      "16h00 : Ateliers cuisine et dégustation",
      "17h30 : Concert Mariachi & danses mexicaines",
      "19h00 : DJ Set Latino + fiesta dansante"
    ],
    publicInfo: "Tout public – Ambiance familiale et festive",
    contact: {
      organizer: "Association Latine Culture",
      email: "latineculture@gmail.com",
      phone: "06 84 45 77 10"
    }
  },
  {
    id: 5,
    title: "Hanami",
    price: "5,00 €",
    date: "24/04",
    address: "Parc Floral de Paris, Bois de Vincennes",
    image: "assets/events/hanami.png",
    seats: 1500,
    description: `Inspirée de la tradition japonaise du Hanami, cette journée propose une expérience zen,
      poétique et culturelle avec cérémonie du thé, ateliers et concerts acoustiques.`,
    program: [
      "11h00 : Cérémonie d’ouverture avec tambours Taiko",
      "12h00 : Pique-nique partagé sous les sakuras",
      "14h00 : Atelier origami et calligraphie japonaise",
      "15h30 : Démonstration de kendo & danse traditionnelle",
      "17h00 : Concert final : koto & chant haïku"
    ],
    publicInfo: "Tout public – Ambiance calme et respectueuse – Tenue blanche ou traditionnelle bienvenue",
    contact: {
      organizer: "Association Japon-France",
      email: "contact@japonfrance.org",
      phone: "07 51 23 90 48"
    }
  },
  // Tu peux ajouter ici les autres événements (6 à 9) de la même manière
];
