import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { expressPort } from './consts.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(expressPort, () => console.log("Server online!"));

export default app;