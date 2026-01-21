# backend/Dockerfile

# === ÉTAPE 1 : Compilation ===
# Utilise Maven 3.9 avec Java 21
FROM maven:3.9-eclipse-temurin-21 AS build

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie le fichier pom.xml (liste des dépendances)
COPY pom.xml .

# Copie le code source
COPY src ./src

# Compile le projet et crée le fichier JAR
# -DskipTests = on saute les tests pour aller plus vite
RUN mvn clean package -DskipTests

# === ÉTAPE 2 : Exécution ===
# Utilise Java 21 JRE (version plus légère, sans outils de développement)
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copie le JAR compilé depuis l'étape précédente
COPY --from=build /app/target/*.jar app.jar

# Port de Spring Boot
EXPOSE 10000

# Démarre l'application
ENTRYPOINT ["java", "-jar", "app.jar"]