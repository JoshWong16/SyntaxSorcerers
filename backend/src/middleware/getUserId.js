import Banned from "../models/Banned.js";

/* ChatGPT usage: No */
const getUserId = async (req, res, next) => {
    const model = new Banned();
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && !(await model.getBannedUser(req.headers.authorization.split(' ')[1]))) {
        req.userId = req.headers.authorization.split(' ')[1];
        next();
    } else {
        return res.status(401).json({message: "Unauthorized"});
    }
};

export { getUserId };