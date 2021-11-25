const express = require('express');
const logger = require("./logger/Logger");
// Initialize connection to mongodb
const mongoConnection = require('./config/mongoConfig');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const userRouter = require('./routers/UserRouter');
const noteRouter = require('./routers/NoteRouter');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('app/src/swagger.yaml');

const app = express();

app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    })
);

app.use(express.json())
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
    res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Router
app.use(userRouter);
app.use(noteRouter);


const port = process.env.PORT || 8001;

app.listen(port, () => {
    logger.info('Listening on port: ' + port);
});