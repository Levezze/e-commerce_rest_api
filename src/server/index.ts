import express from 'express';
import cors from 'cors';
import { ExpressAuth } from '@auth/express';

const app = express();
const PORT = 3000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});
