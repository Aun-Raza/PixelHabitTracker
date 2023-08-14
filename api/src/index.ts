import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const { PORT } = process.env;

app.listen(PORT, () => {
  return console.log(`Server is listening on ${PORT}`);
});
