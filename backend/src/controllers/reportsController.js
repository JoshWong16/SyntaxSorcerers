import Reports from '../models/Reports.js';

/* ChatGPT usage: No */
export async function getAllUsersReports(req, res) {
    const model = new Reports();
    try {
        const reports = await model.getAllReports();
        return res.json(reports);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function getUserReports(req, res) {
    const model = new Reports();
    try {
        const reports = await model.getUserReports(req.params.userId);
        return res.json(reports);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function addReport(req, res) {
    const model = new Reports();
    try {
        if (!req.body.userId || (!req.body.commentId && !req.body.postId)) {
            return res.status(400).json({message: 'Invalid request, missing required fields'});
        }
        const reportId = await model.addReport(req.body.userId, req.body.commentId || null, req.body.postId || null);
        return res.json({reportId});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
} 