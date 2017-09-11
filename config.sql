DROP TABLE signatures;

CREATE TABLE signatures (
    signature TEXT not null,
    id INTEGER not null
);

DROP TABLE users;

CREATE TABLE users (
    id SERIAL primary key,
    first VARCHAR(255) not null,
    last VARCHAR(255) not null,
    email VARCHAR(255) not null unique,
    password VARCHAR(255) not null
);

DROP TABLE user_profiles;

CREATE TABLE user_profiles (
    id SERIAL primary key,
    user_id INTEGER not null,
    age VARCHAR(255) ,
    city VARCHAR(255) ,
    url VARCHAR(255)
);
