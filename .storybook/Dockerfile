FROM node:16-alpine3.14 AS build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY src ./src
COPY .storybook ./.storybook
RUN yarn build-storybook -o ./story-book-build

FROM node:16-alpine3.14 AS final
WORKDIR /usr/src/app
EXPOSE 80
COPY --from=build /usr/src/app/story-book-build ./story-book-build
RUN npm install -g http-server

CMD ["sh", "-c", "npx http-server ./story-book-build -p 80 --yes"]