--
-- database
--
drop database if exists taskDB;
create database taskDB;

--
-- user privileges
--
grant all on taskDB.* to 'hotelAdmin'@'%';

use taskDB;

--
-- tables
--
create table employeeType (
  ID int auto_increment not null,
  name varchar(64) not null,

  primary key (ID)
);

create table department (
  ID int auto_increment not null,
  name varchar(64) not null,

  primary key (ID)
);

create table employee (
  ID int auto_increment not null,
  userName varchar(64) not null,
  firstName varchar(64) not null,
  lastName varchar(64) not null,
  password varchar(64) not null,
  employeeType int not null,
  department int,

  primary key (ID),
  foreign key (employeeType) references employeeType (ID),
  foreign key (department) references department (ID)
);

create table task (
  ID int auto_increment not null,
  name varchar(64) not null,
  description text,
  location text,
  department int not null,
  creationTime timestamp null,
  completionTime timestamp null,
  completionUser int,

  primary key (ID),
  foreign key (department) references department (ID),
  foreign key (completionUser) references employee (ID)
);

create table attachment (
  ID int auto_increment not null,
  task int not null,
  filePath text not null,

  primary key (ID),
  foreign key (task) references task (ID)
);

--
-- test data
--
insert into employeeType (name) values
  ('administrator'),
  ('user');

insert into department (name) values
  ('Reception'),
  ('Cleaning'),
  ('Bar'),
  ('Restaurant');

insert into employee (userName, firstName, lastName, password, employeeType, department) values
  ('manager', 'Hotel', 'Manager', 'mgrpassword', 1, null),
  ('jdoe', 'Jane Doe', 'janespassword', 2, 1);

insert into task (name, description, location, department) values
  ('Wash the carpet', 'There was an incident in the room, so it needs to be cleaned ASAP', 'A123', 2);
