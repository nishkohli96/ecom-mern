# Base Image
FROM node:20-alpine3.18 AS phase1

WORKDIR /app

# Run yarn only if package.json changes
# copied tsconfig as shared's tsconfig extends rootDir's tsconfig
COPY package.json .
COPY tsconfig.json .
COPY turbo.json .
COPY yarn.lock .

# first create these directories, else the copying won't work.
# -p flag ensures that parent dirs are also created if they dont exist.
RUN mkdir -p packages/shared && mkdir -p apps/client

# copying the contents of the shared package
COPY ./packages/shared/package.json packages/shared
COPY ./packages/shared packages/shared

COPY ./apps/client/package.json apps/client
COPY ./apps/client apps/client

# install node_modules & build @ecom-mern/shared
RUN yarn install --frozen-lockfile && yarn shared

# build frontend
RUN yarn client:build

# Phase-2 -> Get the Build and host on nginx
FROM nginx:1.25.3-alpine
COPY --from=phase1 /app/apps/client/build /usr/share/nginx/html
