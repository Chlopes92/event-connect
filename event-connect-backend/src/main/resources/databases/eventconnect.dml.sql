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

INSERT INTO t_events (
    name_event, img_url, description, date_event, program, contact, price, number_place, address
) VALUES (
    'L’Odyssée des Couleurs',
    'assets/events/comedy.png',
    'L’Odyssée des Couleurs est une comédie musicale originale et flamboyante, mêlant chant, danse, théâtre et mise en scène immersive.\nCe spectacle tout public raconte l’histoire de Nova, une jeune fille née dans un monde sans couleurs, qui décide de partir en quête des émotions perdues pour rendre sa vie plus vibrante.',
    '2025-04-12',
    '19h00 : Ouverture des portes\n20h00 : Début du spectacle\n21h45 : Standing ovation & rencontre avec les artistes',
    'Compagnie Indigo Fusion - contact@indigofusion.fr - 01 72 98 32 15',
    20.00,
    500,
    'Théâtre Lumière, 12 rue des Arts, Paris 3e',
);

INSERT INTO t_roles (role) VALUES ('Admin');
INSERT INTO t_roles (role) VALUES ('User');