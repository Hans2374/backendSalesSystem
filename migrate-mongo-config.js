require('dotenv').config();

const config = {
  mongodb: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    options: {},
  },

  // The migrations dir, can be an relative or absolute path.
  migrationsDir: 'migrations',

  // The mongodb collection where the applied changes are stored.
  changelogCollectionName: 'changelog',

  // The file extension to create migrations and search for in migration dir.
  migrationFileExtension: '.js',

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determine
  // if the file should be run. Requires that scripts are not modified once combinated to be effective.
  useFileHash: false,

  // Don't change this, unless you know what you're doing
  moduleSystem: 'commonjs',
};

module.exports = config;
