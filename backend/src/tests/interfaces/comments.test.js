import request  from 'supertest';
import app from '../../app.js';
import Banned from '../../models/Banned.js';
import Comments from '../../models/Comments.js';
import User from '../../models/User.js';
import Posts from '../../models/Posts.js';
import db from '../../db/db.js'; 

import pkg from '../../controllers/firebase-config.cjs';
import { ObjectId } from 'mongodb';
const { admin } = pkg;

// Mock the models
jest.mock('../../models/Banned.js');
jest.mock('../../db/db.js', () => ({
    database: {
        collection: jest.fn(),
    },
}));

describe('Testing All Posts Interfaces:', () => {
    beforeAll(() => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockReturnValue(false);
    });

    afterEach(() => {    
        jest.clearAllMocks();
    });
 
    // Interface GET /comments/:postId
    describe('GET /comments/:postId', () => {
        // Input: valid postId
        // Expected status code: 200
        // Expected behavior: retrieve all comments from db
        // Expected output: comments
        test('when valid postId', async () => {
            const comments = [
                {_id: new ObjectId("6348acd2e1a47ca32e79f46f"), postId: '456', userId: '789', content: 'test', writtenBy: 'John Smith', dateWritten: '2021-04-20T00:00:00.000Z'},
                {_id: new ObjectId("6348acd2e1a47ca32e79f46f"), postId: '456', userId: '012', content: 'test2', writtenBy: 'John Smith', dateWritten: '2021-04-20T00:00:00.000Z'}
            ]

            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockResolvedValue(comments),
            });

            jest.spyOn(Comments.prototype, 'getAllComments');
            jest.spyOn(User.prototype, 'getUser').mockResolvedValue({name: 'John Smith'});

            const response = await request(app)
                                    .get('/comments/123')
                                    .set('Authorization', 'Bearer 123');
                
            const commentsRes = [
                {commentId: "6348acd2e1a47ca32e79f46f", postId: '456', userId: 'John Smith', content: 'test', writtenBy: 'John Smith', dateWritten: '2021-04-20T00:00:00.000Z'},
                {commentId: "6348acd2e1a47ca32e79f46f", postId: '456', userId: 'John Smith', content: 'test2', writtenBy: 'John Smith', dateWritten: '2021-04-20T00:00:00.000Z'}
            ];              
        
            expect(response.status).toBe(200);
            expect(Comments.prototype.getAllComments).toHaveBeenCalledWith("123");
            expect(response.body).toEqual(commentsRes);
        });

        // Input: does not pass in a postId
        // Expected status code: 404
        // Expected behavior: return error message
        // Expected output: message saying "cannot GET /comments/ (404)"
        test('when no postId', async () => {
            const response = await request(app)
                                    .get('/comments/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(404);
            expect(Comments.prototype.getAllComments).not.toHaveBeenCalled();
            expect(response.error.message).toEqual("cannot GET /comments/ (404)");
        });

        // Input: valid postId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when valid postId, but database throws error', async () => {
            jest.spyOn(Comments.prototype, 'getAllComments').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .get('/comments/123')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(500);
            expect(Comments.prototype.getAllComments).toHaveBeenCalledWith("123");
            expect(response.error.text).toEqual('{"message":"Database error"}');
        });
    });

    // Interface GET /comments/comment/:commentId
    describe('GET /comments/comment/:commentId', () => {
        // Input: valid commentId
        // Expected status code: 200
        // Expected behavior: retrieve comment from db
        // Expected output: comment
        test('when valid commentId', async () => {
            const comments = [{_id: new ObjectId('6348acd2e1a47ca32e79f46f'), postId: '456', userId: '789', content: 'test', writtenBy: '012', dateWritten: '2021-04-20T00:00:00.000Z'}];

            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockResolvedValue(comments),
            });

            jest.spyOn(Comments.prototype, 'getCommentById');
            jest.spyOn(User.prototype, 'getUser').mockResolvedValue({name: 'John Smith'});

            const response = await request(app)
                                    .get('/comments/comment/6348acd2e1a47ca32e79f46f')
                                    .set('Authorization', 'Bearer 123');
                             
            const commentRes = {commentId: '6348acd2e1a47ca32e79f46f', postId: '456', userId: '012', content: 'test', writtenBy: 'John Smith', dateWritten: '2021-04-20T00:00:00.000Z'}

            expect(response.status).toBe(200);
            expect(Comments.prototype.getCommentById).toHaveBeenCalledWith("6348acd2e1a47ca32e79f46f");
            expect(response.body).toEqual(commentRes);
        });

        // Input: valid commentId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when valid commentId, but database throws error', async () => {
            jest.spyOn(Comments.prototype, 'getCommentById').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .get('/comments/comment/123')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(500);
            expect(Comments.prototype.getCommentById).toHaveBeenCalledWith("123");
            expect(response.error.text).toEqual('{"message":"Database error"}');
        });
    });

    // Interface POST /comments/
    describe('POST /comments/', () => {
        describe('when valid content, postId, and userId with the notification token is not null', () => {
            // Input: valid content, postId, and userId and notification token is not null
            // Expected status code: 200
            // Expected behavior: add comment to db
            // Expected output: commentId
            test("and sendToDevice works", async () => {
                const commentId = '123';

                const spy = jest.spyOn(db.database, 'collection');
                spy.mockReturnValue({
                    insertOne: jest.fn().mockResolvedValue({insertedId: commentId}),
                });
    
                jest.spyOn(Comments.prototype, 'addComment');
                jest.spyOn(Posts.prototype, 'getPostById').mockResolvedValue({userId: '123'});
                jest.spyOn(User.prototype, 'getUser').mockResolvedValue({name: 'John Smith', notification_token: '123'});
                jest.spyOn(admin.messaging(), 'sendToDevice').mockResolvedValue({ commentId});
                
                const response = await request(app)
                                        .post('/comments/')
                                        .set('Authorization', 'Bearer 123')
                                        .send({content: 'test', postId: '123'});
                                 
                expect(response.status).toBe(200);
                expect(Comments.prototype.addComment).toHaveBeenCalledWith("test", "123", "123");
                expect(response.body).toEqual({commentId});
            });

            // Input: valid content, postId, and userId and notification token is not null
            // Expected status code: 500
            // Expected behavior: add comment to db
            // Expected output: error message
            test("and sendToDevice does not work", async () => {
                const commentId = '123';

                const spy = jest.spyOn(db.database, 'collection');
                spy.mockReturnValue({
                    insertOne: jest.fn().mockResolvedValue({insertedId: commentId}),
                });
    
                jest.spyOn(Comments.prototype, 'addComment');
                jest.spyOn(Posts.prototype, 'getPostById').mockResolvedValue({userId: '123'});
                jest.spyOn(User.prototype, 'getUser').mockResolvedValue({name: 'John Smith', notification_token: '123'});
                jest.spyOn(admin.messaging(), 'sendToDevice').mockRejectedValue(new Error('Notification error'));
                
                const response = await request(app)
                                        .post('/comments/')
                                        .set('Authorization', 'Bearer 123')
                                        .send({content: 'test', postId: '123'});
                                 
                expect(response.status).toBe(200);
                expect(Comments.prototype.addComment).toHaveBeenCalledWith("test", "123", "123");
                expect(response.body).toEqual({commentId, message: 'notification failed'});
            });
        });

        // Input: valid content, postId, and userId and notification token is null
        // Expected status code: 200
        // Expected behavior: add comment to db
        // Expected output: commentId
        test('when valid content, postId, and userId and notification token is null', async () => {
            const commentId = '123';

            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                insertOne: jest.fn().mockResolvedValue({insertedId: commentId}),
            });

            jest.spyOn(Comments.prototype, 'addComment');
            jest.spyOn(Posts.prototype, 'getPostById').mockResolvedValue({userId: '123'});
            jest.spyOn(User.prototype, 'getUser').mockResolvedValue({name: 'John Smith', notification_token: null});
            
            const response = await request(app)
                                    .post('/comments/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: 'test', postId: '123'});
                             
            expect(response.status).toBe(200);
            expect(Comments.prototype.addComment).toHaveBeenCalledWith("test", "123", "123");
            expect(response.body).toEqual({commentId});
        });

        // Input: missing valid content
        // Expected status code: 400
        // Expected behavior: return error message
        // Expected output: error message
        test('when missing valid content', async () => {
            jest.spyOn(Comments.prototype, 'addComment');

            const response = await request(app)
                                    .post('/comments/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({postId: '123'});
                             
            expect(response.status).toBe(400);
            expect(Comments.prototype.addComment).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: "Invalid request, missing required fields"});
        });

        // Input: missing valid postId
        // Expected status code: 400
        // Expected behavior: return error message
        // Expected output: error message
        test('when missing valid postId', async () => {
            jest.spyOn(Comments.prototype, 'addComment');

            const response = await request(app)
                                    .post('/comments/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: 'test'});
                             
            expect(response.status).toBe(400);
            expect(Comments.prototype.addComment).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: "Invalid request, missing required fields"});
        });

        // Input: database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when database throws error', async () => {
            jest.spyOn(Comments.prototype, 'addComment').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .post('/comments/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: 'test', postId: '123'});
                             
            expect(response.status).toBe(500);
            expect(Comments.prototype.addComment).toHaveBeenCalledWith("test", "123", "123");
            expect(response.error.text).toEqual('{"message":"Database error"}');
        });
    });
    
    // Interface PUT /comments/:commentId
    describe('PUT /comments/:commentId', () => {
        // Input: valid content and commentId
        // Expected status code: 200
        // Expected behavior: edit comment in db
        // Expected output: message saying "comment edited"
        test('when valid content and commentId', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                updateOne: jest.fn().mockResolvedValue({matchedCount: 1}),
            });

            jest.spyOn(Comments.prototype, 'editComment');

            const response = await request(app)
                                    .put('/comments/6348acd2e1a47ca32e79f46f')
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: 'test'});
                             
            expect(response.status).toBe(200);
            expect(Comments.prototype.editComment).toHaveBeenCalledWith("test", "6348acd2e1a47ca32e79f46f", "123");
            expect(response.body).toEqual({message: "comment edited"});
        });

        // Input: valid content and commentId, but not authorized to edit comment
        // Expected status code: 403
        // Expected behavior: return error message
        // Expected output: message saying "not authorized to edit comment"
        test('when valid content and commentId, but not authorized to edit comment', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                updateOne: jest.fn().mockResolvedValue({matchedCount: 0}),
            });

            jest.spyOn(Comments.prototype, 'editComment');

            const response = await request(app)
                                    .put('/comments/6348acd2e1a47ca32e79f46f')
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: 'test'});
                             
            expect(response.status).toBe(403);
            expect(Comments.prototype.editComment).toHaveBeenCalledWith("test", "6348acd2e1a47ca32e79f46f", "123");
            expect(response.body).toEqual({message: "not authorized to edit comment"});
        });

        // Input: missing valid content
        // Expected status code: 400
        // Expected behavior: return error message
        // Expected output: error message saying "Invalid request, missing required content field"
        test('when missing valid content', async () => {
            jest.spyOn(Comments.prototype, 'editComment');

            const response = await request(app)
                                    .put('/comments/123')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(400);
            expect(Comments.prototype.editComment).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: "Invalid request, missing required content field"});
        });
        
        // Input: missing valid commentId
        // Expected status code: 404
        // Expected behavior: return error message
        // Expected output: message saying "cannot PUT /comments/ (404)"
        test('when missing valid commentId', async () => {
            jest.spyOn(Comments.prototype, 'editComment');
    
            const response = await request(app)
                                    .put('/comments/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(404);
            expect(Comments.prototype.editComment).not.toHaveBeenCalled();
            expect(response.error.message).toEqual("cannot PUT /comments/ (404)");
        });

        // Input: database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when database throws error', async () => {
            jest.spyOn(Comments.prototype, 'editComment').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .put('/comments/123')
                                    .set('Authorization', 'Bearer 123')
                                    .send({content: 'test'});
                             
            expect(response.status).toBe(500);
            expect(Comments.prototype.editComment).toHaveBeenCalledWith("test", "123", "123");
            expect(response.error.text).toEqual('{"message":"Database error"}');
        });
    });

    // Interface DELETE /comments/:commentId
    describe('DELETE /comments/:commentId', () => {
        // Input: valid commentId
        // Expected status code: 200
        // Expected behavior: delete comment from db
        // Expected output: message saying "comment deleted"
        test('when valid commentId', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                deleteOne: jest.fn().mockResolvedValue({deletedCount: 1}),
            });

            jest.spyOn(Comments.prototype, 'deleteComment');

            const response = await request(app)
                                    .delete('/comments/6348acd2e1a47ca32e79f46f')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(200);
            expect(Comments.prototype.deleteComment).toHaveBeenCalledWith("6348acd2e1a47ca32e79f46f", "123");
            expect(response.body).toEqual({message: "comment deleted"});
        });

        // Input: valid commentId, but not authorized to delete comment
        // Expected status code: 403
        // Expected behavior: return error message
        // Expected output: message saying "not authorized to delete comment"
        test('when valid commentId, but not authorized to delete comment', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                deleteOne: jest.fn().mockResolvedValue({deletedCount: 0}),
            });

            jest.spyOn(Comments.prototype, 'deleteComment').mockResolvedValue(false);

            const response = await request(app)
                                    .delete('/comments/123')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(403);
            expect(Comments.prototype.deleteComment).toHaveBeenCalledWith("123", "123");
            expect(response.body).toEqual({message: "not authorized to delete comment"});
        });

        // Input: missing valid commentId
        // Expected status code: 404
        // Expected behavior: return error message
        // Expected output: message saying "cannot DELETE /comments/ (404)"
        test('when missing valid commentId', async () => {
            jest.spyOn(Comments.prototype, 'deleteComment');

            const response = await request(app)
                                    .delete('/comments/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(404);
            expect(Comments.prototype.deleteComment).not.toHaveBeenCalled();
            expect(response.error.message).toEqual("cannot DELETE /comments/ (404)");
        });

        // Input: database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when database throws error', async () => {
            jest.spyOn(Comments.prototype, 'deleteComment').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .delete('/comments/123')
                                    .set('Authorization', 'Bearer 123');
            
            expect(response.status).toBe(500);
            expect(Comments.prototype.deleteComment).toHaveBeenCalledWith("123", "123");
            expect(response.error.text).toEqual('{"message":"Database error"}');
        });
    });
});