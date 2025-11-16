-- ==============================
-- INSERTION DES CATÉGORIES
-- ==============================
INSERT INTO public.t_categories (name_category) VALUES
('Tout'),
('Art'),
('Culturel'),
('Festival'),
('Loisirs'),
('Bien-être'),
('Plein Air'),
('Gaming'),
('Autres');

-- ==============================
-- INSERTION DES RÔLES
-- ==============================
INSERT INTO t_roles (role) VALUES ('Admin');
INSERT INTO t_roles (role) VALUES ('User');

-- ==============================
-- INSERTION DES PROFILS
-- ==============================
INSERT INTO t_profiles (email, first_name, last_name, password, phone, organization, role_id)
VALUES
('contact@arttechstudio.fr', 'Alice', 'Durand', 'password123', '0180529932', 'Studio ArtTech', 1),
('animations@paris.fr', 'Julien', 'Martin', 'password123', '0144678320', 'Mairie de Paris', 1),
('latineculture@gmail.com', 'Sofia', 'Lopez', 'password123', '0684457710', 'Latine Culture', 1),
('contact@japonfrance.org', 'Kenji', 'Ito', 'password123', '0751239048', 'Japon-France', 1),
('tournoi@pixelpulse.fr', 'Lucas', 'Bernard', 'password123', '0765442291', 'Pixel Pulse', 1),
('tremplin93@gmail.com', 'Emma', 'Dupuis', 'password123', '0612773890', 'Tremplin93', 1),
('contact@happycolors.fr', 'Priya', 'Singh', 'password123', '0971336412', 'Happy Festival France', 1),
('concertbois@gmail.com', 'Victor', 'Carrel', 'password123', '0145232202', 'Conservatoire & Amis du Bois', 1),
('contact@neoarcade.fr', 'Nathan', 'Morel', 'password123', '0177623105', 'Neo Arcade Paris', 1);

