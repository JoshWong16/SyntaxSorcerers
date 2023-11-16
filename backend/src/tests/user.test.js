import request  from 'supertest';
import app from '../app.js';
import Banned from '../models/Banned.js';
import User from '../models/User.js';

// Mock the models
jest.mock('../models/User.js');
jest.mock('../models/Banned.js');

describe('Testing All User Interfaces:', () => {

    beforeAll(() => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockReturnValue(false);
    });

    // Interface GET /users/
    describe('GET /users/', () => {
        // Input: exisitng userId
        // Expected status code: 200
        // Expected behavior: user info is retrieved
        // Expected output: user data
        test('when user exists', async () => {
            const data = { 
                userId: '123', 
                name: 'John Smith', 
                email: "test@gmail.com", 
                major: "LFS", 
                year_level: "3", 
                notification_token: "1234" 
            };
    
            // Mock the User instance methods
            jest.spyOn(User.prototype, 'getUser').mockReturnValue(data);
    
            const response = await request(app)
                                    .get('/users/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(200);
            expect(User.prototype.getUser).toHaveBeenCalledWith('123');
            expect(response.body).toEqual(data);
        });

        // Input: non exisiting userId
        // Expected status code: 200
        // Expected behavior: user info is null
        // Expected output: null
        test('when user does not exist', async () => {
            // Mock the User instance methods
            jest.spyOn(User.prototype, 'getUser').mockReturnValue(null);
    
            const response = await request(app)
                                    .get('/users/')
                                    .set('Authorization', 'Bearer 124');
                             
            expect(response.status).toBe(200);
            expect(User.prototype.getUser).toHaveBeenCalledWith('124');
            expect(response.body).toEqual(null);
        });

        // Input: invalid userId
        // Expected status code: 500
        // Expected behavior: throws error message
        // Expected output: error message
        test('when is it not a valid userId type', async () => {
            // Mock the User instance methods
            jest.spyOn(User.prototype, 'getUser').mockRejectedValue(new Error('Some error'));;
    
            const response = await request(app)
                                    .get('/users/')
                                    .set('Authorization', 'Bearer notvalid');
                             
            expect(response.status).toBe(500);
            expect(User.prototype.getUser).toHaveBeenCalledWith('notvalid');
            expect(response.body).toEqual({ message: 'Some error' });
        });
    });

    // Interface POST /users/
    describe('POST /users/', () => {});

    // Interface PUT /users/
    describe('PUT /users/', () => {});

    // Interface DELETE /users/
    describe('DELETE /users/', () => {});

    // Interface GET /users/favourite
    describe('GET /users/favourite', () => {});

    // Interface POST /users/favourite
    describe('POST /users/favourite', () => {});

    // Interface DELETE /users/favourite/:courseId
    describe('DELETE /users/favourite/:courseId', () => {});

    // Interface GET /users/courseKeywords
    describe('GET /users/courseKeywords', () => {});

    // Interface POST /users/recommendCourses
    describe('POST /users/recommendCourses', () => {});
  });