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
                course = await Course.findOne({subject: subject, number: number}).select('-students').populate('teacher', 'id firstname lastname');
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

async function createCourse(req, res, next){
    let curTeacher;
    let curStudent;
    let teach = req.body.teacher;
    let x = [];
    try{
        if(teach.length < 20){
            curTeacher = await User.findOne({username: teach});
            console.log(teach);
            console.log(curTeacher);
            teach = curTeacher._id;
            console.log(teach);
            for(let i =0; i < req.body.students.length; i++){
                 curStudent = await User.find({_id: { $in: req.body.students } });
            }
            for(let i =0; i < req.body.students.length; i++){
                 x.push(curStudent[i]._id);
                 console.log(x);
            }
        }
        const course = new Course({
            subject: req.body.subject,
            number: req.body.number,
            title: req.body.title,
            teacher: teach,
            students: x
        });
        console.log(course);
        await course.save();
        let courses = await Course.findOne({number: req.body.number}).select('-students').populate('teacher', 'id firstname lastname').exec();
        res.json(courses);
    }   
    catch(err){
        next(err);
    }

}
async function showCourse(req, res, next){
        console.log(res.locals.course);
        res.json(res.locals.course);
        //populate teacher con firstname id lastname
}

async function showAllCourses(req, res, next){
    try{
        let courses = await Course.find().select('-students -teacher -firstname -lastname -username -title').exec();
        res.json(courses);
    }
    catch(err){
        next(err);
    }
}

async function updateCourse (req, res, next){
    let curTeacher;
    let teach = req.body.teacher;
    console.log(teach);
    try{
        if(teach.length < 20){
            curTeacher = await User.findOne({username: teach}).select('-username');
        }
        else { //if username
            curTeacher = await User.findById(teach).select('-username');
            teach = curTeacher.id;
        }
        if(curTeacher){ //if ID
            res.locals.course.teacher = curTeacher;
        }
        else{
            common.notFound(req, res);
        }
        let Course = res.locals.course;
        Course.subject =  req.body.subject;
        Course.number = req.body.number;
        Course.title = req.body.title;
        Course.teacher = curTeacher;
        Course.students = req.body.students;
        await Course.save();
        res.json(Course);
    }
    catch(err){
        next(err);
    }
}

async function deleteCourse(req, res, next){
    try{
        let course = res.locals.course;
        await course.remove();
        res.json(course);
    }
    catch(err){
        next(err);
    }
}
async function getCoursesFromUser(req, res, next){
    let teach = [];
    teach = req.params.userid;
    try{
        if(teach.length < 20){
            let teacherr = await User.find({username: teach}).populate('id');
            console.log(teacherr);
            let teachers = await Course.find({teacher: teacherr}).select('-title -students -teacher');
            console.log(teachers);
            let student = await Course.find({students: teacherr}).select('-students -teacher -title');

            res.json({
                teacher: teachers,
                students: student
            });
        }
        else { //if id
            let curTeacher = await Course.find({teacher: teach}).select('-title -students -teacher');
            let student = await Course.find({students: teach}).select('-students -teacher -title');
            
            res.json({
                teacher: curTeacher,
                students: student
            });
        }
        
    }
    catch(err){
        next(err);
    }
    
}


module.exports = {
    lookupCourse,
    showAllCourses,
    deleteCourse,
    updateCourse,
    showCourse,
    createCourse,
    getCoursesFromUser
};