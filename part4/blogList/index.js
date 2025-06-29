import {PORT} from "./utils/config.js";
import app from "./app.js";
import logger from "./utils/logger.js";

const port = PORT || 3001;

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});