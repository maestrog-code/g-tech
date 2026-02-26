# ── Stage 1: Dependencies ─────────────────────────────────────────
FROM node:20-alpine AS deps

# Install native build tools for sqlite3
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# ── Stage 2: Builder ──────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Install ALL deps (including devDependencies) for build
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source
COPY . .

# Build the Next.js app in standalone mode
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: Runner ───────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

# Copy standalone output (only what's needed to run)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static      ./.next/static
COPY --from=builder /app/public            ./public

# Copy database file (sqlite) if it exists
COPY --from=builder --chown=nextjs:nodejs /app/gtech_vault.db* ./

# sqlite3 needs its native binary from the production deps
COPY --from=deps /app/node_modules/sqlite3 ./node_modules/sqlite3
COPY --from=deps /app/node_modules/sqlite  ./node_modules/sqlite
COPY --from=deps /app/node_modules/bindings ./node_modules/bindings
COPY --from=deps /app/node_modules/file-uri-to-path ./node_modules/file-uri-to-path

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/citizen || exit 1

CMD ["node", "server.js"]
