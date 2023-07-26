#  instructions
# Stage 1
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN apk update && apk add --no-cache wget && apk --no-cache add openssl wget && apk add ca-certificates && update-ca-certificates

# Add phantomjs
RUN wget -qO- "https://github.com/dustinblackman/phantomized/releases/download/2.1.1a/dockerized-phantomjs.tar.gz" | tar xz -C / \
    && npm install -g phantomjs-prebuilt
    
# Add fonts required by phantomjs to render html correctly
RUN apk add --update ttf-dejavu ttf-droid ttf-freefont ttf-liberation && rm -rf /var/cache/apk/*

RUN echo "" > /tmp/openssl.cnf
RUN npm install
COPY . .
ENV MONGODB_URL=mongodb+srv://subhamvairav:PDwIWPpPKFYkZ6Mk@cluster1.0ycej0c.mongodb.net/IRS?retryWrites=true&w=majority \
    ACCESS_TOKEN_SECRET=036a49dd552de45a91918febe21497090d2b7e60ed49455cb7fe720386a99b5412dde418c973339ad977daae18de06bfa1e0a334cdf1d1d5e82cfb99e4f53cf2 \
    REFRESH_TOKEN_sECRET=f2fc00ba21e6f2fe6fab26c307a3048d51884429e6636e7ebf757d0f7264d6ad04057a2dd76b96d603be71f61759bbc4c5aa1f75915a404c549b1cc17e84b1a9 \
    EMAIL=subhamvairav@gmail.com \
    PASSWORD=ywlnenbaqmnlnxuv
EXPOSE 5000
CMD ["npm","start"]  

