import express, { Application, Request, Response } from "express";
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig';
import orderRoutes from "./orders/routes";
import sequelize from "./common/database";
import defineOrder from "./common/models/Order";
const Order = defineOrder(sequelize);

sequelize.sync().then(() => {
    console.log("Database & tables created!");
}).catch((error) => {
    console.error("Error creating database: ", error);
});

const app: Application = express();
const port = 3000; // The port your express server will be running on.

app.set('trust proxy', true);

// Enable CORS for browser clients
app.use(cors({ origin: true, credentials: true }));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route to export the JSON file
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec); // 'swaggerSpec' is your generated spec object
});

app.use('/orders', orderRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

export default app;

// Start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on http://0.0.0.0:${port}`);
    });
}