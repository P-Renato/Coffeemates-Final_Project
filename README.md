# Coffeemates-Final_Project

## SERVER

- In the server file, I initialized with `bun init`. I installed express, and cors to start. Later we will add other packages. 
- Run `bun --watch index.ts` to run the `/server`. 
    - Note: Make sure you are inside `/server` directory.
    - Note 2: Don't forget to run `bun i` to install the dependencies.

![TypeScript](https://img.shields.io/badge/TypeScript-007acd?logo=typescript&logoColor=blue)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.0-339933?logo=nodedotjs)
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-1.0-FF7A45?logo=bun&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-0044CC?logo=bcrypt&logoColor=white)
![cookie--parser](https://img.shields.io/badge/cookie--parser-FF6B6B?logo=cookiecutter&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-008080?logo=cors&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-00A98F?logo=multer&logoColor=white)
![Sharp](https://img.shields.io/badge/Sharp-99CC00?logo=sharp&logoColor=white)


## CLIENT

- In the `/client` directory, I used Vite as Bundler to create a React project using TypeScript.
- To run the app:
    - Go to `/client` directory, run `npm install` to install dependencies.
    - Then run `npm run dev`

![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)


## DATABASE

- Database tool will be PostgreSQL

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)


# Docker 

![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

- A docker image is build, and to initialize the docker container: 
    - `docker compose up -d`
    - Then run `docker compose up --build` to open the app on a link, to be able run some tests.
    - If you open the continer on docker the local port will be used by docker, so if you want to run `npm run dev` won't work, so you have to change ports. Run `npm run dev -- --port 5174` instead. 





![NGINX](https://img.shields.io/badge/NGINX-009639?logo=nginx&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?logo=cypress&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?logo=visualstudiocode)