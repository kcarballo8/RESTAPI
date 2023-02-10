const req = require("express/lib/request");
const {Course} = require("../../models/course");
const {User} = require("../../models/user");
const common = require('./common');

async function lookupCourse(req, res, next, value) {
    let course;
    try{
        if(value.length > 20){ //if id
            course = await Course.findById(value).select('-students').populate('teacher', 'id firstname lastname');
        }
        else { //if username
            let match = value.match(/^([a-zA-Z]{4})(\d{4})$/);
            if (match) {
                let subject = match[1].toUpperCase();
                let number = Number(match[2]);
                course = await Course.findOne({subject: subject, number: number}).select().populate('teacher', 'id firstname lastname');
            }
        }
        if(course){ //if ID
            res.locals.course = course;
            console.log(res.locals.course);
            next();
        }
        else{
            common.notFound(req, res);
        }
    }
    catch(err){
        next(err);
    }
}

async function lookupUser(req, res, next, value) {
    let user;
    try{
        if(value.length > 20){
            user = await User.findById(value);
        }
        else {
            user = await User.findOne({username: value});
        }
        if(user){
            res.locals.user = user;
            next();
        }
        else{
            common.notFound(req, res);
        }
    }
    catch(err){
        next(err);
    }
}
async function studentsInClass(req, res, next){
    let name = []; let sub = []; let num = [];
    name = req.params.classid;
    let students = [];
    for(let i = 0; i < 4; i++){
        sub += name[i];
    }
    for(let i = 4; i < 8; i++){
        num += name[i];
    }
 try{
        if(req.params.length < 20){
            let courses = await Course.find({subject: sub, number: num}).select('students').populate('subject number').exec();
            for(let i = 0; i < courses.students.length; ++i){
                let student = await User.findById(courses.students[i]);
                console.log(student);
                students.push({id: student._id,username: student.username});
            }
        }
        else{
            let courses = await Course.findById(name).select('students').populate('students', 'username').exec();
            for(let i = 0; i < courses.students.length; ++i){
                let student = await User.findById(courses.students[i]);
                students.push({id: student._id, username: student.username});
            }
        }
        if(students.length == 0){
            common.notFound(req, res);
        }
        else {res.json(students);}
        
    }
  catch(err){
    next(err);
   }
}


async function addStudentsToClass(req, res, next){
    let user;
    try{
        console.log(req.params.userid);
        console.log(res.locals.user);
        let course = res.locals.course;
        console.log(course);
        let userid = res.locals.user;
        if(req.params.userid < 20){
            user = await User.findOne({username: req.params.userid});
            console.log(user);
        }
        else{
            user = await User.findById(res.locals.user).select(' -username -email -firstname -lastname');
            console.log(user);
            console.log(user._id);
        }
        console.log(course);
        course.students.push(user);
        console.log(course);
        await course.save();
        res.json(user);
    }
    catch(err){
        next(err);
    }
}


module.exports = {studentsInClass, addStudentsToClass, lookupCourse, lookupUser};