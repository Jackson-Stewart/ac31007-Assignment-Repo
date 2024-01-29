-- This is the sql statement used to create the login_data table, which is used to store login credentials for logging in into the admin page.
CREATE TABLE login_data(
firstName VARCHAR(100),
surname VARCHAR(100),
email VARCHAR(100),
role VARCHAR(100),
homeAddress VARCHAR(100),
contactNumber VARCHAR(30),
password VARCHAR(30),
staffID varchar(10)
);

-- insert statement used for example admin:
INSERT INTO login_data(firstName, surname, email, role, homeAddress, contactNumber, password, staffID)
VALUES ('Sam', 'Tander', 'admin@gmail.com', 'Admin', '3F Stobswell Street', '01632960840', 'securepass', 'A0001');