import { ENV_VARS } from 'app-constants';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

let swaggerPaths = {};
let responses = {};
let schemas = {};
let securitySchemes = {};

async function readYMLFiles() {
  /* Security & Responses */
  const responseData = fs.readFileSync(
    path.join(__dirname + '/components/response.yml'),
    'utf-8'
  );
  const { apiResponse, security } = YAML.parse(responseData);
  securitySchemes = security;
  responses = apiResponse;

  /* Schemas */
  const schemaData = fs.readFileSync(
    path.join(__dirname + '/components/schema.yml'),
    'utf-8'
  );
  schemas = YAML.parse(schemaData);

  /* API Paths */
  const files = fs.readdirSync(path.join(__dirname + '/paths'));
  files.forEach((file) => {
    const fileContent = fs.readFileSync(
      path.join(__dirname + '/paths/' + file),
      'utf-8'
    );
    const reqDoc = YAML.parse(fileContent);
    swaggerPaths = {
      ...swaggerPaths,
      ...reqDoc,
    };
  });
}
readYMLFiles();

export default {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Ecom-mern-backend',
    description: 'Swagger Docs for backend',
  },
  servers: [
    {
      url: ENV_VARS.swagger_url,
    },
  ],
  paths: swaggerPaths,
  components: {
    responses,
    schemas,
    securitySchemes,
  },
};
