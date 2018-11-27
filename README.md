Task:
Develop a clone of eBay with Hapi framework to initialize the server and generate routes. Generate a database with Postgres and manage queries with Knex. Use Postman to run query tests and Joi to validate user input.

Plan:

1.  Create an app directory and install Hapi
2.  Set up Postgres database
3.  Create ebay_clone database and tables for users, auctions and bids.
4.  Set up Hapi server.js file with routes
5.  Start setting up routes. Just print out logs for now to make sure routes are working
6.  Knex functions to query Postgres DB
7.  Enter in a seed user into DB
8.  Try to get it with a get request from Hapi server
9.  Create a Knex script to insert a new data
10. Link up Hapi HTTP call to create a new user through Knex functions
11. Create all the endpoints requests through Hapi and Knex functions

To complete:

1.  Configure Joi to validate parameters based on a schema.
2.  User auth
