import request  from 'supertest';
import app from '../app.js';
import Banned from '../models/Banned.js';
import Reports from '../models/Reports.js';
import db from '../db/db.js';
import Comments from '../models/Comments.js';
import Posts from '../models/Posts.js';

// Mock the models
jest.mock('../models/Banned.js');
jest.mock('../db/db.js', () => ({
    database: {
        collection: jest.fn(),
    },
}));

describe('Testing All Reports Interfaces:', () => {
    beforeAll(() => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockReturnValue(false);
    });

    afterEach(() => {    
        jest.clearAllMocks();
    });

    // Interface GET /reports/all-users
    describe('GET /reports/all-users', () => {
        // Input: valid userId
        // Expected status code: 200
        // Expected behavior: retrieve all reported posts and comments from db
        // Expected output: reported posts and comments
        test('Valid userId', async () => {
            const user = {
                        userId: '123',
                        name: 'test',
                        email: 'test@gmail.com'
                    };
                    
            const reports = [
                {
                    userId: '123',
                },
                {
                    userId: '456',
                },
                {
                    userId: '456',
                }
            ]

            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
                findOne: jest.fn().mockResolvedValue(user),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockResolvedValue(reports),
            });

            jest.spyOn(Reports.prototype, 'getAllReports');
    
            const response = await request(app)
                                    .get('/reports/all-users')
                                    .set('Authorization', 'Bearer 123');

            const returnData = {
                "123": {
                    "reportCount": 1,
                    "userInfo": {
                        "email": "test@gmail.com",
                        "name": "test",
                        "userId": "123",
                    },
                },
                "456": {
                    "reportCount": 2,
                    "userInfo": {
                        "email": "test@gmail.com",
                        "name": "test",
                        "userId": "123",
                    },
                },
            };
            
            expect(response.statusCode).toBe(200);
            expect(Reports.prototype.getAllReports).toHaveBeenCalledTimes(1);
            expect(response.body).toEqual(returnData);
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
                toArray: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            jest.spyOn(Reports.prototype, 'getAllReports');
    
            const response = await request(app)
                                    .get('/reports/all-users')
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(500);
            expect(Reports.prototype.getAllReports).toHaveBeenCalledTimes(1);
            expect(response.body).toEqual({message: 'Database error'});
        });
    });

    // Interface GET /reports/user/:userId
    describe('GET /reports/user/:userId', () => {
        // Input: valid userId for the report retrieval
        // Expected status code: 200
        // Expected behavior: retrieve all reports for the user from db
        // Expected output: reports for the user
        test('Valid userId', async () => {
            const data = [
                {
                    commentId: '123',
                    postId: '123',
                    content: 'test',
                    writtenBy: 'John Smith',
                    userId: '123',
                    dateWritten: '2021-04-01T00:00:00.000Z'
                },
                {
                    postId: '456',
                    forumId: '456',
                    writtenBy: 'John Smith',
                    userId: '123',
                    dateWritten: '2021-04-01T00:00:00.000Z',
                    content: 'test',
                    likesCount: 1,
                    commentCount: 1,
                    userLiked: false
                }
            ];

            const usersReports = [
                {
                    commentId: '123',
                    userId: '123',
                },
                {
                    userId: '123',
                    postId: '456'
                }
            ]

            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockResolvedValue(usersReports),
            });

            jest.spyOn(Reports.prototype, 'getUserReports')
            jest.spyOn(Comments.prototype, 'getCommentById').mockResolvedValue(data[0]);
            jest.spyOn(Posts.prototype, 'getPostById').mockResolvedValue(data[1]);
    
            const response = await request(app)
                                    .get('/reports/user/123')
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(200);
            expect(Reports.prototype.getUserReports).toHaveBeenCalledWith("123");
            expect(response.body).toEqual(data);
        });

        // Input: valid userId for the report retrieval, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('Valid userId for the report retrieval, but database throws error', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            const findSpy = spy.mockReturnValue({
                find: jest.fn(),
            });
            findSpy().find.mockReturnValue({
                toArray: jest.fn().mockRejectedValue(new Error('Database error')),
            });
            
            jest.spyOn(Reports.prototype, 'getUserReports');
    
            const response = await request(app)
                                    .get('/reports/user/123')
                                    .set('Authorization', 'Bearer 123');

            expect(response.statusCode).toBe(500);
            expect(Reports.prototype.getUserReports).toHaveBeenCalledWith("123");
            expect(response.body).toEqual({message: 'Database error'});
        });
    });

    // Interface POST /reports/
    describe('POST /reports/', () => {
        // Input: valid userId and reporting a comment
        // Expected status code: 200
        // Expected behavior: add reported comment to db
        // Expected output: reported comment id
        test('Valid userId and reporting a comment', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                insertOne: jest.fn().mockResolvedValue({insertedId: '123'}),
            });
            
            jest.spyOn(Reports.prototype, 'addReport');

            const response = await request(app)
                                    .post('/reports/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({
                                        userId: '123',
                                        commentId: '123',
                                    });

            expect(response.statusCode).toBe(200);
            expect(Reports.prototype.addReport).toHaveBeenCalledWith("123", "123", null);
            expect(response.body).toEqual({reportId: '123'});
        });

        // Input: valid userId and reporting a post
        // Expected status code: 200
        // Expected behavior: add reported post to db
        // Expected output: reported post id
        test('Valid userId and reporting a post', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                insertOne: jest.fn().mockResolvedValue({insertedId: '123'}),
            });
            
            jest.spyOn(Reports.prototype, 'addReport');
    
            const response = await request(app)
                                    .post('/reports/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({
                                        userId: '123',
                                        postId: '123',
                                    });

            expect(response.statusCode).toBe(200);
            expect(Reports.prototype.addReport).toHaveBeenCalledWith("123", null, "123");
            expect(response.body).toEqual({reportId: '123'});
        });

        // Input: missing valid userId and reporting a comment
        // Expected status code: 400
        // Expected behavior: return error message
        // Expected output: error message
        test('Missing valid userId and reporting a comment', async () => {
            jest.spyOn(Reports.prototype, 'addReport');
    
            const response = await request(app)
                                    .post('/reports/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({
                                        commentId: '123',
                                    });

            expect(response.statusCode).toBe(400);
            expect(Reports.prototype.addReport).toHaveBeenCalledTimes(0);
            expect(response.body).toEqual({message: 'Invalid request, missing required fields'});
        });


        // Input: valid userId and missing commentId and postId
        // Expected status code: 400
        // Expected behavior: return error message
        // Expected output: error message
        test('Valid userId and missing commentId and postId', async () => {
            jest.spyOn(Reports.prototype, 'addReport');
    
            const response = await request(app)
                                    .post('/reports/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({
                                        userId: '123',
                                    });

            expect(response.statusCode).toBe(400);
            expect(Reports.prototype.addReport).toHaveBeenCalledTimes(0);
            expect(response.body).toEqual({message: 'Invalid request, missing required fields'});
        });

        // Input: valid userId and reporting a comment, but database throws error
        // Expected status code: 500
        // Expected behavior: return error message
        // Expected output: error message
        test('Valid userId and reporting a comment, but database throws error', async () => {
            const spy = jest.spyOn(db.database, 'collection');
            spy.mockReturnValue({
                insertOne: jest.fn().mockRejectedValue(new Error('Database error')),
            });
            
            jest.spyOn(Reports.prototype, 'addReport');
    
            const response = await request(app)
                                    .post('/reports/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({
                                        userId: '123',
                                        commentId: '123',
                                    });

            expect(response.statusCode).toBe(500);
            expect(Reports.prototype.addReport).toHaveBeenCalledWith("123", "123", null);
            expect(response.body).toEqual({message: 'Database error'});
        });
    });
});