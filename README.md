# A02 CRUD Code Snippets

## Architecture 
My architecture for my application is very similar to the architecture used in the example solution for the exercise "Pure-approval". The server is controlled from the module <code>app.js</code> and all requests which the server receives is forwarded to the module <code>codeSnippetsRouter</code>. From the router the request is handled by the appropriate function in either <code>codeSnippetsController.js</code> or <code>loginController.js</code>. The module <code>codeSnippetsController.js</code> handles all requests regarding CRUD and <code>loginController.js</code> will ofcourse handle everything regarding logging in and also authorizing the user. The finished webpages are finally build together using <code>express-hbs</code> and all hbs files used to build the webpages can be cound in the folder "views". 

I think this architecture is really good and easy to understand, which is why I decided to adopt it for my own implementation. If you wanted to add an additional page to the website it would be trivial to just add an other route to the router, a new function to the controller and finally a new hbs file.

## Persistent data
In this assignment I felt like it was super easy to store the data in a database. In parallell to this course I am also taking a course in MySQL and learning all different queries is quite hard I think but using MongoDB together with Mongoose in this assignment made it all very simple. 

It felt just like storing data in a normal data structure and I didn't have to think about it too much. Using Docker also helped making it simple. 

## My thoughts on the application
In general, I am very happy with my application. It was the first time for me working with persistent data in a database and also the first time doing authorization and authentication and I felt like I learned a lot and that I really liked the different modules and tools I used here to implement it. It was also the first time I worked with a view controller and it made things very easy. 

I don't really know of any areas where I could have improved the application, because then I would have done it. 

I am especially satisfied with just the overall finished product. I felt like it all came together really nicely and that there are none of those weird bugs that you don't really wanna try to fix because you know that it will break a different part of the application (for sure had some of those in the SPA application). I really like the website I built and I actually think that I will use it in the future for storing stuff (though maybe not code snippets).

## TIL
Today I learned how to build a modern website using a viewcontroller, router and controllers. I also learned how to authorize users using session cookies. Cool!

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