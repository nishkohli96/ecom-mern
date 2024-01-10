const env = process.env;

export const ENV_VARS = Object.freeze({
  algolia: {
    app_id: env.ALGOLIA_APP_ID ?? '',
    write_key: env.ALGOLIA_WRITE_KEY ?? '',
  },
  auth: {
    jwt_secret: env.JWT_SECRET ?? 'jwt_secret_key',
    refresh_token_secret: env.JWT_REFRESH_SECRET ?? 'jwt_refresh_secret_key',
  },
  client_url: env.CLIENT_URL ?? 'http://localhost:3000/',
  mongo: {
    cluster_url: env.CLUSTER_URL ?? 'mongodb://localhost:27017',
    cluster_user: env.CLUSTER_UNAME ?? 'root',
    cluster_pswd: env.CLUSTER_PSWD ?? 'password',
    db_name: env.DB_NAME ?? 'default_db',
  },
  port: env.port ?? 5000,
  razorpay: {
    key_id: env.RAZORPAY_KEY_ID ?? '',
    secret: env.RAZORPAY_SECRET ?? '',
  },
  redis: {
    username: env.REDIS_USERNAME ?? null,
    password: env.REDIS_USER_PSWD ?? null,
    host: env.REDIS_HOSTNAME ?? 'http://localhost',
    port: env.REDIS_PORT ?? '6379',
  },
  sendgrid: {
    apikey: env.SENDGRID_API_KEY ?? '',
    senderEmail: env.SENDGRID_SENDER_EMAIL ?? 'abc@example.com',
    signup_template_id: env.SENDGRID_SIGNUP_TEMPLATE_ID ?? '',
  },
});
