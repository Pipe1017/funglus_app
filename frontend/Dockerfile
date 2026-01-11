# Etapa 1: Build
FROM node:20-alpine as build

WORKDIR /app

# 🔥 Recibir variable de entorno del docker-compose
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build para producción
RUN npm run build

# Etapa 2: Servir con nginx
FROM nginx:alpine

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]