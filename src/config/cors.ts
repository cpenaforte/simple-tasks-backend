import { CorsOptions } from 'cors';

import cors from 'cors';

const whitelist: Array<string> = [
    'http://localhost:9000', 'http://localhost:3000', 'simple-tasks-sandy.vercel.app',
];

const options: CorsOptions = {
    origin: whitelist,
};

export default cors(options);