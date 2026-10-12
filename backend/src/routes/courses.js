const express = require('express');
const router = express.Router();
const { Course, Topic } = require('../models');

router.get('/', async (req, res) => res.json(await Course.findAll()));
router.get('/:id/topics', async (req, res) => res.json(await Topic.findAll({ where: { course_id: req.params.id } })));

module.exports = router;
