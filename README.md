# CulturalCSBytes

### Cloning the project
Make sure you can connect to GitHub with SSH. Read [here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) for instructions on how to do so. Once you have that setup, navigate to a folder of your choosing and run:
```
git clone git@github.com:lgtanimoto/CulturalCSBytes.git
```

Once the project is successfully cloned, navigate to the folder using
```
cd CulturalCSBytes
```

## Setup
You need to install Docker to run this project. Find installation details [here](https://docs.docker.com/get-docker/).

## Getting Started
1. Make sure you have [Docker Desktop](https://docs.docker.com/desktop/) running in the background.
2. In the project directory, all you need to do is run the following command.
```
docker compose up --build
```
3. Now go to `localhost:3000` and start testing your app. Also, alternatively you can add the `-d` flag to run your app detached, that way you can still run other commands.

## Shutdown
Use `Ctrl+C` to exit. Run this command to delete the containers.
```
docker compose down
```

## Programming Resources
I found [The Stoic Programmers](https://www.youtube.com/@TheStoicProgrammers) especially useful for the backend development of the portion. It provides useful information on both building the REST API and the JWT authentication and authorization, as well as how to combine the two together. Many YouTube tutorials neglect the authentication and authorization piece, which is a must-have when working with any industry project. However, this channel provides it all.

Here are the videos I specifically recommend checking out:
- [PERN Stack Walkthrough](https://www.youtube.com/watch?v=ldYcgPKEZC8)
- [PERN JWT Authentication/Authorization (Backend)](https://www.youtube.com/watch?v=7UQBMb8ZpuE)
- [PERN JWT Authentication/Authorization (Frontend)](https://www.youtube.com/watch?v=cjqfF5hyZFg)
- [Combining JWT and Application (Part 1)](https://www.youtube.com/watch?v=l3njf_tU8us)
- [Combining JWT and Application (Part 2)](https://www.youtube.com/watch?v=25kouonvUbg)


