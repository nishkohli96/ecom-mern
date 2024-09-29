import { ENV_VARS } from 'app-constants';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

// async function readFiles() {
const file = fs.readFileSync(path.join(__dirname + '/paths/test.yml'), 'utf-8');
const file2 = fs.readFileSync(
  path.join(__dirname + '/paths/test2.yml'),
  'utf-8'
);

const f1 = YAML.parse(file);
const f2 = YAML.parse(file2);
const paths = {
  ...f1.paths,
  ...f2.paths,
};
console.log('paths: ', paths);

export default {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Ecom-mern-backend',
    description: 'Swagger Docs for backend',
  },
  paths,
  servers: [
    {
      url: ENV_VARS.swagger_url,
      description: 'Same host which the serves the backend.',
    },
  ],
};
