# Étape 1 : Build Stage
FROM node:16-alpine AS builder

# Installer les dépendances de build pour bcrypt et d'autres modules natifs
RUN apk add --no-cache make gcc g++ python3 git

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Compiler le code TypeScript
RUN npm run build

# Étape 2 : Production Stage
FROM node:16-alpine

# Installer les dépendances nécessaires pour exécuter les modules natifs comme bcrypt
RUN apk add --no-cache make gcc g++ python3 git

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de production uniquement
RUN npm install --only=production

# Copier le code compilé depuis l'étape de build
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 3000

# Commande pour lancer l'application
CMD ["node", "dist/index.js"]
