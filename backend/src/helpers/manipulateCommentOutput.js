export default function manipulateCommentOutput(comments) {
    return comments.map(comment => {
        return {
            commentId: comment._id.toString(),
            postId: comment.postId,
            content: comment.content,
            writtenBy: comment.writtenBy,
            dateWritten: comment.dateWritten
        };
    });
}