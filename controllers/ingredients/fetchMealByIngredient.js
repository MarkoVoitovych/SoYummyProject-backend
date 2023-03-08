const axios = require('axios');

const BASE_URL = 'https://themealdb.com/api/json/v1/1'

const fetchMealByIngredient = async (req, res) => {
    const { i } = req.body;
    await axios.get(`${BASE_URL}/filter.php?i=${i}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.error(error);
            res.sendStatus(500);
        });
};


module.exports = fetchMealByIngredient;
