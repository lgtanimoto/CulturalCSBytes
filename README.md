# CulturalCSBytes

## Backend
Navigate to the `server` folder.

### Database
First we need to setup the database. These steps assume that you have PostgreSQL installed. If not, you can download it from the [official website](https://www.postgresql.org/download/). If you are using Windows Subsystem for Linux (WSL), which is probably recommended if you use Windows, you can follow the steps in [this tutorial](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database), which also include instructions for starting and connecting to the postgres service and opening the psql shell.
1. Start the postgres service (if necessary), connect to it, and open the psql shell. Make sure the current database is **NOT** the `ccsb` database (the current database is indicated by `<db>=#`, where `<db>` is a placeholder for the current database).
2. Run the commands to create the `ccsb` database (begin with `DROP DATABASE ...` and `CREATE DATABASE ...`). You will need to uncomment the commands in `data/schema.sql`, copy them into the psql shell, and run them.
3. Assuming you have successfully connected to the database, switch to the database by running `\c ccsb` in the psql shell.
4. Comment out the database creation commands and resave the file. Now run the rest of the file in the shell by running `\i data/schema.sql`. Check that it ran successfully by running `\dt` and ensuring that all the necessary tables have been created.
5. Populate the tables with initial data by running `\i data/data.sql` next. Optional: To check that it ran successfully, you can run a command like `SELECT * FROM meta_question LIMIT 10;` next to ensure the data was populated appropriately.

### Server
Make sure that you install all the necessary packages. Run `npm i` to install the packages. Now you can start the server in two ways:
- Run `npm start`
- (Preferred **IF** you are running in **development** mode) Run `npm run dev` so that you don't need to restart the server every time you update the server files.
