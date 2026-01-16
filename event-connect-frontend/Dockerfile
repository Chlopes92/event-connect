# frontend/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Copie package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Installe Angular CLI globalement
RUN npm install -g @angular/cli

# Copie TOUT le reste du projet (y compris angular.json)
COPY . .

# Expose le port
EXPOSE 4200

# Démarre Angular
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]