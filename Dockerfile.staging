FROM node:14 AS builder

WORKDIR /app 

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
RUN npm install 
RUN npm install react-scripts@3.4.1 -g 

COPY . ./

RUN npm run build:stag

FROM scratch
COPY --from=builder /app/build /build
