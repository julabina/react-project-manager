const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');

const auth = require('../middleware/auth');

router.post('/create', auth, projectController.createProject);
router.get('/getInfos/:id', auth, projectController.getProject);
router.post('/getProjects', auth, projectController.getProjects);

module.exports = router;