import request  from 'supertest';
import app from '../../app.js';
import Banned from '../../models/Banned.js';
import Forums from '../../models/Forums.js';
import UserForums from '../../models/UserForums.js';
import db from '../../db/db.js'; 
import { ObjectId } from 'mongodb';

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
 
    // Interface GET /forums/
    describe('GET /forums/', () => {
        // Input: valid userId
        // Expected status code: 200
        // Expected behavior: retrieve forum from db
        // Expected output: all forums
        test("when valid forumId and no search", async () => {
            const forums = [
                {
                    _id: new ObjectId("6348acd2e1a47ca32e79f46f"),
                    name: "CPEN 321 Forum",
                    createdBy: "123",
                    dateCreated: "2021-03-01T00:00:00.000Z",
                    course: "CPEN 321",
                },
                {
                    _id: new ObjectId("6348acd2e1a47ca32e79f46d"),
                    name: "CPEN 322 Forum",
                    createdBy: "125",
                    dateCreated: "2021-03-01T00:00:00.000Z",
                    course: "CPEN 322",
                },
            ];

            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockResolvedValue(forums),
            });

            jest.spyOn(Forums.prototype, 'getAllForums');

            const response = await request(app)
                                    .get('/forums/')
                                    .set('Authorization', 'Bearer 123');
                
            const forumsRes = [
                {
                    forumId: "6348acd2e1a47ca32e79f46f",
                    name: "CPEN 321 Forum",
                    createdBy: "123",
                    dateCreated: "2021-03-01T00:00:00.000Z",
                    course: "CPEN 321",
                },
                {
                    forumId: "6348acd2e1a47ca32e79f46d",
                    name: "CPEN 322 Forum",
                    createdBy: "125",
                    dateCreated: "2021-03-01T00:00:00.000Z",
                    course: "CPEN 322",
                },
            ];                        
            
            expect(response.status).toBe(200);
            expect(Forums.prototype.getAllForums).toHaveBeenCalled();
            expect(response.body).toEqual(forumsRes);
        });

        // Input: valid search query
        // Expected status code: 200
        // Expected behavior: retrieve forum from db
        // Expected output: all forums
        test("when valid forumId and search", async () => {
            const forums = [
                {
                    _id: new ObjectId("6348acd2e1a47ca32e79f46f"),
                    name: "CPEN 321 Forum",
                    createdBy: "123",
                    dateCreated: "2021-03-01T00:00:00.000Z",
                    course: "CPEN 321",
                },
            ];

            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockResolvedValue(forums),
            });

            jest.spyOn(Forums.prototype, 'searchForums');

            const response = await request(app)
                                    .get('/forums/?search=CPEN 321')
                                    .set('Authorization', 'Bearer 123');
                
            const forumsRes = [
                {
                    forumId: "6348acd2e1a47ca32e79f46f",
                    name: "CPEN 321 Forum",
                    createdBy: "123",
                    dateCreated: "2021-03-01T00:00:00.000Z",
                    course: "CPEN 321",
                },
            ];                       

            expect(response.status).toBe(200);
            expect(Forums.prototype.searchForums).toHaveBeenCalledWith("CPEN 321");
            expect(response.body).toEqual(forumsRes);
        });

        // Input: database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when database throws error', async () => {
            jest.spyOn(Forums.prototype, 'getAllForums').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .get('/forums/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(500);
            expect(Forums.prototype.getAllForums).toHaveBeenCalled();
            expect(response.body).toEqual({ message: "Database error" });
        });
    });

    // Interface POST /forums/
    describe('POST /forums/', () => {
        // Input: valid forum name, course, and userId
        // Expected status code: 200
        // Expected behavior: add forum to db
        // Expected output: forumId
        test("when valid forum name, course, and userId", async () => {
            const forumId = "6348acd2e1a47ca32e79f46f";

            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                insertOne: jest.fn().mockResolvedValue({insertedId: forumId}),
            });

            jest.spyOn(Forums.prototype, 'addForum');
            jest.spyOn(UserForums.prototype, 'addUserForum');

            const response = await request(app)
                                    .post('/forums/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({name: "CPEN 321 Forum", course: "CPEN 321"});
                             
            expect(response.status).toBe(200);
            expect(Forums.prototype.addForum).toHaveBeenCalledWith("CPEN 321 Forum", "123", "CPEN 321");
            expect(UserForums.prototype.addUserForum).toHaveBeenCalledWith("123", forumId);
            expect(response.body).toEqual({forumId});
        });

        // Input: missing forum name
        // Expected status code: 400
        // Expected behavior: return error message
        // Expected output: message saying "Invalid request, missing required fields"
        test('when missing forum name', async () => {
            jest.spyOn(Forums.prototype, 'addForum');

            const response = await request(app)
                                    .post('/forums/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({course: "CPEN 321"});
                             
            expect(response.status).toBe(400);
            expect(Forums.prototype.addForum).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: "Invalid request, missing required fields"});
        });

        // Input: missing course
        // Expected status code: 400
        // Expected behavior: return error message
        // Expected output: message saying "Invalid request, missing required fields"
        test('when missing course', async () => {
            jest.spyOn(Forums.prototype, 'addForum');

            const response = await request(app)
                                    .post('/forums/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({name: "CPEN 321 Forum"});
                             
            expect(response.status).toBe(400);
            expect(Forums.prototype.addForum).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: "Invalid request, missing required fields"});
        });

        // Input: database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when database throws error', async () => {
            jest.spyOn(Forums.prototype, 'addForum').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .post('/forums/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({name: "CPEN 321 Forum", course: "CPEN 321"});
                             
            expect(response.status).toBe(500);
            expect(Forums.prototype.addForum).toHaveBeenCalledWith("CPEN 321 Forum", "123", "CPEN 321");
            expect(response.body).toEqual({ message: "Database error" });
        });
    });

    // Interface DELETE /forums/:forumId
    describe('DELETE /forums/forum/:forumId', () => {
        // Input: valid forumId and userId
        // Expected status code: 200
        // Expected behavior: delete forum from db
        // Expected output: message saying "deleted forum"
        test("when valid forumId and userId", async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                deleteOne: jest.fn().mockResolvedValue({deletedCount: 1}),
            });

            jest.spyOn(Forums.prototype, 'deleteForum');

            const response = await request(app)
                                    .delete('/forums/forum/1')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(200);
            expect(Forums.prototype.deleteForum).toHaveBeenCalledWith("123", "1");
            expect(response.body).toEqual({message: "deleted forum"});
        });

        // Input: invalid forumId and valid userId
        // Expected status code: 403
        // Expected behavior: return error message
        // Expected output: message saying "not authorized to delete forum"
        test('when invalid forumId and valid userId', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                deleteOne: jest.fn().mockResolvedValue({deletedCount: 0}),
            });
            
            jest.spyOn(Forums.prototype, 'deleteForum');

            const response = await request(app)
                                    .delete('/forums/forum/1')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(403);
            expect(Forums.prototype.deleteForum).toHaveBeenCalledWith("123", "1");
            expect(response.body).toEqual({message: "not authorized to delete forum"});
        });

        // Input: does not pass in forumId
        // Expected status code: 404
        // Expected behavior: return error message
        // Expected output: message saying "cannot DELETE /forums/ (404)
        test('when does not pass in forumId', async () => {
            jest.spyOn(Forums.prototype, 'deleteForum');

            const response = await request(app)
                                    .delete('/forums/forum/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(404);
            expect(Forums.prototype.deleteForum).not.toHaveBeenCalled();
            expect(response.error.message).toEqual("cannot DELETE /forums/forum/ (404)");
        });

        // Input: database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when database throws error', async () => {
            jest.spyOn(Forums.prototype, 'deleteForum').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .delete('/forums/forum/1')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(500);
            expect(Forums.prototype.deleteForum).toHaveBeenCalledWith("123", "1");
            expect(response.body).toEqual({ message: "Database error" });
        });
    });

    // Interface GET /forums/user
    describe('GET /forums/user', () => {
        // Input: valid userId
        // Expected status code: 200
        // Expected behavior: retrieve forum from db that the user has joined
        // Expected output: all forums user has joined
        test("when valid userId", async () => {
            const forumId = ["6348acd2e1a47ca32e79f46f"];
            const forums = {
                _id: new ObjectId("6348acd2e1a47ca32e79f46f"),
                name: "CPEN 322 Forum",
                createdBy: "125",
                dateCreated: "2021-03-01T00:00:00.000Z",
                course: "CPEN 322",
            };

            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),    
                findOne: jest.fn().mockResolvedValue(forums),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockResolvedValue(forumId),
            });

            jest.spyOn(UserForums.prototype, 'getUsersForums');

            const response = await request(app)
                                    .get('/forums/user')
                                    .set('Authorization', 'Bearer 123');

            const forumsRes = [{
                forumId: "6348acd2e1a47ca32e79f46f",
                name: "CPEN 322 Forum",
                createdBy: "125",
                dateCreated: "2021-03-01T00:00:00.000Z",
                course: "CPEN 322",
            }];
                             
            expect(response.status).toBe(200);
            expect(UserForums.prototype.getUsersForums).toHaveBeenCalledWith("123");
            expect(response.body).toEqual(forumsRes);
        });

        // Input: database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when database throws error', async () => {
            jest.spyOn(UserForums.prototype, 'getUsersForums').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .get('/forums/user')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(500);
            expect(UserForums.prototype.getUsersForums).toHaveBeenCalledWith("123");
            expect(response.body).toEqual({ message: "Database error" });
        });
    });

    // Interface POST /forums/user
    describe('POST /forums/user', () => {
        // Input: valid forumId and userId
        // Expected status code: 200
        // Expected behavior: add forum to db that the user has joined
        // Expected output: message saying "added user to forum"
        test("when valid forumId and userId", async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                insertOne: jest.fn().mockResolvedValue(),
            });

            jest.spyOn(UserForums.prototype, 'addUserForum');

            const response = await request(app)
                                    .post('/forums/user')
                                    .set('Authorization', 'Bearer 123')
                                    .send({forumId: "1"});
                             
            expect(response.status).toBe(200);
            expect(UserForums.prototype.addUserForum).toHaveBeenCalledWith("123", "1");
            expect(response.body).toEqual({message: "added user to forum"});
        });

        // Input: missing forumId
        // Expected status code: 400
        // Expected behavior: return error message
        // Expected output: message saying "Invalid request, missing required forumId field"
        test('when missing forumId', async () => {
            jest.spyOn(UserForums.prototype, 'addUserForum');

            const response = await request(app)
                                    .post('/forums/user')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(400);
            expect(UserForums.prototype.addUserForum).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: "Invalid request, missing required forumId field"});
        });

        // Input: database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when database throws error', async () => {
            jest.spyOn(UserForums.prototype, 'addUserForum').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .post('/forums/user')
                                    .set('Authorization', 'Bearer 123')
                                    .send({forumId: "1"});
                             
            expect(response.status).toBe(500);
            expect(UserForums.prototype.addUserForum).toHaveBeenCalledWith("123", "1");
            expect(response.body).toEqual({ message: "Database error" });
        });
    });

    // Interface DELETE /forums/user/:forumId
    describe('DELETE /forums/user/:forumId', () => {
        // Input: valid forumId and userId
        // Expected status code: 200
        // Expected behavior: remove forum from db that the user has joined
        // Expected output: message saying "removed user from forum"
        test("when valid forumId and userId", async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                deleteOne: jest.fn().mockResolvedValue(),
            });

            jest.spyOn(UserForums.prototype, 'removeUserForum');

            const response = await request(app)
                                    .delete('/forums/user/1')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(200);
            expect(UserForums.prototype.removeUserForum).toHaveBeenCalledWith("123", "1");
            expect(response.body).toEqual({message: "removed user from forum"});
        });

        // Input: missing forumId
        // Expected status code: 404
        // Expected behavior: return error message
        // Expected output: message saying "cannot DELETE /forums/user/ (404)
        test('when missing forumId', async () => {
            jest.spyOn(UserForums.prototype, 'removeUserForum');

            const response = await request(app)
                                    .delete('/forums/user/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(404);
            expect(UserForums.prototype.removeUserForum).not.toHaveBeenCalled();
            expect(response.error.message).toEqual("cannot DELETE /forums/user/ (404)");
        });

        // Input: database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('when database throws error', async () => {
            jest.spyOn(UserForums.prototype, 'removeUserForum').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                                    .delete('/forums/user/1')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(500);
            expect(UserForums.prototype.removeUserForum).toHaveBeenCalledWith("123", "1");
            expect(response.body).toEqual({ message: "Database error" });
        });
    });
});