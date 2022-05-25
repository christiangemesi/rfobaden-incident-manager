# Dependency Stage.
# Only downloads (and caches) node_modules.
# This allows us to skip this step if no dependencies have changed since the last build.
FROM node:16-alpine3.15 as deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --quiet



# Build Stage.
# Compiles the frontend code.
FROM node:16-alpine3.15 as build
WORKDIR /app

ARG RFO_BACKEND_URL
ENV NEXT_PUBLIC_RFO_BACKEND_URL=${RFO_BACKEND_URL}

ARG RFO_STAGE
ENV RFO_STAGE=${RFO_STAGE}
ENV NEXT_PUBLIC_RFO_STAGE=${RFO_STAGE}

COPY . .
COPY --from=deps /app/node_modules node_modules

RUN npm run build
RUN npm install --production --ignore-scripts



# Production stage.
FROM node:16-alpine3.15
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S rfobaden
RUN adduser -S rfobaden -u 1001

COPY --from=build --chown=rfobaden:rfobaden /app/next.config.js ./
COPY --from=build --chown=rfobaden:rfobaden /app/public ./public
COPY --from=build --chown=rfobaden:rfobaden /app/.next ./.next
COPY --from=build --chown=rfobaden:rfobaden /app/node_modules ./node_modules
COPY --from=build --chown=rfobaden:rfobaden /app/package.json ./package.json

USER rfobaden

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]