const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');
const usersRouter = require('./routes/api/auth');
const ingredientsRouter = require('./routes/api/ingredients');
const recipesRouter = require('./routes/api/recipes');
const ownRecipesRouter = require('./routes/api/ownRecipes');
const favoriteRouter = require('./routes/api/favorite');
const shoppingListRouter = require('./routes/api/shoppingList');
const corsOptions = require('./config/corsOptions');
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', usersRouter);
app.use('/recipes', recipesRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/own-recipes', ownRecipesRouter);
app.use('/favorite', favoriteRouter);
app.use('/shopping-list', shoppingListRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
