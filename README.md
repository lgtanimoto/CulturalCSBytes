# CulturalCSBytes

## Production
Find the deployed web app [here](http://atcsed.us-west-2.elasticbeanstalk.com/home)!

## Onboarding
This section will walkthrough how to set up this Github project on your machine so you can start coding and testing in no time!

### Tool installation
If you are using **Windows**, I suggest using [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install). I also recommend installing [Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/install) and setting that up as your default terminal application.

Navigate to the following links for instructions on how to install the following tools.
- Git
    - [Windows](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-git)
    - [Mac](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Node.js
    - [Windows](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)
    - [Mac](https://nodejs.org/en/download/)
- Postgres
    - [Windows](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database)
    - [Mac](https://www.sqlshack.com/setting-up-a-postgresql-database-on-mac/)
        - The command provided in the guide for connecting to the postgres service is incorrect.
        - You want to instead run `sudo -u postgres psql` to connect to the service.

#### Postman
Postman is an API platform that allows you to test your APIs. This may come in handy when testing the backend.
- You can download Postman [here](https://www.postman.com/).
- We have a custom workspace that has a collection for all the API routes you will need to test. [Click](https://app.getpostman.com/join-team?invite_code=61f955d9edfa2e68f73f3e5bffe99015&target_code=ce9f626b5a456cd7d9d7e0a9ba727d1e) to join!

### Cloning the project
Make sure you can connect to GitHub with SSH. Read [here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) for instructions on how to do so. Once you have that setup, navigate to a folder of your choosing and run:
```
git clone git@github.com:lgtanimoto/CulturalCSBytes.git
```

Once the project is successfully cloned, navigate to the folder using
```
cd CulturalCSBytes
```

### Terminal sesssions
We will need three terminal sessions open, each for the following purposes as described below.
- One to start and connect to the database service. The current directory will be the project directory.
- One to start the backend service. The current directory will be the backend directory (in the project directory).
- One to start the frontend service. The current directory will be the frontend directory (in the project directory).

Follow these instructions very carefully, and in order. Make sure that you have the project folder open in your preferred text editor or IDE (I suggest **Visual Studio Code**).

### Database setup
Open the `schema.sql` file in the `backend/data` directory. Do the following:
1. Make sure you are **NOT** in the `ccsb` database if you are reseeding. As a precaution, run `\c postgres`.
1. Uncomment the lines that drop and create the database (on lines 5 and 7, beginning with `DROP DATABASE...` and `CREATE DATABASE ...`, respectively).
2. Copy those lines. Paste them in the terminal session that is connected to the database (the one with `postgres=#` or something similar as a prompt).
3. Connect to the new database by running `\c ccsb`.
4. In the text editor or IDE, recomment the lines that drop and create the database. **SAVE!!!**
5. As your current directory should be the project folder, I want you to run `\i backend/data/schema.sql`. This command will run all the SQL commands in that file, which are responsible for setting up the tables and relations.
6. Now run `\i backend/data/data.sql`. This command will run the SQL commands to seed the database.
7. Finally run `\i backend/data/resources.sql`. This will add the resources into the database.

If you are instead reseeding the database (which may frequently happen), you still need to follow all of these directions.

**Note**: If you come across the following error `No such file or directory` when you run `\i` command, just copy and paste the `.sql` file contents into the `psql` shell and that should work fine too.

### Backend setup
Now we will use the terminal session that is connected to the backend service (the current directory is the backend directory).
1. Before anything, in the text editor/IDE, go to the backend directory and create a `.env` file. This file will define the environment variables that our backend service will use. Details about using such file can be found [here](https://www.npmjs.com/package/dotenv).
2. Now define the following environment variables following instructions from the documentation.
    1. `RDS_HOSTNAME` - The name of the host to connect to the Postgres service (most likely `localhost` for development environments).
    2. `RDS_PORT` - The port of the Postgres service (essentially always `5432`).
    3. `RDS_DB_NAME` - The name of the Postgres database (will be `ccsb`).
    4. `RDS_USERNAME` - The username you used for connecting to the Postgres service (generally `postgres`).
    5. `RDS_PASSWORD` - The password you used for connecting to the Postgres service for the `RDS_USERNAME`.
    6. `JWTSECRET` - It does not matter what you define this to be.
    7. `PORT=3001` - The port that the backend service should run on. We will use 3001. Note: Not the same as the Postgres port number.
3. Go back to the terminal session connected to the backend service and run `npm i`. This will install all the necessary packages.
4. Now run `node content.js`. This will add all the questions to the database.
    1. You will know it completed successfully if the only output is `pool has ended`.
    2. As a precaution, you can check by running `SELECT COUNT(*) FROM question;` in the session connected to the database. Hopefully it is a nonzero number.
5. Run `node resources.js`. This will add the resources to the database.
    1. Again, it is successful if the output is `pool has ended`.
    2. Can also run `SELECT COUNT(*) FROM resource_qsc_links;` and should be nonzero.
6. You are finally ready to start the backend session. Run `npm run dev`.
    1. If it is successful, you will see `Server is running on port 3001`.
    2. If you ever make changes to the backend, you can restart the service by saving the `index.js` file.

If you are instead reseeding the database, you can skip Steps 1-3 (creating the environment variables and installing packages).

### Frontend setup
Finally, we will use the terminal session connected to the frontend service.
1. Create a `.env` file with the following environment variable
    1. `REACT_APP_PROXY_HOST` - Set to `http://localhost:3001` for now.
2. Run `npm i` to install the packages.
3. And run `npm start` to start the frontend service.
4. Navigate to `localhost:3000` to open the frontend application in a web server.

If you are instead reseeding the database, you can skip Steps 1-3 (installing packages).

## Testing
From here on out, you will still need three terminal sessions, but all you will need to do for each is:
- Start the Postgres service (and optionally connect to it).
- Start the backend service by running `npm run dev`.
- Start the frontend service by running `npm start`.

## Deployment

### Database

We deploy to an [Amazon RDS](https://docs.aws.amazon.com/rds/) database. Look [here](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html#USER_ConnectToPostgreSQLInstance.psql) for 

1. To connect, need to type this command in CLI shell. See [here](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html#USER_ConnectToPostgreSQLInstance.psql) for details.
   ```
   psql \
       --host=<DB instance endpoint> \
       --port=<port> \
       --username=<master username> \
       --password \
       --dbname=<database name>
   ```
2. Then just run the three commands below, in order, as normal. Database is now set.
    1. `\i backend/data/schema.sql`
    2. `\i backend/data/data.sql`
    3. `\i backend/data/resources.sql`
3. Make sure to update the following environment variables in the `.env` file to the production config.
    1. `RDS_HOSTNAME`
    2. `RDS_PORT`
    3. `RDS_DB_NAME`
    4. `RDS_USERNAME`
    5. `RDS_PASSWORD`
4. Run the following Node scripts in the `backend` directory, it will run connected to the production database.
    1. `node content.js`
    2. `node resources.js`
  
### Backend

We use [Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html) for deploying both the backend and frontend. Here are some detailed instructions for deploying to ELB with Node.js, see this [documentation](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.html). Make sure you have AWS CLI installed first, see [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

### Frontend

Same instructions as backend.

## Programming Resources
I found [The Stoic Programmers](https://www.youtube.com/@TheStoicProgrammers) especially useful for the backend development of the portion. It provides useful information on both building the REST API and the JWT authentication and authorization, as well as how to combine the two together. Many YouTube tutorials neglect the authentication and authorization piece, which is a must-have when working with any industry project. However, this channel provides it all.

Here are the videos I specifically recommend checking out:
- [PERN Stack Walkthrough](https://www.youtube.com/watch?v=ldYcgPKEZC8)
- [PERN JWT Authentication/Authorization (Backend)](https://www.youtube.com/watch?v=7UQBMb8ZpuE)
- [PERN JWT Authentication/Authorization (Frontend)](https://www.youtube.com/watch?v=cjqfF5hyZFg)
- [Combining JWT and Application (Part 1)](https://www.youtube.com/watch?v=l3njf_tU8us)
- [Combining JWT and Application (Part 2)](https://www.youtube.com/watch?v=25kouonvUbg)


