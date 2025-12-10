-- ============================================
-- SCRIPT DE RÉINITIALISATION COMPLÈTE
-- ============================================

-- 1. SUPPRESSION DES TABLES
DROP TABLE IF EXISTS t_register CASCADE;
DROP TABLE IF EXISTS t_belong CASCADE;
DROP TABLE IF EXISTS t_events CASCADE;
DROP TABLE IF EXISTS t_profiles CASCADE;
DROP TABLE IF EXISTS t_roles CASCADE;
DROP TABLE IF EXISTS t_categories CASCADE;

-- ============================================
-- 2. CRÉATION DES TABLES (DDL)
-- ============================================

-- Table catégories
CREATE TABLE t_categories(
   category_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   name_category VARCHAR(50) NOT NULL
);

-- Table rôles
CREATE TABLE t_roles(
   role_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   role VARCHAR(50)
);

-- Table profils
CREATE TABLE t_profiles(
   profile_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   email VARCHAR(320) UNIQUE NOT NULL,
   first_name VARCHAR(50) NOT NULL,
   last_name VARCHAR(100) NOT NULL,
   password VARCHAR(72) NOT NULL,
   phone VARCHAR(20) UNIQUE NOT NULL,
   organization VARCHAR(50),
   role_id INTEGER NOT NULL,
   FOREIGN KEY(role_id) REFERENCES t_roles(role_id)
);

-- Table événements
CREATE TABLE t_events(
   event_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   name_event VARCHAR(50),
   img_url VARCHAR(255),
   description TEXT NOT NULL,
   date_event DATE NOT NULL,
   program TEXT NOT NULL,
   contact TEXT NOT NULL,
   price DECIMAL(15,2),
   number_place INT,
   address TEXT NOT NULL,
   profile_id INTEGER NOT NULL,
   FOREIGN KEY(profile_id) REFERENCES t_profiles(profile_id)
);

-- Table ManyToMany Event ↔ Category
CREATE TABLE t_belong (
    event_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (event_id, category_id),
    FOREIGN KEY (event_id) REFERENCES t_events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES t_categories(category_id) ON DELETE CASCADE
);

-- Table ManyToMany Event ↔ Profile (inscriptions)
CREATE TABLE t_register(
   profile_id INTEGER NOT NULL,
   event_id INTEGER NOT NULL,
   PRIMARY KEY(profile_id, event_id),
   FOREIGN KEY(profile_id) REFERENCES t_profiles(profile_id),
   FOREIGN KEY(event_id) REFERENCES t_events(event_id)
);

-- ============================================
-- 3. INSERTION DES DONNÉES (DML)
-- ============================================

-- CATÉGORIES
INSERT INTO t_categories (name_category) VALUES
('Tout'),
('Art'),
('Culturel'),
('Festival'),
('Loisirs'),
('Bien-être'),
('Plein Air'),
('Gaming'),
('Autres');

-- RÔLES (seulement USER et ADMIN)
INSERT INTO t_roles (role) VALUES
('ROLE_USER'),
('ROLE_ADMIN');

