import request  from 'supertest';
import app from '../../app.js';
import Banned from '../../models/Banned.js';
import User from '../../models/User.js'
import db from '../../db/db.js';

// Mock the models
jest.mock('../../db/db.js', () => ({
    database: {
        collection: jest.fn(),
    },
}));

describe('Testing All Posts Interfaces:', () => {
    afterEach(() => {    
        jest.clearAllMocks();
    });
 
    // Interface GET /banned/all-users
    describe('GET /banned/all-users', () => {
        // Input: valid userId
        // Expected status code: 200
        // Expected behavior: retrieve all banned users from db
        // Expected output: banned users
        test('Valid userId', async () => {
            const userIds = ['123'];
            const users = [
                {userId: '123', name: 'test', email: 'test@gmail.com'},
            ];

            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockResolvedValue(userIds),
            });

            jest.spyOn(Banned.prototype, 'getAllBannedUsers');
            const getBannedUserSpy = jest.spyOn(Banned.prototype, 'getBannedUser').mockResolvedValue(false);
            jest.spyOn(User.prototype, 'getUser').mockResolvedValue(users[0]);

            const response = await request(app)
                                    .get('/banned/all-users')
                                    .set('Authorization', 'Bearer 123');
            
            expect(response.status).toBe(200);
            expect(Banned.prototype.getAllBannedUsers).toHaveBeenCalledTimes(1);
            expect(response.body).toEqual(users);

            getBannedUserSpy.mockRestore();
        });

        // Input: valid userId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('Valid userId, but database throws error', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockRejectedValue(new Error('test error')),
            });
            jest.spyOn(Banned.prototype, 'getAllBannedUsers');
            const getBannedUserSpy = jest.spyOn(Banned.prototype, 'getBannedUser').mockResolvedValue(false);

            const response = await request(app)
                                    .get('/banned/all-users')
                                    .set('Authorization', 'Bearer 123');
            
            expect(response.status).toBe(500);
            expect(Banned.prototype.getAllBannedUsers).toHaveBeenCalledTimes(1);
            expect(response.body.message).toEqual('test error');
        
            getBannedUserSpy.mockRestore();
        });
    });

    // Interface GET /banned/user/:userId
    describe('GET /banned/user/:userId', () => {
        // Input: valid userId
        // Expected status code: 200
        // Expected behavior: retrieve banned user from db
        // Expected output: message saying "User is banned"
        test('when userId is banned', async () => {
            const collectionSpy = jest.spyOn(db.database, 'collection');
            const findSpy = collectionSpy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockImplementation((input) => {
                if (input.userId === "123") {
                    return {
                        toArray: jest.fn().mockResolvedValue([]),
                    };
                } else {
                    return {
                        toArray: jest.fn().mockResolvedValue([{userId: "234"}]),
                    };
                }
            });

            jest.spyOn(Banned.prototype, 'getBannedUser');
            
            const response = await request(app)
                                    .get('/banned/user/234')
                                    .set('Authorization', 'Bearer 123');
            
            expect(response.status).toBe(200);
            expect(Banned.prototype.getBannedUser).toHaveBeenCalledWith("234");
            expect(response.body).toEqual({message: "User is banned"});
        });

        // Input: userId is not banned
        // Expected status code: 200
        // Expected behavior: retrieve banned user from db
        // Expected output: message saying "User is not banned"
        test("when userId is not banned", async () => {
            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockResolvedValue([]),
            });

            jest.spyOn(Banned.prototype, 'getBannedUser');

            const response = await request(app)
                                    .get('/banned/user/234')
                                    .set('Authorization', 'Bearer 123');
            
            expect(response.status).toBe(200);
            expect(Banned.prototype.getBannedUser).toHaveBeenCalledWith("234");
            expect(response.body).toEqual({message: "User is not banned"});
        });

        // Input: does not pass in a userId
        // Expected status code: 404
        // Expected behavior: return error message
        // Expected output: message saying "cannot GET /banned/user/ (404)"
        test("when userId is not passed in", async () => {
            jest.spyOn(Banned.prototype, 'getBannedUser').mockResolvedValue(false);

            const response = await request(app)
                                    .get('/banned/user/')
                                    .set('Authorization', 'Bearer 123');
            
            expect(response.status).toBe(404);
            expect(Banned.prototype.getBannedUser).toHaveBeenCalledTimes(1);
            expect(response.error.message).toEqual("cannot GET /banned/user/ (404)");
        });

        // Input: valid userId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when valid userId, but database throws error', async () => {
            const spy = jest.spyOn(Banned.prototype, 'getBannedUser');

            spy.mockImplementation((input) => {
                if (input === "123") {
                    return Promise.resolve(false);
                } else {
                    return Promise.reject(new Error('test error'));
                }
            });
            const response = await request(app)
                                    .get('/banned/user/124')
                                    .set('Authorization', 'Bearer 123');
            
            expect(response.status).toBe(500);
            expect(Banned.prototype.getBannedUser).toHaveBeenCalledWith("123");
            expect(response.body.message).toEqual('test error');
        });
    });

    // Interface POST /banned/
    describe('POST /banned/', () => {
        // Input: valid userId
        // Expected status code: 200
        // Expected behavior: add banned user to db
        // Expected output: bannedId
        test('Valid userId', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                insertOne: jest.fn().mockResolvedValue({insertedId: '123'}),
            });

            jest.spyOn(Banned.prototype, 'addBannedUser');
            
            const response = await request(app)
                                    .post('/banned/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({
                                        userId: '123'
                                    });
            
            expect(response.status).toBe(200);
            expect(Banned.prototype.addBannedUser).toHaveBeenCalledWith("123");
            expect(response.body).toEqual('123');
        });

        // Input: does not pass in a userId
        // Expected status code: 400
        // Expected behavior: return error message
        // Expected output: message saying "Invalid request, missing required userId fields"
        test("when userId is not passed in", async () => {
            jest.spyOn(Banned.prototype, 'addBannedUser');
            
            const response = await request(app)
                                    .post('/banned/')
                                    .set('Authorization', 'Bearer 123');
            
            expect(response.status).toBe(400);
            expect(Banned.prototype.addBannedUser).not.toHaveBeenCalled();
            expect(response.body.message).toEqual("Invalid request, missing required userId fields");
        });

        // Input: valid userId, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when valid userId, but database throws error', async () => {
            jest.spyOn(Banned.prototype, 'addBannedUser').mockRejectedValue(new Error('test error'));
            
            const response = await request(app)
                                    .post('/banned/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({
                                        userId: '123'
                                    });
            
            expect(response.status).toBe(500);
            expect(Banned.prototype.addBannedUser).toHaveBeenCalledWith("123");
            expect(response.body.message).toEqual('test error');
        });
    });
});