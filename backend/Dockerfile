# Stage 1: Build the application
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only the pom.xml first to resolve dependencies (this caches them for faster builds)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port (Render can bind to 8080 automatically)
EXPOSE 8080

# Environment variables can be passed at runtime (from Render's dashboard)
# Example: FRONTEND_URL, DB_URL, etc.
ENV PORT=8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
