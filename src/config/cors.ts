import { CorsOptions } from 'cors';

import cors from 'cors';

const whitelist: Array<string> = [
    'http://localhost:9000', 'http://localhost:3000', 'https://simple-tasks-px8aac615-cpenaforte.vercel.app/',
];

const options: CorsOptions = {
    origin: whitelist,
};

export default cors(options);