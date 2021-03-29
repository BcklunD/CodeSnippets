# CRUD Code Snippets

## Description

This is a website made for storing Code Snippets. The application was created as an assignment for the course 1DV523 at the Linnaeus University.

The website is built using NodeJS and the server part is handled with Express. All web pages are built using Express-hbs as the view engine. You need to register an account and log in to be able to create code snippets and store them on the site. You can only update or delete your own code snippets. All account information is encrypted using bcrypt. The account information and the code snippets are stored in a MongoDB database. Sessions cookies are used for authentication.

## Running the application
To run the application you start with 
```
docker-compose build
```
and once this is done you follow it up with
```
docker-compose up
```
This will start the server and it listens to http://localhost:8000/

The website is then pretty self-explanatory. You need to register an account and login before creating a new code snippet or changing the current ones. In "/all" you can filter the code snippts on the user that created it. To clear all code snippets and all logins to the server you can go to "/clear".