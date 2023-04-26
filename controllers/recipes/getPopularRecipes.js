const { PopularMeals } = require('../../models/popularMeals');
const { POPULAR_RECIPES_LIMIT } = require('../../config/defaults');

const getPopularRecipes = async (req, res) => {
  const data = await PopularMeals.find(
    {
      idMeal: { $exists: true },
      $expr: { $lt: [{ $strLenCP: '$idMeal' }, 6] },
    },
    '-_id -users'
  )
    .sort({ users: 1 })
    .limit(POPULAR_RECIPES_LIMIT);

  res.json({ meals: data });
};

module.exports = getPopularRecipes;
