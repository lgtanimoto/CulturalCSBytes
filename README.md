# CulturalCSBytes

## Frontend
Complete all the following steps in a terminal session with the **frontend** folder as the current directory.

## Backend
Complete all the following steps in a terminal session with the **backend** folder as the current directory.

### Database setup
First we need to setup the database. These steps assume that you have PostgreSQL installed. If not, you can download it from the [official website](https://www.postgresql.org/download/). If you are using Windows Subsystem for Linux (WSL), which is probably recommended if you use Windows, you can follow the steps in [this tutorial](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database), which also include instructions for starting and connecting to the postgres service and opening the psql shell.
1. Start the postgres service (if necessary), connect to it, and open the psql shell. Make sure the current database is **NOT** the **ccsb** database (most likely you will see the shell prompt that looks like `postgres=#`, so **postgres** would be the current database in this case).
2. Before creating the database, run the following command: `ALTER USER postgres PASSWORD 'postgres'`.
    - This will set the password of the **postgres** user to **postgres**, which will be essential for the database connection when starting the server.
2. Run the commands to create the **ccsb** database (begin with `DROP DATABASE ...` and `CREATE DATABASE ...`). You will need to uncomment the commands in **data/schema.sql**, copy them into the psql shell, and run them.
3. Assuming you have successfully connected to the database, switch to the database by running this command in the **psql shell**: `\c ccsb`.
4. Comment out the database creation commands and resave the file. Now run the rest of the file in the shell by running `\i data/schema.sql`.
    - You can check that it ran successfully by ensuring that all the necessary tables have been created throught running `\dt`.
5. Populate the tables with initial data by running `\i data/data.sql`.

### Miscellaneous steps
We need to take care of several things to ensure the backend works smoothly. You also need to make sure that the postgres service has started. Although you do not necessarily be in the psql shell, it is recommended to test changes quickly. If you use the psql shell conjunctly, you need to open a **separate terminal session** with the **backend** folder as the current directory, again.
1. Run `npm i` to install the packages.
2. Create a **.env** file and define an environment variable called `JWTSECRET`. Details for how to do this are given in the [official documentation](https://www.npmjs.com/package/dotenv). This will be important for authentication and authorization purposes.
3. Run `node content.js`. This will load the questions that are in a JSON format in **content/A000/A000/*.json** into the database.

### Starting the server
You can do it in two ways:
- Run `npm start`
- Run `npm run dev` to avoid stopping and restarting the server every time you make changes.

### Postman
**Postman** is especially useful when building and testing your APIs to make sure that they are working properly. After all, the backend is just a large-scale REST API, and **Postman** is what allows us to test that extended API.
- Before you can access any services, you need to make a **POST** request to the **/auth/login** route and retrieve the token that is returned.
    - This assumes you have a **student** defined. If not, you need to make a **POST** request to the **/auth/register** route first.
- Then when you want to make an API request that uses the `authorization` middleware, you need to add, in **Headers**, the `token` header to the token that was returned by the login request.

## Testing

**NOTE**: You will need at least **TWO** separate terminal sessions open so that both the frontend and backend sessions can communicate to each other.

### Backend
Navigate to the **backend** folder via `cd backend` and run `npm run dev` to start the backend session.

### Frontend
Navigate to the **frontend** folder via `cd frontend` and run `npm start` to start the frontend session. Then go to `http://localhost:3000` to test interactively.

## Resources
I found [The Stoic Programmers](https://www.youtube.com/@TheStoicProgrammers) especially useful for the backend development of the portion. It provides useful information on both building the REST API and the JWT authentication and authorization, as well as how to combine the two together. Many YouTube tutorials neglect the authentication and authorization piece, which is a must-have when working with any industry project. However, this channel provides it all.

Here are the videos I specifically recommend checking out:
- [PERN Stack Walkthrough](https://www.youtube.com/watch?v=ldYcgPKEZC8)
- [PERN JWT Authentication/Authorization (Backend)](https://www.youtube.com/watch?v=7UQBMb8ZpuE)
- [PERN JWT Authentication/Authorization (Frontend)](https://www.youtube.com/watch?v=cjqfF5hyZFg)
- [Combining JWT and Application (Part 1)](https://www.youtube.com/watch?v=l3njf_tU8us)
- [Combining JWT and Application (Part 2)](https://www.youtube.com/watch?v=25kouonvUbg)


