const express = require('express');
const { readAll, readById, writingTalker,
updatedTalker, removeTalker, filterByTerm } = require('../utils/readAndWriteFiles');
const validateToken = require('../middlewares/validateToken');
const validateName = require('../middlewares/validateName');
const validateAge = require('../middlewares/validateAge');
const { validateTalk, validateWatchedAt, validateRate } = require('../middlewares/validateTalk');
const validateTerm = require('../middlewares/validateTerm');

const router = express.Router();

router.get('/', async (_req, res) => {
  const talker = await readAll();
  if (!talker) return res.status(200).json([]);
  return res.status(200).json(talker);
});

router.get('/search', validateToken, validateTerm, async (req, res) => {
  const term = req.query.q;
  console.log(term);
  const response = await filterByTerm(term);
  console.log(response);
  return res.status(200).json(response);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await readById(id);
  if (talker.length === 0) {
    return res.status(404)
    .json({ message: 'Pessoa palestrante não encontrada' }); 
}
  return res.status(200).json(talker[0]); 
});

router.post('/', validateToken, 
validateName, validateAge,
 validateTalk, validateWatchedAt,
  validateRate, async (req, res) => {
    const talker = req.body;
    const id = await writingTalker(talker);
    return res.status(201).json({ id, ...talker }); 
});

router.put('/:id', validateToken, 
validateName, validateAge,
 validateTalk, validateWatchedAt,
  validateRate, async (req, res) => {
    const { id } = req.params;
    const talker = req.body;
  const response = await updatedTalker(id, talker);
  if (response === null) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
    return res.status(200).json({ id: (+id), ...talker }); 
  });

router.delete('/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  removeTalker(id);
  return res.status(204).json({ id }); 
});

module.exports = router;
