// swaggerConfig.ts
import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description: 'API documentation for my Express app',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Your server URL
      },
    ],
    components: {
      schemas: {
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the order'
            },
            customerName: {
              type: 'string',
              description: 'Name of the customer'
            },
            orderDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the order was placed'
            },
            totalAmount: {
              type: 'number',
              format: 'float',
              description: 'Total amount of the order'
            },
            status: {
              type: 'string',
              description: 'Status of the order'
            }
          },
          required: ['id', 'customerName', 'orderDate', 'totalAmount', 'status']
        }
      }
    }
  },
  apis: ['src/orders/routes.ts'], // Path to your API route files
};

const swaggerSpec = swaggerJsDoc(options);
export default swaggerSpec;
