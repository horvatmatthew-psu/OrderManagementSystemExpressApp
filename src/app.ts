import express, { Application, Request, Response } from "express";
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

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/orders', orderRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});