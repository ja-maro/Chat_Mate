DROP DATABASE IF EXISTS ts_server;
CREATE DATABASE ts_server;

USE ts_server;

CREATE TABLE IF NOT EXISTS user (
    id INT NOT NULL AUTO_INCREMENT,
    user_login VARCHAR(50) NOT NULL,
    user_password VARCHAR(50) NOT NULl,
    PRIMARY KEY (id)
 );

CREATE TABLE IF NOT EXISTS Friend_list (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    PRIMARY KEY (id)
);

 CREATE TABLE IF NOT EXISTS Message (
     id INT NOT NULL AUTO_INCREMENT,
     user_id INT NOT NULL,
     room_id INT NOT NULL,
     content  VARCHAR(250) NOT NULL,
     timestamp  DATE NOT NULL,
     PRIMARY KEY (id)
 );

 CREATE TABLE IF NOT EXISTS room (
     id INT NOT NULL AUTO_INCREMENT,
     room_name VARCHAR(50) NOT NULL,
     user_admin_id INT NOT NULL,
     room_type VARCHAR(25) NULL,
     PRIMARY KEY (id)
 );


 CREATE TABLE IF NOT EXISTS User_room (
     id INT NOT NULL AUTO_INCREMENT,
     user_id INT NOT NULL,
     room_id INT NOT NULL,
     PRIMARY KEY (id)
 );