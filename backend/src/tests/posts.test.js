import request  from 'supertest';
import app from '../app.js';
import Banned from '../models/Banned.js';
import Post from '../models/Posts.js';

// Mock the models
jest.mock('../models/Banned.js');
jest.mock('../models/Posts.js');

describe('Testing All Posts Interfaces:', () => {
    beforeAll(() => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockReturnValue(false);
    });

    afterEach(() => {    
        jest.clearAllMocks();
    });

    // Interface GET /posts/:forumId
    describe('GET /posts/forum/:forumId', () => {
        // Input: valid forumId with no category query
        // Expected status code: 200 OK
        // Expected behavior: retrieve all posts in forum in the db
        // Expected output: all posts in forum
        test('valid forumId with no category query', async () => {
            const forumId = 'validForumId';
            const posts = [
                {
                    postId: 'validPostId',
                    forumId: forumId,
                    writtenBy: 'validUserId',
                    userId: 'validUserId',
                    dateWritten: 'validDate',
                    content: 'validContent',
                    likesCount: 0,
                    commentCount: 0,
                    userLiked: false
                },
                {
                    postId: 'validPostId2',
                    forumId: forumId,
                    writtenBy: 'validUserId',
                    userId: 'validUserId',
                    dateWritten: 'validDate',
                    content: 'validContent',
                    likesCount: 0,
                    commentCount: 0,
                    userLiked: false
                },
                {
                    postId: 'validPostId3',
                    forumId: forumId,
                    writtenBy: 'validUserId',
                    userId: 'validUserId',
                    dateWritten: 'validDate',
                    content: 'validContent',
                    likesCount: 0,
                    commentCount: 0,
                    userLiked: false
                }
            ];

            jest.spyOn(Post.prototype, 'getAllPost').mockResolvedValue(posts);

            const response = await request(app)
                                    .get(`/posts/forum/${forumId}`)
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(200);
            expect(Post.prototype.getAllPost).toHaveBeenCalledWith(forumId, "123");
            expect(response.body).toEqual(posts);
        });

        // Input: valid forumId with valid category query
        // Expected status code: 200 OK
        // Expected behavior: retrieve all posts in forum in the db with the category
        // Expected output: all posts in forum with the category
        test('valid forumId with valid category query', async () => {
            const forumId = 'validForumId';
            const category = 'positive';
            const posts = [
                {
                    postId: 'validPostId',
                    forumId: forumId,
                    writtenBy: 'validUserId',
                    userId: 'validUserId',
                    dateWritten: 'validDate',
                    content: 'validContent',
                    likesCount: 0,
                    commentCount: 0,
                    userLiked: false
                }
            ];

            jest.spyOn(Post.prototype, 'getFilteredPosts').mockResolvedValue(posts);

            const response = await request(app)
                                    .get(`/posts/forum/${forumId}?category=${category}`)
                                    .set('Authorization', 'Bearer 123');;

            expect(response.statusCode).toBe(200);
            expect(Post.prototype.getFilteredPosts).toHaveBeenCalledWith(forumId, category, "123");
            expect(response.body).toEqual(posts);
        });

        // Input: valid forumId with invalid category query
        // Expected status code: 200 OK
        // Expected behavior: retrieve all posts in forum in the db with the category
        // Expected output: all posts in forum with the category
        test('valid forumId with invalid category query', async () => {
            const forumId = 'validForumId';
            const category = 'invalidCategory';
            const posts = [
                {
                    postId: 'validPostId',
                    forumId: forumId,
                    writtenBy: 'validUserId',
                    userId: 'validUserId',
                    dateWritten: 'validDate',
                    content: 'validContent',
                    likesCount: 0,
                    commentCount: 0,
                    userLiked: false
                }
            ];

            jest.spyOn(Post.prototype, 'getFilteredPosts').mockResolvedValue(posts);

            const response = await request(app)
                                    .get(`/posts/forum/${forumId}?category=${category}`)
                                    .set('Authorization', 'Bearer 123');;

            expect(response.statusCode).toBe(400);
            expect(Post.prototype.getFilteredPosts).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: "invalid category"});
        });

        // Input: valid userId and does not pass forumId
        // Expected status code: 404
        // Expected behavior: nothing happens
        // Expected output: message saying "cannot GET /posts/forum/ (404)"
        test("when user id is valid and course id is missing", async () => {
            const response = await request(app)
                                    .get('/posts/forum/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(404);
            expect(Post.prototype.getFilteredPosts).not.toHaveBeenCalled();
            expect(response.error.message).toEqual('cannot GET /posts/forum/ (404)');
        });

        // Input: valid userId and valid forumId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('valid userId and valid forumId, but database throws error', async () => {
            const forumId = 'validForumId';

            jest.spyOn(Post.prototype, 'getAllPost').mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(app)
                                    .get(`/posts/forum/${forumId}`)
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(500);
            expect(Post.prototype.getAllPost).toHaveBeenCalledWith(forumId, "123");
            expect(response.body).toEqual({message: 'Database error'});
        });
    });

    // Interface GET /posts/post/:postId
    describe('GET /posts/post/:postId', () => {
        // Input: valid postId
        // Expected status code: 200 OK
        // Expected behavior: retrieve post in db
        // Expected output: post
        test('valid postId', async () => {
            const postId = 'validPostId';
            const post = {
                postId: postId,
                forumId: 'validForumId',
                writtenBy: 'validUserId',
                userId: 'validUserId',
                dateWritten: 'validDate',
                content: 'validContent',
                likesCount: 0,
                commentCount: 0,
                userLiked: false
            };

            jest.spyOn(Post.prototype, 'getPostById').mockResolvedValue(post);

            const response = await request(app)
                                    .get(`/posts/post/${postId}`)
                                    .set('Authorization', 'Bearer 123');;

            expect(response.statusCode).toBe(200);
            expect(Post.prototype.getPostById).toHaveBeenCalledWith("123", postId);
            expect(response.body).toEqual(post);
        });

        // Input: valid userId and does not pass postId
        // Expected status code: 404
        // Expected behavior: nothing happens
        // Expected output: message saying "cannot GET /posts/post/ (404)"
        test("when user id is valid and post id is missing", async () => {
            const response = await request(app)
                                    .get('/posts/post/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(404);
            expect(Post.prototype.getPostById).not.toHaveBeenCalled();
            expect(response.error.message).toEqual('cannot GET /posts/post/ (404)');
        });

        // Input: valid postId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('valid postId, but database throws error', async () => {
            const postId = 'validPostId';

            jest.spyOn(Post.prototype, 'getPostById').mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(app)
                                    .get(`/posts/post/${postId}`)
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(500);
            expect(Post.prototype.getPostById).toHaveBeenCalledWith("123", postId);
            expect(response.body).toEqual({message: 'Database error'});
        });
    });

    // Interface POST /posts/
    describe('POST /posts/', () => {
        // Input: valid content, userId, and forumId
        // Expected status code: 200
        // Expected behavior: add post to db
        // Expected output: post id
        test('valid content, userId, and forumId', async () => {
            const content = 'validContent';
            const forumId = 'validForumId';
            const postId = 'validPostId';

            jest.spyOn(Post.prototype, 'addPost').mockResolvedValue(postId);

            const response = await request(app)
                                    .post('/posts/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: content, forumId: forumId});

            expect(response.statusCode).toBe(200);
            expect(Post.prototype.addPost).toHaveBeenCalledWith(content, "123", forumId);
            expect(response.body).toEqual({postId: postId});
        });

        // Input: missing valid content
        // Expected status code: 400
        // Expected behavior: nothing happens
        // Expected output: message saying "Invalid request, missing required fields"
        test('valid userId, and forumId and missing valid content', async () => {
            const forumId = 'validForumId';

            const response = await request(app)
                                    .post('/posts/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({forumId: forumId});

            expect(response.statusCode).toBe(400);
            expect(Post.prototype.addPost).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: "Invalid request, missing required fields"});
        });

        // Input: missing valid forumId
        // Expected status code: 400
        // Expected behavior: nothing happens
        // Expected output: message saying "Invalid request, missing required fields"
        test('valid userId, and content and missing valid forumId', async () => {
            const content = 'validContent';

            const response = await request(app)
                                    .post('/posts/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: content});

            expect(response.statusCode).toBe(400);
            expect(Post.prototype.addPost).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: "Invalid request, missing required fields"});
        });

        // Input: valid userId, content and forumId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('valid userId, content and forumId, but database throws error', async () => {
            const content = 'validContent';
            const forumId = 'validForumId';

            jest.spyOn(Post.prototype, 'addPost').mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(app)
                                    .post('/posts/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: content, forumId: forumId});

            expect(response.statusCode).toBe(500);
            expect(Post.prototype.addPost).toHaveBeenCalledWith(content, "123", forumId);
            expect(response.body).toEqual({message: 'Database error'});
        });
    });

    // Interface DELETE /posts/:postId
    describe('DELETE /posts/:postId', () => {
        // Input: valid postId
        // Expected status code: 200
        // Expected behavior: delete post in db
        // Expected output: message saying "deleted post"
        test('valid postId', async () => {
            const postId = 'validPostId';

            jest.spyOn(Post.prototype, 'deletePost').mockResolvedValue(true);

            const response = await request(app)
                                    .delete(`/posts/${postId}`)
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(200);
            expect(Post.prototype.deletePost).toHaveBeenCalledWith(postId, "123");
            expect(response.body).toEqual({message: "deleted post"});
        });

        // Input: valid userId and but a postId that does not exist
        // Expected status code: 403
        // Expected behavior: nothing happens
        // Expected output: message saying "post does not exist"
        test('valid userId and but a postId that does not exist', async () => {
            const postId = 'notValidPostId';

            jest.spyOn(Post.prototype, 'deletePost').mockResolvedValue(false);

            const response = await request(app)
                                    .delete(`/posts/${postId}`)
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(403);
            expect(Post.prototype.deletePost).toHaveBeenCalledWith(postId, "123");
            expect(response.body).toEqual({message: "post does not exist"});
        });

        // Input: valid userId and does not pass postId
        // Expected status code: 404
        // Expected behavior: nothing happens
        // Expected output: message saying "cannot DELETE /posts/ (404)"
        test('valid userId and but a postId that does not exist', async () => {
            const response = await request(app)
                                    .delete(`/posts/`)
                                    .set('Authorization', 'Bearer 123');
            
            expect(response.status).toBe(404);
            expect(Post.prototype.deletePost).not.toHaveBeenCalled();
            expect(response.error.message).toEqual('cannot DELETE /posts/ (404)');
        });

        // Input: valid postId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('valid postId, but database throws error', async () => {
            const postId = 'validPostId';

            jest.spyOn(Post.prototype, 'deletePost').mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(app)
                                    .delete(`/posts/${postId}`)
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(500);
            expect(Post.prototype.deletePost).toHaveBeenCalledWith(postId, "123");
            expect(response.body).toEqual({message: 'Database error'});
        });
    });

    // Interface PUT /posts/:postId
    describe('PUT /posts/:postId', () => {
        // Input: valid content and postId
        // Expected status code: 200
        // Expected behavior: edit post in db
        // Expected output: message saying "post edited"
        test('valid content and postId', async () => {
            const content = 'validContent';
            const postId = 'validPostId';

            jest.spyOn(Post.prototype, 'editPost').mockResolvedValue(true);

            const response = await request(app)
                                    .put(`/posts/${postId}`)
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: content});

            expect(response.statusCode).toBe(200);
            expect(Post.prototype.editPost).toHaveBeenCalledWith(content, postId, "123");
            expect(response.body).toEqual({message: "post edited"});
        });

        // Input: missing valid content
        // Expected status code: 400
        // Expected behavior: nothing happens
        // Expected output: message saying "Invalid request, missing required fields"
        test('valid postId and missing valid content', async () => {
            const postId = 'validPostId';

            const response = await request(app)
                                    .put(`/posts/${postId}`)
                                    .set('Authorization', 'Bearer 123')
                                    .send({});

            expect(response.statusCode).toBe(400);
            expect(Post.prototype.editPost).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: "Invalid request, missing required fields"});
        });

        // Input: valid content but put a postId that does not exist
        // Expected status code: 403
        // Expected behavior: nothing happens
        // Expected output: message saying "post does not exist"
        test('valid content but put a postId that does not exist', async () => {
            const content = 'validContent';
            const postId = 'notValidPostId';

            jest.spyOn(Post.prototype, 'editPost').mockResolvedValue(false);

            const response = await request(app)
                                    .put(`/posts/${postId}`)
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: content});

            expect(response.statusCode).toBe(403);
            expect(Post.prototype.editPost).toHaveBeenCalledWith(content, postId, "123");
            expect(response.body).toEqual({message: "post does not exist"});
        });

        // Input: does not pass postId
        // Expected status code: 404
        // Expected behavior: nothing happens
        // Expected output: message saying "cannot PUT /posts/ (404)"
        test('does not pass postId', async () => {
            const response = await request(app)
                                    .put(`/posts/`)
                                    .set('Authorization', 'Bearer 123');
            
            expect(response.status).toBe(404);
            expect(Post.prototype.deletePost).not.toHaveBeenCalled();
            expect(response.error.message).toEqual('cannot PUT /posts/ (404)');
        });


        // Input: valid postId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('valid postId, but database throws error', async () => {
            const content = 'validContent';
            const postId = 'validPostId';

            jest.spyOn(Post.prototype, 'editPost').mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(app)
                                    .put(`/posts/${postId}`)
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: content});

            expect(response.statusCode).toBe(500);
            expect(Post.prototype.editPost).toHaveBeenCalledWith(content, postId, "123");
            expect(response.body).toEqual({message: 'Database error'});
        });
    });
});