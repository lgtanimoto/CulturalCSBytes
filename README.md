# CulturalCSBytes

## Backend
### Setup
First we need to setup the database. These steps assume that you have PostgreSQL installed. If not, you can download it from the [official website](https://www.postgresql.org/download/). If you are using Windows Subsystem for Linux (WSL), which is probably recommended if you use Windows, you can follow the steps in [this tutorial](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database).
1. Make sure you are in the root directory for the project (there should be two subdirectories: `client` and `server`).
2. Start the postgres service (if necessary), connect to it, and open the psql shell. Make sure the current database is *NOT* the `ccsb` database.
3. Run the commands to create the `ccsb` database: `DROP DATABASE` and `CREATE DATABASE`. You will need to uncomment the commands in `server/data/schema.sql`, copy them into the psql shell, and run them.
4. Assuming you have successfully connected to the database, switch to the database by running `\c ccsb` in the psql shell.
5. Comment out the database creation commands and resave the file. Now run the rest of the file in the shell by running `\i server/data/schema.sql`. Check that it ran successfully by running `\dt` and ensuring that all the necessary tables have been created.
6. Populate the tables with initial data by running `\i server/data/data.sql` next. Optional: To check that it ran successfully, you can run a command like `SELECT * FROM meta_question LIMIT 10;` next to ensure the data was populated appropriately.
