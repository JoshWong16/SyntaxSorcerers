export default function manipulatePostOutput(posts) {
    return posts.map(post => {
        return {
            postId: post._id.toString(),
            forumId: post.forumId,
            writtenBy: post.username,
            dateWritten: post.dateWritten,
            content: post.content,
            likesCount: post.likes_count, 
            commentCount: post.comment_count,
            userLiked: post.userLiked
        };
    });
}