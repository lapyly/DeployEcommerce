const { fileURLToPath } = require('url');
const { dirname } = require('path');
const __filename = fileURLToPath(meta.url);
const __dirname = dirname(__filename)
module.exports = {__dirname}
