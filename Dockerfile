FROM node:22-alpine AS frontend-builder

WORKDIR /app/my-app

COPY my-app/package.json ./
RUN npm install --no-package-lock

COPY my-app/ ./
ARG REACT_APP_API_BASE_URL=""
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
RUN npm run build


FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg imagemagick \
  && rm -rf /var/lib/apt/lists/*

COPY server/requirements.txt ./server/requirements.txt
RUN pip install --no-cache-dir -r server/requirements.txt

COPY server/ ./server/
COPY --from=frontend-builder /app/my-app/build ./my-app/build

CMD ["sh", "-c", "cd server && uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}"]
