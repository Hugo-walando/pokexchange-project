const Card = require('../models/Card');

// controllers/cardController.ts
const getCardsBySet = async (req, res) => {
  const { set_code } = req.params;
  try {
    console.log('Fetching cards for set:', set_code);
    const cards = await Card.find({ set_code }).sort({
      official_id: 1,
    });
    console.log(cards);
    res.status(200).json(cards);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des cartes' });
  }
};
const getCardById = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findOne({ official_id: id });
    if (!card) return res.status(404).json({ message: 'Carte non trouvée' });
    res.status(200).json(card);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération de la carte' });
  }
};

module.exports = {
  getCardsBySet,
  getCardById,
};
