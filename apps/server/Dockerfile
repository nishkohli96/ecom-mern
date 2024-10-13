# Base Image
FROM node:20-alpine3.18 as phase1

WORKDIR /app

# Run yarn only if package.json changes
# copied tsconfig as shared-ui's tsconfig extends rootDir's tsconfig
COPY package.json .
COPY tsconfig.json .
COPY turbo.json .
COPY yarn.lock .

# first create these directories, else the copying won't work.
RUN mkdir -p packages/shared && mkdir -p apps/server

# copying only the required packages
COPY ./packages/shared/package.json packages/shared
COPY ./packages/shared packages/shared

COPY ./apps/server/package.json apps/server
COPY ./apps/server apps/server

# install node_modules & build @ecom-mern/shared
RUN yarn install --frozen-lockfile && yarn shared

# build server
RUN yarn server:build

# run server in dev env
CMD ["yarn", "server:start"]
