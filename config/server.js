module.exports = ({ env }) => ({
  host: env('HOST', env.HOST),
  port: env.int('PORT', env.PORT),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', env.ADMIN_JWT_SECRET),
    },
  },
});
