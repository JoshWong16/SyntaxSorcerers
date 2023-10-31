/* ChatGPT usage: No */
const getUserId = (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        req.userId = req.headers.authorization.split(' ')[1];
    } else {
        res.status(401).json({message: "Unauthorized"});
    }
    next();
};

export { getUserId };