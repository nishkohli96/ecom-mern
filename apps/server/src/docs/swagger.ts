import { ENV_VARS } from 'app-constants';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
// import { parse, stringify } from 'yaml'

// async function readFiles() {
const file = fs.readFileSync(path.join(__dirname + '/paths/test.yml'), 'utf-8');
//}

console.log('--', YAML.parse(file));

export default YAML.parse(file);

// export default {
// 	openapi: '3.0.0',
//   info: {
// 		version: '1.0.0',
//     title: 'Ecom-mern-backend',
//     description: 'Swagger Docs for backend'
// 	},
//   paths: [
// 		{
// 		'/test': YAML.parse(file)
// 		}
// 	],
//   servers: [
// 		{
//       url: ENV_VARS.swagger_url,
//       description: 'Same host which the serves the backend.'
// 		}
//   ]
// }
