const {User} = require("../../models/user");
const {Course} = require("../../models/course");
const common = require('./common');


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


async function createUser(req, res, next){

    try{
        const user = new User({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
        });
        await user.save();
        res.json(user);
    }   
    catch(err){
         next(err);
    }

}
async function showUser(req, res, next){
    try{
        //by id ?
        console.log(req.params);
        if(req.params.userid.length < 20)
       { 
            let users = {};
            users = await User.findOne({username: req.params.userid});
            console.log(users);
            res.json(users);
        }
        else{
            let users = {};
            users = await User.findById({_id: req.params.userid});
            console.log(users);
            res.json(users);
        }
    }
    catch(err){
        next(err);
    }
}

async function showAllUsers(req, res, next){
    try{
        let users = await User.find().select('username');
        res.json(users);
    }
    catch(err){
        next(err);
    }
}

async function updateUser (req, res, next){
    try{
        let user = res.locals.user;
        user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        await user.save();
        res.json(user);
    }
    catch(err){
        next(err);
    }
}
async function deleteUser(req, res, next){
    let userInCourse = [];
    userInCourse = req.params.userid;
    try{
        if(userInCourse.length < 20){
            let findId = await User.find({username: userInCourse}).populate('id');
            let teachers = await Course.find({teacher: findId}).select('-title -students').populate('teacher','id subject number').exec();
            let students = await Course.find({students: findId}).select('-students').populate('students', 'id subject number').exec();
            if(teachers.length == 0 && students.length == 0){
                let usertoDelete = res.locals.user;
                await usertoDelete.remove();
                res.json(usertoDelete);
            }
            else{
                common.Resources(req, res, next);
            }
        }
        else { //if id
            let teachers = await Course.find({teacher: userInCourse}).select('-title -students').populate('teacher','id subject number').exec();
            let students = await Course.find({students: userInCourse}).select('-students').populate('students', 'id subject number').exec();
            if(teachers.length == 0 && students.length == 0){
                let usertoDelete = res.locals.user;
                await usertoDelete.remove();
                res.json(usertoDelete);
            }
            else{
                common.Resources();
            }
        }


    }
    catch(err){
        next(err);
    }
}

module.exports = {
    lookupUser, 
    createUser, 
    showUser, 
    showAllUsers, 
    updateUser, 
    deleteUser
};