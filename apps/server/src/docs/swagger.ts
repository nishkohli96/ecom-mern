import { ENV_VARS } from 'app-constants';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

let swaggerPaths = {};
let responses = {};
let schemas = {};
let securitySchemes = {};

async function readYMLFiles() {
  /* Responses */
  const responseData = fs.readFileSync(
    path.join(__dirname + '/components/response.yml'),
    'utf-8'
  );
  responses = YAML.parse(responseData);

  /* Security Schema */
  const securitySchemaData = fs.readFileSync(
    path.join(__dirname + '/components/security-scheme.yml'),
    'utf-8'
  );
  securitySchemes = YAML.parse(securitySchemaData);

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
      description: 'Same host which the serves the backend.',
    },
  ],
  paths: swaggerPaths,
  components: {
    responses,
    schemas,
    securitySchemes,
  },
};
