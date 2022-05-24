FROM gradle:7.3.1-jdk11-alpine as build

WORKDIR /app

COPY backend/ .

RUN gradle --no-daemon build -x test

FROM openjdk:18-jdk-alpine3.15

WORKDIR /app

COPY --from=build /app/build/libs/backend.jar /app/backend.jar

CMD ["java", "-jar", "/app/backend.jar"]
