import model from '../models/userModel.js'

function getUser(req) {
    return model.getUser(req.id);
}

function createUser(req) {
    user = {
        userID: req.id,
        email: req.email,
        year_level : req.year_level,
        major : req.major,
        name : req.name
    };
    return model.createUser(user);
}

function updateUser(req) {
    data = {
        email: req.email,
        year_level : req.year_level,
        major : req.major,
        name : req.name
    };
    return model.updateUser(req.id, req.data);
}

function deleteUser(req) {
    return model.deleteUser(req.id);
}
