import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  salt_round: process.env.SALT_ROUND,
  defaultPassword: process.env.DEFAULT_PASSWORD,
  access_token: process.env.ACCESS_TOKEN,
  access_expires_in: process.env.ACCESS_EXPIRES_IN,
  refresh_token: process.env.REFRESH_TOKEN,
  refresh_expires_in: process.env.ACCESS_REFRESH_IN,
  front_end_link: process.env.FRONT_END_LINK,
  cloud_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_API_KEY,
  cloud_api_secret: process.env.CLOUD_API_SECRET,
};
