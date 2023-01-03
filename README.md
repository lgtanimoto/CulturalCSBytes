# CulturalCSBytes

## Frontend (Client)

## Backend (Server)
Navigate to the `server` folder.

### Database Setup
First we need to setup the database. These steps assume that you have PostgreSQL installed. If not, you can download it from the [official website](https://www.postgresql.org/download/). If you are using Windows Subsystem for Linux (WSL), which is probably recommended if you use Windows, you can follow the steps in [this tutorial](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database), which also include instructions for starting and connecting to the postgres service and opening the psql shell.
1. Start the postgres service (if necessary), connect to it, and open the psql shell. Make sure the current database is **NOT** the `ccsb` database (the current database is indicated by `<db>=#`, where `<db>` is a placeholder for the current database).
2. Before creating the database, run the command `ALTER USER postgres PASSWORD 'postgres'`. This will set the password of the `postgres` user to `postgres`, which will be essential for the database connection when starting the server.
2. Run the commands to create the `ccsb` database (begin with `DROP DATABASE ...` and `CREATE DATABASE ...`). You will need to uncomment the commands in `data/schema.sql`, copy them into the psql shell, and run them.
3. Assuming you have successfully connected to the database, switch to the database by running `\c ccsb` in the psql shell.
4. Comment out the database creation commands and resave the file. Now run the rest of the file in the shell by running `\i data/schema.sql`. Check that it ran successfully by running `\dt` and ensuring that all the necessary tables have been created.
5. Populate the tables with initial data by running `\i data/data.sql` next.

### Server
We need to take care of several things to ensure the backend works smoothly. You also need to make sure that the postgres service has started. Although you do not necessarily be in the psql shell, it is recommended to test changes quickly.
1. Run `npm i` to install the packages.
2. Create a `.env` file and define an environment variable called `JWTSECRET`. Details for how to do this are given in the [official documentation](https://www.npmjs.com/package/dotenv). This will be important for authentication and authorization purposes.
2. Start the server in two different ways.
    - Run `npm start`
    - (Preferred **IF** you are running in **development** mode) Run `npm run dev` so that you don't need to restart the server every time you update the server files.

