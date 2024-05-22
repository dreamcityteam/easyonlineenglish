const express = require('express');
const routers = require('./routers');

const router = express.Router();

routers.forEach(({ method, path, func }) => {
  router[method](path, func);
});

module.exports = router;