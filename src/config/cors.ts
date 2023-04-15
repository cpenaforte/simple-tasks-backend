import { CorsOptions } from 'cors';

import cors from 'cors';

const whitelist: Array<string> = [
  'http://localhost:8000', 'http://localhost:3000', 'http://localhost:8080',
];

const options: CorsOptions = {
  origin: whitelist,
};

export default cors(options);