-- PROFILS
INSERT INTO t_profiles (email, first_name, last_name, password, phone, organization, role_id) VALUES
('contact@arttechstudio.fr', 'Alice', 'Durand', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0180529932', 'Studio ArtTech', 2),
('animations@paris.fr', 'Julien', 'Martin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0144678320', 'Mairie de Paris', 2),
('latineculture@gmail.com', 'Sofia', 'Lopez', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0684457710', 'Latine Culture', 2),
('contact@japonfrance.org', 'Kenji', 'Ito', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0751239048', 'Japon-France', 2),
('tournoi@pixelpulse.fr', 'Lucas', 'Bernard', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0765442291', 'Pixel Pulse', 2),
('tremplin93@gmail.com', 'Emma', 'Dupuis', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0612773890', 'Tremplin93', 2),
('contact@happycolors.fr', 'Priya', 'Singh', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0971336412', 'Happy Festival France', 2),
('concertbois@gmail.com', 'Victor', 'Carrel', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0145232202', 'Conservatoire & Amis du Bois', 2),
('contact@neoarcade.fr', 'Nathan', 'Morel', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0177623105', 'Neo Arcade Paris', 2);

-- ÉVÉNEMENTS (✅ SANS "assets/events/", juste le nom du fichier)
INSERT INTO t_events (name_event, img_url, description, date_event, program, contact, price, number_place, address, profile_id) VALUES
(
    '🎶 L''Odyssée des Couleurs',
    'comedy.png',
    E'L''Odyssée des Couleurs est une comédie musicale originale et flamboyante, mêlant chant, danse, théâtre et mise en scène immersive.\nCe spectacle tout public raconte l''histoire de Nova, une jeune fille née dans un monde sans couleurs, qui décide de partir en quête des émotions perdues pour rendre sa vie plus vibrante.',
    '2025-04-12',
    E'19h00 : Ouverture des portes\n20h00 : Début du spectacle\n21h45 : Standing ovation & rencontre avec les artistes',
    'Compagnie Indigo Fusion - contact@indigofusion.fr - 01 72 98 32 15',
    20.00,
    500,
    'Théâtre Lumière, 12 rue des Arts, Paris 3e',
    1
),
(
    '🖼️ Lumières en Mouvement',
    'digital-immersion.png',
    E'"Lumières en Mouvement" est une exposition immersive qui transforme l''Atelier des Lumières en un univers sensoriel total. Grâce à des projections 360°, du mapping et une spatialisation sonore, les visiteurs interagissent avec des œuvres numériques évolutives.\nParcours libre à travers des espaces thématiques avec installations interactives : peindre avec ses pas, manipuler la lumière ou entrer dans des tableaux animés.',
    '2025-04-15',
    E'10h00-12h30 : Parcours "Naissance de la lumière"\n14h00-15h30 : Atelier enfants "Peindre avec la lumière"\n16h00-17h30 : Expérience immersive "Dans les rêves de Monet"\n18h00-20h00 : Nocturne : mix visuel + musique ambient live',
    'Studio ArtTech - contact@arttechstudio.fr - 01 80 52 99 32',
    0.00,
    800,
    'Atelier des Lumières, 38 rue Saint-Maur, 75011 Paris',
    1
),
(
    '🎡 La Nuit des Manèges',
    'funfair.png',
    E'Quand tombe la nuit, l''Esplanade de La Défense devient un parc féérique : attractions illuminées, grande roue, spectacles de rue, DJ set, food trucks et parade lumineuse. Plus de 50 stands et animations pour tous les âges.',
    '2025-04-18',
    E'15h00 : Ouverture\n17h00 : Parade lumineuse\n19h00 : Animations interactives\n21h00 : DJ set & bal\n22h30 : Feu d''artifice final',
    'Mairie de Paris – Service Animation Urbaine - animations@paris.fr - 01 44 67 83 20',
    0.00,
    10000,
    'Esplanade de La Défense, Paris',
    2
),
(
    '🌺 Colores del Sur',
    'latin-festival.png',
    E'"Colores del Sur" est un festival latin mêlant musiques, danses, gastronomie et artisanat. Voyage culturel de Buenos Aires à La Havane avec concerts, cours de salsa, démonstrations et village festif.',
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
    'hanami.png',
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
    'esports-tournament.png',
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
    'karaoke.png',
    E'Tremplin musical mettant en scène 10 jeunes talents : chant, rap, pop, rock, slam. Jury professionnel + vote du public. Showcase final et after DJ.',
    '2025-04-25',
    E'18h30 : Accueil\n19h00-21h00 : Passage des artistes\n21h15 : Votes\n21h45 : Showcase\n22h00 : After DJ',
    'Association Tremplin93 - tremplin93@gmail.com - 06 12 77 38 90',
    15.00,
    350,
    'Salle Jean Jaurès, 34 avenue République, Montreuil',
    6
),
(
    '🎨 Explosion de Couleurs',
    'holi-colors.png',
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
    'opera.png',
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
    'arcane-room.png',
    E'Soirée arcade privatisée avec plus de 50 bornes rétro, tournois Street Fighter et Mario Kart, bar à snacks rétro, espace VR et DJ set synthwave.',
    '2025-04-27',
    E'18h30 : Freeplay\n19h00-21h00 : Mini-tournois\n21h30 : Défis coop\n23h00 : DJ set\n00h00 : Clôture',
    'Neo Arcade Paris - contact@neoarcade.fr - 01 77 62 31 05',
    8.00,
    150,
    'Neo Arcade, 14 boulevard Voltaire, Paris 11e',
    9
);

-- ASSOCIATION ÉVÉNEMENTS / CATÉGORIES
INSERT INTO t_belong (event_id, category_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3),
(3, 1), (3, 4), (3, 5),
(4, 1), (4, 3), (4, 4),
(5, 1), (5, 3), (5, 6), (5, 7),
(6, 1), (6, 5), (6, 8),
(7, 1), (7, 2), (7, 3),
(8, 1), (8, 3), (8, 4), (8, 7),
(9, 1), (9, 2), (9, 3),
(10, 1), (10, 5), (10, 8), (10, 9);
