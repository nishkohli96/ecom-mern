# Base Image
FROM node:20-alpine3.18 as phase1

WORKDIR /app

# Run yarn only if package.json changes
# copied tsconfig as shared's tsconfig extends rootDir's tsconfig
COPY turbo.json .
COPY tsconfig.json .
COPY package.json .

# first create these directories, else the copying won't work.
RUN mkdir -p packages/shared
RUN mkdir -p apps/client

# copying the contents of the shared package
COPY ./packages/shared/package.json packages/shared
COPY ./packages/shared packages/shared

COPY ./apps/client/package.json apps/client
COPY ./apps/client apps/client

# install node_modules
RUN yarn
RUN yarn lib:build

# build frontend
RUN yarn build-apps

# Phase-2 -> Get the Build and host on nginx
FROM nginx:1.25.3-alpine
COPY --from=phase1 /app/apps/client/build /usr/share/nginx/html
