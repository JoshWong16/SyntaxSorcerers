/* ChatGPT usage: No */
export default function manipulateForumOutput(forums) {
    return forums.map(forum => {
        return {
            forumId: forum._id.toString(),
            name: forum.name,
            createdBy: forum.createdBy,
            dateCreated: forum.dateCreated,
            course: forum.course
        };
    });
}