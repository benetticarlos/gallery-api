# gallery-api

This is a REST Api created using:

- [Nodejs](https://nodejs.org/) and [Express](https://expressjs.com/)

# How to run this project locally

- Clone this repo
- Run `npm install`
- Set up your local postgres/redis
  - i.e. mac: `brew install postgres`
- Add a `.env` file on the root of the project with the variables

```
API_KEY=''
GATSBY_OPENSEA_API_KEY=''
GATSBY_OPENSEA_GALLERY_ADDRESS=''
INFURA_HTTPS_ENDPOINT=''
INFURA_KEY=''
INFURA_PROJECT_ID=''
INFURA_SECRET=''
INFURA_WSS_ENDPOINT=''
JWT_SECRET
MY_ADDRESS=''
NETWORK=''
OPENSEA_API_KEY=''
OPENSEA_GALLERY_ADDRESS=''
PAPERTRAIL_API_TOKEN=''
REDIS_AUTH=''
REDIS_HOST=''
REDIS_PORT=''
WEB_SITE_URL
PG_DATABASE=''
PG_USER=''
PG_PASSWORD=''
```

- Set up your local postgres database and role

  - i.e. mac: `psql -U postgres -c 'CREATE ROLE gallery_api WITH LOGIN INHERIT CREATEDB'`
  - i.e. mac: `psql -U postgres -c 'CREATE DATABASE gallery_api'`
  - i.e. mac: `psql -U postgres -c 'GRANT ALL PRIVILEGES ON DATABASE gallery_api TO gallery_api'`

- Add migration tables from `~/src/db/db.sql`

- Run `npm run dev` to start the web server for development. Or run `npm start` to start the web server for production.
- Server will run on [http://localhost:3000](http://localhost:3000)

## How to manage production/staging deploys and databases

### Prerequisites

1 - [Install Heroku Cli:](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)

- `npm install -g heroku`

2 - On proyect root, login to heroku with corresponding credentials

- `heroku login`

3 - On proyect root do:

_for staging:_ `git remote add staging https://git.heroku.com/gallery-api-nft-staging.git`

_for production:_ `git remote add production https://git.heroku.com/gallery-api-nft-production.git`

### How to see logs

    `heroku logs --tail --remote production`
    `heroku logs --tail --remote staging`

### How to deploy

- Check the production version of the project is running with no error, do:
  - `npx tsc`
  - `npm run prebuild`
  - `npm start`
- If everything is working
  - _for staging:_ `git push staging main`
  - _for production:_ `git push production main`

### How to connect to database

- _for staging:_ `heroku pg:psql --remote staging`
- _for production:_ `heroku pg:psql black --remote production`
