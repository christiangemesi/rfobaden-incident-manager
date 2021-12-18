# Dependency Stage.
# Only downloads (and caches) node_modules.
# This allows us to skip this step if no dependencies have changed since the last build.
FROM node:16-alpine3.11 as deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --quiet



# Build Stage.
# Compiles the frontend code.
FROM node:16-alpine3.11 as build
WORKDIR /app

ARG RFO_BACKEND_URL
ENV NEXT_PUBLIC_RFO_BACKEND_URL=${RFO_BACKEND_URL}

COPY . .
COPY --from=deps /app/node_modules node_modules

RUN npm run build
RUN npm install --production --ignore-scripts



# Production stage.
FROM node:16-alpine3.11
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S rfobaden
RUN adduser -S rfobaden -u 1001

COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build --chown=rfobaden:rfobaden /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

USER rfobaden

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]