const { PopularMeals } = require('../../models/popularMeals');
const { fetchRecipeById } = require('../../services');
const { Recipe } = require('../../models/recipes');
const { HttpError } = require('../../routes/errors/HttpErrors');

const addFavorite = async (req, res) => {
  const { idMeal: idRecipe } = req.body;
  const { _id } = req.user;

  const isPopular = await PopularMeals.findOneAndUpdate(
    { idMeal: idRecipe },
    { $addToSet: { users: _id } }
  );


  try {
  console.log('addFavorite');
  console.log('isPopular ', isPopular);
  console.log('id length ', idRecipe.toString().length);

 
    const { meals } = await fetchRecipeById(idRecipe);

    const { idMeal, strMeal, strInstructions, strMealThumb } = meals[0];

    if (!isPopular) {
      await PopularMeals.create({
        idMeal,
        strMeal,
        strInstructions,
        strMealThumb,
        users: [_id],
      });
    }
  } catch {
    const ownRecipe = await Recipe.findOne({
      _id: idRecipe,
      owner: _id,
    });

    if (!ownRecipe) {
      throw HttpError(400, 'Unknown recipe!');
    }

    const { title, description, imgURL } = ownRecipe;

    if (!isPopular) {
      await PopularMeals.create({
        idMeal: idRecipe,
        strMeal: title,
        strInstructions: description,
        strMealThumb: imgURL,
        users: [_id],
      });
    }
  }

  res.status(201).json({ message: 'Added to favorite' });
};

module.exports = addFavorite;
