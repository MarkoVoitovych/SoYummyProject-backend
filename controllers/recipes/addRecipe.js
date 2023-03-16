const { Recipe } = require('../../models');

const { DEFAULT_RECIPE_IMG_URL } = require('../../config/defaults');
const { BASE_INGREDIENT_IMG_URL } = require('../../config/defaults');

const { fetchIngredientsList } = require('../../helpers/instance');
const { HttpError } = require('../../routes/errors/HttpErrors');

const addRecipe = async (req, res) => {
  const { _id } = req.user;
  const { ingredients, ...recipe } = req.body;

  const ingredientList = await fetchIngredientsList();
  const pictureURL = req.file?.path ?? DEFAULT_RECIPE_IMG_URL;

  const foundIngredients = ingredients
    .map(({ ingredient, qty }) => {
      const foundIngredient = ingredientList.meals.find(
        item => item.strIngredient === ingredient
      );
      return (
        foundIngredient && {
          ingredient,
          qty,
          description: foundIngredient.strDescription,
          imgURL: `${BASE_INGREDIENT_IMG_URL}/${ingredient.replace(
            /\s/g,
            '%20'
          )}-small.png`,
          id: foundIngredient.idIngredient,
        }
      );
    })
    .filter(Boolean);

  const conditions = foundIngredients.map(obj => ({
    $elemMatch: obj,
  }));

  const result = await Recipe.findOne({
    owner: _id,
    ingredients: { $all: conditions },
  });

  if (result) {
    throw HttpError(409, 'Recipe is already created');
  }

  const newRecipe = await Recipe.create({
    ...recipe,
    owner: _id,
    imgURL: pictureURL,
    ingredients: foundIngredients,
  });

  res.json({
    id: newRecipe._id,
    title: newRecipe.title,
    about: newRecipe.about,
    category: newRecipe.category,
    description: newRecipe.description,
    cookingTime: newRecipe.cookingTime,
    imgURL: newRecipe.imgURL,
  });
};

module.exports = addRecipe;
