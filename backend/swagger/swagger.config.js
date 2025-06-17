const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Qzene API',
      version: '1.0.0',
      description: 'API for Qzene Admin and User Panels',
    },
    servers: [
      { url: 'http://localhost:5001' },       // Local server
      { url: 'https://osaw.in/v1/' },         // Production server
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    './routes/admin/*.js',  // Admin routes
    './routes/users/*.js',  // User routes
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
