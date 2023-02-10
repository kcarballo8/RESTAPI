const express = require('express');
const bodyParser = require('body-parser');
const user = require('./user');
const course = require('./course');
const rosters = require('./rosters');
const common = require('./common');
const router = express.Router();

router.use(bodyParser.json());
router.param('userid', user.lookupUser);

router.get('/users', user.showAllUsers); //id and username
router.get('/users/:userid', user.showUser); 
router.post('/users', user.createUser); 
router.put('/users/:userid', user.updateUser);
router.delete('/users/:userid', user.deleteUser);

// Course

router.param('courseid', course.lookupCourse);
router.get('/courses', course.showAllCourses); //id and username
router.get('/courses/:courseid', course.showCourse); 
router.get('/courses/users/:userid', course.getCoursesFromUser);
router.post('/courses', course.createCourse); 
router.put('/courses/:courseid', course.updateCourse);
router.delete('/courses/:courseid', course.deleteCourse);

router.param('classid', rosters.lookupCourse);
router.param('userid', rosters.lookupUser);
router.get('/rosters/:classid', rosters.studentsInClass);
router.put('/rosters/:classid/:userid', rosters.addStudentsToClass);
router.use(common.notFound);
router.use(common.errors);
router.use(common.internalError);

module.exports = {router};