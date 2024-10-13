const one_hour = 24 * 60 * 60 * 1000;

export const AuthConfig = Object.freeze({
  cookies_name: {
    refresh: 'refresh-token',
    jwt: 'jwt'
  },
  cookies_expiry: {
    /* 1 hour or 3600000 ms */
    jwt: 1 * one_hour,
    /* 7 days */
    refresh: 2 * one_hour,
    /**
     *  attempt to generate new jwt or refresh-token
     *  5 mins before expiry of current token
     */
    renew_threshold: 5 * 60 * 1000
  }
});
