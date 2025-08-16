DROP TABLE IF EXISTS t_register;
DROP TABLE IF EXISTS t_events;
DROP TABLE IF EXISTS t_profiles;
DROP TABLE IF EXISTS t_roles;
DROP TABLE IF EXISTS t_categories;


CREATE TABLE t_categories(
   category_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   name_category VARCHAR(50) NOT NULL
);

CREATE TABLE t_roles(
   role_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   role VARCHAR(50)
);

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

CREATE TABLE t_events(
    event_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   name_event VARCHAR(50),
   img_url VARCHAR(50),
   description LONGTEXT NOT NULL,
   date_event DATE NOT NULL,
   program TEXT NOT NULL,
   contact TEXT NOT NULL,
   price DECIMAL(15,2),
   number_place INT,
   address TEXT NOT NULL,
   category_id INTEGER NOT NULL,
   profile_id INTEGER NOT NULL,
   FOREIGN KEY(category_id) REFERENCES t_categories(category_id),
   FOREIGN KEY(profile_id) REFERENCES t_profiles(profile_id)
);

CREATE TABLE t_register(
   profile_id INTEGER NOT NULL,
   event_id INTEGER NOT NULL,
   PRIMARY KEY(profile_id, event_id),
   FOREIGN KEY(profile_id) REFERENCES t_profiles(profile_id),
   FOREIGN KEY(event_id) REFERENCES t_events(event_id)
);
