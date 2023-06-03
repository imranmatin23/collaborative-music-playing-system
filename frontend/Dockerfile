
FROM node:13.12.0-alpine

# set a directory for the app
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent

# Copy the whole project to the docker home directory
COPY . .

# start app
CMD ["npm", "run", "start"]
