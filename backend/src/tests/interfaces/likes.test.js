import request  from 'supertest';
import app from '../../app.js';
import Banned from '../../models/Banned.js';
import Likes from '../../models/Likes.js';
import db from '../../db/db.js'; 

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

    // Interface GET /likes/:postId
    describe('GET /likes/:postId', () => {
        // Input: valid postId
        // Expected status code: 200
        // Expected behavior: retrieve all likes from db
        // Expected output: likes
        test('when valid postId', async () => {
            const likes = [
                {postId: '123', userId: '456'},
                {postId: '123', userId: '789'}
            ]

            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockResolvedValue(likes),
            });

            jest.spyOn(Likes.prototype, 'getAllLikes');

            const response = await request(app)
                                    .get('/likes/123')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(200);
            expect(Likes.prototype.getAllLikes).toHaveBeenCalledWith("123");
            expect(response.body).toEqual(likes);
        });

        // Input: does not pass in a postId
        // Expected status code: 404
        // Expected behavior: return error message
        // Expected output: message saying "cannot GET /likes/ (404)"
        test("when no postId", async () => {
            const response = await request(app)
                                    .get('/likes/')
                                    .set('Authorization', 'Bearer 123');
                 
            jest.spyOn(Likes.prototype, 'getAllLikes');                        
            
            expect(response.status).toBe(404);
            expect(Likes.prototype.getAllLikes).not.toHaveBeenCalled();
            expect(response.error.message).toEqual("cannot GET /likes/ (404)");
        });

        // Input: valid postId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when valid postId, but database throws error', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            jest.spyOn(Likes.prototype, 'getAllLikes')

            const response = await request(app)
                                    .get('/likes/123')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(500);
            expect(Likes.prototype.getAllLikes).toHaveBeenCalledWith("123");
            expect(response.body).toEqual({ message: "Database error" });
        });
    });

    // Interface POST /likes/
    describe('POST /likes/', () => {
        // Input: valid postId and userId
        // Expected status code: 200
        // Expected behavior: add like to db
        // Expected output: like id
        test('when valid postId and userId', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                insertOne: jest.fn().mockResolvedValue({ insertedId: '123' }),
            });

            jest.spyOn(Likes.prototype, 'addLike');
            
            const response = await request(app)
                                    .post('/likes/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({
                                        post_id: '123',
                                    });

            expect(response.statusCode).toBe(200);
            expect(Likes.prototype.addLike).toHaveBeenCalledWith("123", "123");
            expect(response.body).toEqual('123');
        });

        // Input: does not pass in a postId
        // Expected status code: 400
        // Expected behavior: return error message
        // Expected output: message saying "Invalid request, missing required fields"
        test('when no postId', async () => {
            jest.spyOn(Likes.prototype, 'addLike');

            const response = await request(app)
                                    .post('/likes/')
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(400);
            expect(Likes.prototype.addLike).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: "Invalid request, missing required fields"});
        });

        // Input: valid postId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when valid postId, but database throws error', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                insertOne: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            jest.spyOn(Likes.prototype, 'addLike').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .post('/likes/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({
                                        post_id: '123',
                                    });

            expect(response.statusCode).toBe(500);
            expect(Likes.prototype.addLike).toHaveBeenCalledWith("123", "123");
            expect(response.body).toEqual({ message: "Database error" });
        });
    });

    // Interface DELETE /likes/:postId
    describe('DELETE /likes/:postId', () => {
        // Input: valid postId and userId
        // Expected status code: 200
        // Expected behavior: remove like from db
        // Expected output: message saying "like removed"
        test('when valid postId and userId', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
            });

            jest.spyOn(Likes.prototype, 'removeLike');

            const response = await request(app)
                                    .delete('/likes/123')
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(200);
            expect(Likes.prototype.removeLike).toHaveBeenCalledWith("123", "123");
            expect(response.body).toEqual({message: "like removed"});
        });

        // Input: postId does not have any likes
        // Expected status code: 403
        // Expected behavior: return error message
        // Expected output: message saying "have not liked the message"
        test('when postId does not have any likes', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                deleteOne: jest.fn().mockResolvedValue({ deletedCount: 0 }),
            });

            jest.spyOn(Likes.prototype, 'removeLike');

            const response = await request(app)
                                    .delete('/likes/123')
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(403);
            expect(Likes.prototype.removeLike).toHaveBeenCalledWith("123", "123");
            expect(response.body).toEqual({message: "have not liked the message"});
        });

        // Input: does not pass in a postId
        // Expected status code: 404
        // Expected behavior: return error message
        // Expected output: message saying "cannot DELETE /likes/ (404)"
        test('when no postId', async () => {
            jest.spyOn(Likes.prototype, 'removeLike');

            const response = await request(app)
                                    .delete('/likes/')
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(404);
            expect(Likes.prototype.removeLike).not.toHaveBeenCalled();
            expect(response.error.message).toEqual("cannot DELETE /likes/ (404)");
        });

        // Input: valid postId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when valid postId, but database throws error', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                deleteOne: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            jest.spyOn(Likes.prototype, 'removeLike');

            const response = await request(app)
                                    .delete('/likes/123')
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(500);
            expect(Likes.prototype.removeLike).toHaveBeenCalledWith("123", "123");
            expect(response.body).toEqual({ message: "Database error" });
        });
    });
});