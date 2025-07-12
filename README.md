<!-- @format -->

# Online Directory App

## Deploy Status

### Frontend

[![Netlify Status](https://api.netlify.com/api/v1/badges/9c0b7fdf-f88b-417a-97b2-8ae3a3b75ae9/deploy-status)](https://tbl-directory.netlify.app/)

### Backend

[![Netlify Status](https://api.netlify.com/api/v1/badges/2e55bd3a-5a29-47e9-871e-99493a059a8c/deploy-status)](https://tbl-directory-backend.netlify.app/)

## Local development

1. Obtain info on the development Auth0 setup
2. Create a `local.env` file
   ```
   MONGO_ALIAS=online-directory-app-mongo
   MONGO_INITDB_DATABASE=online-directory-app
   MONGO_INITDB_ROOT_USERNAME=root
   MONGO_INITDB_ROOT_PASSWORD=local_password
   ME_CONFIG_BASICAUTH_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
   ME_CONFIG_BASICAUTH_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
   ME_CONFIG_MONGODB_SERVER=${MONGO_ALIAS}
   ME_CONFIG_MONGODB_ADMINUSERNAME=${MONGO_INITDB_ROOT_USERNAME}
   ME_CONFIG_MONGODB_ADMINPASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
   ME_CONFIG_MONGODB_ENABLE_ADMIN=true
   API_MONGO_URI=mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_ALIAS}:27017/${MONGO_INITDB_DATABASE}?authSource=admin&retryWrites=true
   API_ALLOWED_ORIGINS=http://localhost;http:\/\/localhost:\d{1,5}
   API_BASE_PATH=.netlify/functions/server/_api/v1
   API_AUTH0_AUDIENCE=<Auth0 dev backend audience>
   API_AUTH0_ISSUER=<Auth0 dev issuer>
   API_AUTH0_JWKS_URI=${API_AUTH0_ISSUER}.well-known/jwks.json
   API_AUTH0_TOKEN_ENDPOINT=${API_AUTH0_ISSUER}oauth/token
   API_AUTH0_MANAGEMENT_API_AUDIENCE=<Auth0 dev management API audience>
   API_AUTH0_DB_CONNECTION_NAME=<Auth0 dev DB connection name>
   API_AUTH0_FRONTEND_CLIENT_ID=<Auth0 dev frontend client ID>
   API_AUTH0_CLIENT_ID=<Auth0 dev backend client ID>
   API_AUTH0_CLIENT_SECRET=<Auth0 dev backend client secret>
   REACT_APP_WEBSITE_NAME=Directory App
   REACT_APP_AUTH0_DOMAIN=<Auth0 dev domain>
   REACT_APP_AUTH0_CLIENT_ID=${API_AUTH0_FRONTEND_CLIENT_ID}
   REACT_APP_AUDIENCE=${API_AUTH0_AUDIENCE}
   REACT_APP_API_URL=http://localhost:4000
   REACT_APP_API_BASE_PATH=${API_BASE_PATH}
   REACT_APP_API_SCOPES=create:profile_contact,read:profile_contact,update:profile_contact,create:contacts,read:contacts,update:contacts
   REACT_APP_IMGUR_CLIENT_ID=<Imgur dev client ID>
   REACT_APP_IMGUR_UPLOAD_ENDPOINT=https://api.imgur.com/3/image
   ```
3. Install Docker
4. Run `docker-compose down && docker-compose up --build -d`. All code changes should hot reload (except changes to
   `local.env` or `package.json` - rebuild to activate them).
5. Access the app at `http://localhost:3000`. You will need a user in the dev Auth0 setup to login to the app.
6. Access the backend at `http://localhost:4000`
7. Access Mongo Express (MongoDB viewer) at `http://localhost:8081`

## Deploy

- All pull requests automatically build a preview version to the dev Netlify app instance
  (`https://deploy-preview-*--tbl-directory.netlify.app`)
- Once a PR is merged to `master`, it gets published to the dev Netlify app instance
