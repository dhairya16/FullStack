const express = require("express");
const config = require("./utils/config");
const logger = require("./utils/logger");

const app = require("./app");

app.use(express.json());

const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
