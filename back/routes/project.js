const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');

const auth = require('../middleware/auth');

router.post('/create', auth, projectController.createProject);
router.get('/getInfos/:id', auth, projectController.getProject);
router.post('/getProjects', auth, projectController.getProjects);
router.post('/addCollab', auth, projectController.addCollab);
router.post('/removeCollab/:id', auth, projectController.removeCollab);

module.exports = router;