const dotenv = require('dotenv');

const result = dotenv.config();

let envs;

if (!('error' in result)) {
  envs = result.parsed;
} else {
  envs = {};
  process.env.forEach((value, key)  => {
    envs[key] = value;
  });
  console.log('envs: '+JSON.stringify(envs));
}

module.exports = envs;