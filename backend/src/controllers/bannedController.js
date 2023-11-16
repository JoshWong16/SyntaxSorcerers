import Banned from '../models/Banned.js';

/* ChatGPT usage: No */
export async function getAllBannedUsers(req, res) {
    const model = new Banned();
    try {
        const bannedUsers = await model.getAllBannedUsers();
        return res.json(bannedUsers);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function getBannedUser(req, res) {
    const model = new Banned();
    try {
        const userExists = await model.getBannedUser(req.params.userId);
        const message = userExists ? "User is banned" : "User is not banned"
        return res.json({message});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function addBannedUser(req, res) {
    const model = new Banned();
    try {
        const bannedId = await model.addBannedUser(req.body.userId);
        return res.json(bannedId);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}