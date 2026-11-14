const { v4: uuidv4 } = require('uuid');

function generateId(prefix = '') {
  const id = uuidv4().split('-')[0];
  return prefix ? `${prefix}_${id}` : id;
}

module.exports = { generateId };