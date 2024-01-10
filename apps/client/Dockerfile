# Base Image
FROM node:17-alpine3.14 as phase1

WORKDIR /app

# To prevent the "command tsc not found" issue
RUN npm i -g typescript

# Run yarn only if package.json changes
# copied tsconfig as shared-ui's tsconfig extends rootDir's tsconfig
COPY package.json .
COPY tsconfig.json .

# first create these directories, else the copying won't work.
RUN mkdir -p packages/shared-ui
RUN mkdir -p apps/frontend

# copying only the required packages
COPY ./packages/shared-ui/package.json packages/shared-ui
COPY ./packages/shared-ui packages/shared-ui

COPY ./apps/frontend/package.json apps/frontend
COPY ./apps/frontend apps/frontend

# install node_modules
RUN npm install
RUN yarn shared-ui:build
RUN npm install

# build frontend
RUN yarn frontend:build

# Phase 2 - Get the Build and host on nginx
FROM nginx:1.21.6-alpine
COPY --from=phase1 /app/apps/frontend/build /usr/share/nginx/html
