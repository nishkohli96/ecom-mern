import mongoose from 'mongoose';
import chalk from 'chalk';

const connectToDB = () => {
  beforeAll(async () => {
    await mongoose.connect('');
    console.log(chalk.green('Connected to DB...'));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    console.log(chalk.red('Disconnected from DB.'));

    // Free Garbage Collector to free memory.
    global.gc && global.gc();
  });
};

export default connectToDB;
