import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


import { routes } from './routes';

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(routes);

import { errorHandler } from './middlewares/errorHandler';
app.use(errorHandler);





app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Product Management System API' });
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);

});
