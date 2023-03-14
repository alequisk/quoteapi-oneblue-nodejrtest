import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Quotes API",
    description: "API to manage quotes",
  },
  host: "localhost:3000",
  scheme: ["http"],
};

const outputFile = "../http-api/swagger.json";
const endpointsFiles = ["../http-api/routes.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);