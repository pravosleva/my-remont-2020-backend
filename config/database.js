module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        host: env('DATABASE_HOST', env.DATABASE_HOST),
        srv: env.bool('DATABASE_SRV', true),
        port: env.int('DATABASE_PORT', env.DATABASE_PORT),
        database: env('DATABASE_NAME', env.DATABASE_NAME),
        username: env('DATABASE_USERNAME', env.DATABASE_USERNAME),
        password: env('DATABASE_PASSWORD', env.DATABASE_PASSWORD),
      },
      options: {
        // authenticationDatabase: env('AUTHENTICATION_DATABASE', env.AUTHENTICATION_DATABASE),
        ssl: env.bool('DATABASE_SSL', true),
      },
    },
  },
});
