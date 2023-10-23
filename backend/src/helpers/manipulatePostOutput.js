export default function manipulatePostOutput(posts) {
    return posts.map(post => {
        return {
            postId: post._id.toString(),
            forumId: post.forumId,
            writtenBy: post.writtenBy,
            dateWritten: post.dateWritten,
            content: post.content
        };
    });
}