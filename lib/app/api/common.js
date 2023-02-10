
function errors(err, req, res, next){
    console.log(err);
    if(err.name === 'MongoServerError'){
        res.status(400);
        res.json({ message: err.message });
    }
    else if (err.name === 'ValidationError') {
        res.status(400);
        res.json({ message: err.message });
    }
    else if(err.name === 'TypeError'){
        res.status(400);
        res.json({ message: 'Other resources depend on this resource.'});
    }

}

function notFound(req, res){
    res.status(404);
    res.json({message: "Resource not found" });
}

function internalError(err, req, res, next){
    console.log(err);
    res.status(500);
    res.json({message: "Internal Server Error"});
}

function Resources (err, req, res, next){
    res.status(400);
    res.json({ message: 'Course validation failed: User `userid` not found.'});
}

module.exports = {notFound, internalError, errors, Resources};