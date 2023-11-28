/* eslint-disable no-console */
import app from './app';
import mongoose from 'mongoose';
import config from './app/config';

async function main() {
  try {
    await mongoose.connect(config.database_url as string).then(() => {
      console.log('database connected successfully');
    });
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
