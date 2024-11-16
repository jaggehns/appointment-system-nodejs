FROM node:20-alpine as builder

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npm install -g pnpm@9.3.0 typescript

COPY package.json pnpm-lock.yaml ./

COPY prisma /app/prisma

ARG NODE_ENV=development
RUN pnpm install

RUN pnpm prisma:generate && pnpm prisma:migrate:deploy

COPY ./ ./

RUN tsc --outDir build

RUN pnpm build

# === Production Stage ===

FROM node:20-alpine

RUN npm install -g pnpm@9.3.0

WORKDIR /app

COPY --from=builder /app /app

RUN pnpm prune --prod

ENV NODE_ENV=production

# Start the application
CMD ["node", "build/src/app.js"]
