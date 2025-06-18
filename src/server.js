import express from 'express';
import cors from 'cors'
import PinoHttp from "pino-http";
import path from 'node:path'

import routes from './routes/routes.js';
import cookieParser from 'cookie-parser';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
export async function setupServer() {
    try {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors({origin: '*'}));
    app.use(PinoHttp());
    app.use(cookieParser());
    app.use('/photos', express.static(path.resolve('src', 'uploads', 'photos')));
    app.use('/api', routes);


    app.use('', notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`Server started on port ${PORT}`);
    });

    } catch (error) {
        console.error(error);
    }

}





