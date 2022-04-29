FROM --platform=linux/amd64 amazonlinux:2 AS build

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# install curl, tar, gzip utilities
RUN yum install -y curl
RUN yum install tar gzip -y

# nvm environment variables
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 16.14.0

# install nvm
# https://github.com/nvm-sh/nvm#installing-and-updating
RUN mkdir -p /usr/local/nvm \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

WORKDIR /app
ENV PATH "/app/node_modules/.bin:$PATH"
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM --platform=linux/amd64 amazonlinux:2

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# install curl, tar, gzip utilities
RUN yum update -y
RUN yum install -y curl
RUN yum install tar gzip -y

# nvm environment variables
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 16.14.0

RUN mkdir -p /usr/local/nvm \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Install Doppler (see https://docs.doppler.com/docs/cli)
RUN (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh -s -- --verify-signature

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
# The Prisma client is auto-generated based on our specific database schema
# and needs to be copied into our production build
COPY --from=build ./app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build ./app/prisma ./prisma
COPY --from=build ./app/build ./build
EXPOSE 4000
CMD npm run start