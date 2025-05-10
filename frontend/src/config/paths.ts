export const paths = {
  home: {
    getHref: () => '/',
  },

  auth: {
    login: {
      getHref: () => '/auth/login',
    },
  },

  app: {
    root: {
      getHref: () => '/app',
    },
  },
} as const;
