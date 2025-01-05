import express from 'express';
import Request from '../models/requestModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, doctorId, date, time, status } = req.body;

  try {
    const request = new Request({ userId, doctorId, date, time, status });
    await request.save();
    res.status(201).json({ message: 'Wniosek utworzony' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

router.get('/', async (req, res) => {
  try {
    const requests = await Request.find({});
    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Wniosek nie znaleziony' });
    }
    res.json(request);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Wniosek nie znaleziony' });
    }

    request.status = status;
    await request.save();
    res.json({ message: 'Status wniosku zaktualizowany' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({ message: 'Wniosek nie znaleziony' });
    }
    res.json({ message: 'Wniosek usunięty' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

export default router;