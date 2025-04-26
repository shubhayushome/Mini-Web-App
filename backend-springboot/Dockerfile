FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
