/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const port = +(process.env.PORT || 3000);

import migrate from './migrations';

import cluster from 'cluster';
import os from 'os';

import app from './app';


if (cluster.isPrimary) {
    migrate().then(() => {
        const totalCPUs = os.cpus().length;

        console.log(`Number of threads is ${totalCPUs}`);

        // Fork workers.
        for (let i = 0; i < totalCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker) => {
            console.log(`Worker ${worker.process.pid} died`);
            console.log('Forking another worker');
            cluster.fork();
        });
    });
} else {
    const { pid } = process;

    app.listen(port, () => {
        console.log(`Worker ${pid} on port ${port}`);
    });
}