-- ==============================
-- INSERTION DES ÉVÉNEMENTS
-- ==============================
INSERT INTO t_events (
    name_event, img_url, description, date_event, program, contact, price, number_place, address, profile_id
) VALUES
(
    '🎶 L’Odyssée des Couleurs',
    'assets/events/comedy.png',
    E'L’Odyssée des Couleurs est une comédie musicale originale et flamboyante, mêlant chant, danse, théâtre et mise en scène immersive.\nCe spectacle tout public raconte l’histoire de Nova, une jeune fille née dans un monde sans couleurs, qui décide de partir en quête des émotions perdues pour rendre sa vie plus vibrante.',
    '2025-04-12',
    E'19h00 : Ouverture des portes\n20h00 : Début du spectacle\n21h45 : Standing ovation & rencontre avec les artistes',
    'Compagnie Indigo Fusion - contact@indigofusion.fr - 01 72 98 32 15',
    20.00,
    500,
    'Théâtre Lumière, 12 rue des Arts, Paris 3e',
    8
),
(
    '🖼️ Lumières en Mouvement',
    'assets/events/digital-immersion.png',
    E'“Lumières en Mouvement” est une exposition immersive qui transforme l’Atelier des Lumières en un univers sensoriel total. Grâce à des projections 360°, du mapping et une spatialisation sonore, les visiteurs interagissent avec des œuvres numériques évolutives.\nParcours libre à travers des espaces thématiques avec installations interactives : peindre avec ses pas, manipuler la lumière ou entrer dans des tableaux animés.',
    '2025-04-15',
    E'10h00-12h30 : Parcours “Naissance de la lumière”\n14h00-15h30 : Atelier enfants “Peindre avec la lumière”\n16h00-17h30 : Expérience immersive “Dans les rêves de Monet”\n18h00-20h00 : Nocturne : mix visuel + musique ambient live',
    'Studio ArtTech - contact@arttechstudio.fr - 01 80 52 99 32',
    0.00,
    800,
    'Atelier des Lumières, 38 rue Saint-Maur, 75011 Paris',
    1
),
(
    '🎡 La Nuit des Manèges',
    'assets/events/funfair.png',
    E'Quand tombe la nuit, l’Esplanade de La Défense devient un parc féérique : attractions illuminées, grande roue, spectacles de rue, DJ set, food trucks et parade lumineuse. Plus de 50 stands et animations pour tous les âges.',
    '2025-04-18',
    E'15h00 : Ouverture\n17h00 : Parade lumineuse\n19h00 : Animations interactives\n21h00 : DJ set & bal\n22h30 : Feu d’artifice final',
    'Mairie de Paris – Service Animation Urbaine - animations@paris.fr - 01 44 67 83 20',
    0.00,
    10000,
    'Esplanade de La Défense, Paris',
    6
),
(
    '🌺 Colores del Sur',
    'assets/events/latin-festival.png',
    E'“Colores del Sur” est un festival latin mêlant musiques, danses, gastronomie et artisanat. Voyage culturel de Buenos Aires à La Havane avec concerts, cours de salsa, démonstrations et village festif.',
    '2025-04-18',
    E'13h00 : Ouverture\n14h30 : Cours de danse collective\n16h00 : Ateliers cuisine\n17h30 : Concert Mariachi\n19h00 : DJ Set Latino',
    'Association Latine Culture - latineculture@gmail.com - 06 84 45 77 10',
    10.00,
    2000,
    'Parc André Citroën, Paris 15e',
    3
),
(
    '🌸 Hanami – Fête des Cerisiers',
    'assets/events/hanami.png',
    E'Journée inspirée de la tradition japonaise du Hanami : contemplation des cerisiers, cérémonie du thé, ateliers origami, démonstrations artistiques, kendo et concert acoustique sous les sakuras.',
    '2025-04-24',
    E'11h00 : Tambours Taiko\n12h00 : Pique-nique\n14h00 : Atelier origami et calligraphie\n15h30 : Démonstration de kendo\n17h00 : Concert final (koto & chant)',
    'Association Japon-France - contact@japonfrance.org - 07 51 23 90 48',
    5.00,
    1500,
    'Parc Floral de Paris, Bois de Vincennes',
    4
),
(
    '🎮 Clash of Gamers',
    'assets/events/esports-tournament.png',
    E'Tournoi Esport régional comprenant Rocket League, Mario Kart et Smash Bros, avec phases finales sur scène, casters en live, goodies, zone freeplay, bornes rétro et simulateurs VR.',
    '2025-04-20',
    E'10h00 : Accueil\n11h00-13h00 : Tournois\n14h00-16h00 : Finales\n16h30 : Remise des prix\nToute la journée : Freeplay & VR',
    'Association Pixel Pulse - tournoi@pixelpulse.fr - 07 65 44 22 91',
    20.00,
    320,
    'Halle Digitale, 22 rue Voltaire, Saint-Ouen',
    5
),
(
    '🎤 Voix de Demain',
    'assets/events/karaoke.png',
    E'Tremplin musical mettant en scène 10 jeunes talents : chant, rap, pop, rock, slam. Jury professionnel + vote du public. Showcase final et after DJ.',
    '2025-04-25',
    E'18h30 : Accueil\n19h00-21h00 : Passage des artistes\n21h15 : Votes\n21h45 : Showcase\n22h00 : After DJ',
    'Association Tremplin93 - tremplin93@gmail.com - 06 12 77 38 90',
    15.00,
    350,
    'Salle Jean Jaurès, 34 avenue République, Montreuil',
    2
),
(
    '🎨 Explosion de Couleurs',
    'assets/events/holi-colors.png',
    E'Événement inspiré du Holi indien : lancers de poudres colorées, DJ sets, animations dansantes, maquillage fluo, tatouages henné et foodtrucks dans une ambiance festive.',
    '2025-04-28',
    E'13h00 : Accueil\n14h00-18h00 : Lancers horaires + concerts\n18h00 : Clôture dansante',
    'Happy Festival France - contact@happycolors.fr - 09 71 33 64 12',
    8.00,
    2000,
    'Prairie des Filtres, Paris 12e',
    7
),
(
    '🎼 Opéra sous les Étoiles',
    'assets/events/opera.png',
    E'Concert lyrique en plein air avec jeunes solistes du Conservatoire. Reprises de Verdi, Mozart, Bizet et Puccini dans le cadre romantique du Jardin Shakespeare.',
    '2025-04-30',
    E'19h00 : Accueil\n19h30-21h00 : Concert\n21h00 : Thé de clôture',
    'Conservatoire & Amis du Bois - concertbois@gmail.com - 01 45 23 22 02',
    12.00,
    400,
    'Jardin Shakespeare, Bois de Boulogne',
    8
),
(
    '🕹️ Retro & Fun Night',
    'assets/events/arcane-room.png',
    E'Soirée arcade privatisée avec plus de 50 bornes rétro, tournois Street Fighter et Mario Kart, bar à snacks rétro, espace VR et DJ set synthwave.',
    '2025-04-27',
    E'18h30 : Freeplay\n19h00-21h00 : Mini-tournois\n21h30 : Défis coop\n23h00 : DJ set\n00h00 : Clôture',
    'Neo Arcade Paris - contact@neoarcade.fr - 01 77 62 31 05',
    8.00,
    150,
    'Neo Arcade, 14 boulevard Voltaire, Paris 11e',
    9
);

-- ==============================
-- ASSOCIATION ÉVÉNEMENTS / CATÉGORIES
-- ==============================
INSERT INTO t_belong (event_id, category_id) VALUES
(4, 1), (4, 2), (4, 3),
(5, 1), (5, 2), (5, 3),
(6, 1), (6, 4), (6, 5),
(7, 1), (7, 3), (7, 4),
(8, 1), (8, 3), (8, 6), (8, 7),
(9, 1), (9, 5), (9, 8),
(10, 1), (10, 2), (10, 3),
(11, 1), (11, 3), (11, 4), (11, 7),
(12, 1), (12, 2), (12, 3),
(13, 1), (13, 5), (13, 8), (13, 9);
