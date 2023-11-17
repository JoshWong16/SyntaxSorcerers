import request  from 'supertest';
import app from '../app.js';
import Banned from '../models/Banned.js';
import User from '../models/User.js';
import UserCourses from '../models/UserCourses.js';

// Mock the models
jest.mock('../models/User.js');
jest.mock('../models/UserCourses.js');
jest.mock('../models/Banned.js');

describe('Testing All User Interfaces:', () => {

    beforeEach(() => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockReturnValue(false);
    });

    afterEach(() => {    
        jest.clearAllMocks();
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
    describe('POST /users/', () => {
        // Input: valid userId and user body (email, year_level, major, name, notification_token)
        // Expected status code: 200
        // Expected behavior: user info is created
        // Expected output: user data
        test("when user data is correct", async () => {
            const data = { 
                name: 'John Smith', 
                email: "test@gmail.com", 
                major: "LFS", 
                year_level: "3", 
                notification_token: "1234" 
            };

            const returnData = { userId: "123", ...data };
    
            jest.spyOn(User.prototype, 'createUser').mockReturnValue("1234");
    
            const response = await request(app)
                                    .post('/users/')
                                    .set('Authorization', 'Bearer 123')
                                    .send(data);
                             
            expect(response.status).toBe(200);
            expect(User.prototype.createUser).toHaveBeenCalledWith(returnData);
            expect(response.body).toEqual(returnData);
        });

        // Input: valid userId and valid user body except missing email
        // Expected status code: 400
        // Expected behavior: throws error message
        // Expected output: error message saying "Missing required fields, can not create user"
        test("when user data is missing email", async () => {
            const data = { 
                name: 'John Smith',
                major: "LFS", 
                year_level: "3", 
                notification_token: "1234" 
            };
    
            const response = await request(app)
                                    .post('/users/')
                                    .set('Authorization', 'Bearer 123')
                                    .send(data);
                             
            expect(response.status).toBe(400);
            expect(User.prototype.createUser).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: 'Missing required fields, can not create user'});
        });

        // Input: valid userId and valid user body except missing year_level
        // Expected status code: 400
        // Expected behavior: throws error message
        // Expected output: error message saying "Missing required fields, can not create user"
        test("when user data is missing year_level", async () => {
            const data = { 
                name: 'John Smith', 
                email: "test@gmail.com", 
                major: "LFS", 
                notification_token: "1234" 
            };
    
            const response = await request(app)
                                    .post('/users/')
                                    .set('Authorization', 'Bearer 123')
                                    .send(data);
                             
            expect(response.status).toBe(400);
            expect(User.prototype.createUser).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: 'Missing required fields, can not create user'});
        });

        // Input: valid userId and valid user body except missing major
        // Expected status code: 400
        // Expected behavior: throws error message
        // Expected output: error message saying "Missing required fields, can not create user"
        test("when user data is missing major", async () => {
            const data = { 
                name: 'John Smith', 
                email: "test@gmail.com", 
                year_level: "3", 
                notification_token: "1234" 
            };
    
            const response = await request(app)
                                    .post('/users/')
                                    .set('Authorization', 'Bearer 123')
                                    .send(data);
                             
            expect(response.status).toBe(400);
            expect(User.prototype.createUser).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: 'Missing required fields, can not create user'});
        });

        // Input: valid userId and valid user body except missing name
        // Expected status code: 400
        // Expected behavior: throws error message
        // Expected output: error message saying "Missing required fields, can not create user"
        test("when user data is missing name", async () => {
            const data = { 
                email: "test@gmail.com", 
                major: "LFS", 
                year_level: "3", 
                notification_token: "1234" 
            };
    
            const response = await request(app)
                                    .post('/users/')
                                    .set('Authorization', 'Bearer 123')
                                    .send(data);
                             
            expect(response.status).toBe(400);
            expect(User.prototype.createUser).not.toHaveBeenCalled();
            expect(response.body).toEqual({message: 'Missing required fields, can not create user'});
        });

        // Input: valid userId and valid user body, however database has not correctly inserted user
        // Expected status code: 500
        // Expected behavior: throws error message
        // Expected output: error message saying some error
        test("when user is not successfully created", async () => {
            const data = { 
                name: 'John Smith', 
                email: "test@gmail.com", 
                major: "LFS", 
                year_level: "3", 
                notification_token: "1234" 
            };

            const returnData = { userId: "123", ...data };
    
            jest.spyOn(User.prototype, 'createUser').mockRejectedValue(new Error('Some error'));;
    
            const response = await request(app)
                                    .post('/users/')
                                    .set('Authorization', 'Bearer 123')
                                    .send(data);
                             

                             
            expect(response.status).toBe(500);
            expect(User.prototype.createUser).toHaveBeenCalledWith(returnData);
            expect(response.body).toEqual({ message: 'Some error' });
        });
    });

    // Interface PUT /users/
    describe('PUT /users/', () => {
        // Input: valid userId and non empty body
        // Expected status code: 200
        // Expected behavior: user info is updated
        // Expected output: message saying "User updated"
        test("when user exists and body is non-empty", async () => {
            const body = { 
                name: 'John Smith', 
            };
    
            jest.spyOn(User.prototype, 'updateUser').mockReturnValue(true);
    
            const response = await request(app)
                                    .put('/users/')
                                    .set('Authorization', 'Bearer 123')
                                    .send(body);
                             
            expect(response.status).toBe(200);
            expect(User.prototype.updateUser).toHaveBeenCalledWith("123", body);
            expect(response.body).toEqual({ message: 'User updated' });
        });

        // Input: valid userId and empty body
        // Expected status code: 400
        // Expected behavior: nothing happens
        // Expected output: message saying "Body is empty, can not update user"
        test("when user exists and body is empty", async () => {    
            jest.spyOn(User.prototype, 'updateUser').mockReturnValue(true);
    
            const response = await request(app)
                                    .put('/users/')
                                    .set('Authorization', 'Bearer 123')
                                    .send({});
                             
            expect(response.status).toBe(400);
            expect(User.prototype.updateUser).not.toHaveBeenCalled();
            expect(response.body).toEqual({ message: 'Body is empty, can not update user' });
        });

        // Input: non-exisiting user
        // Expected status code: 404
        // Expected behavior: nothing happens
        // Expected output: message saying "User does not exist"
        test("when user does not exist", async () => {
            const body = { 
                name: 'John Smith', 
            };

            jest.spyOn(User.prototype, 'updateUser').mockReturnValue(false);
    
            const response = await request(app)
                                    .put('/users/')
                                    .set('Authorization', 'Bearer 145')
                                    .send(body);
                             
            expect(response.status).toBe(404);
            expect(User.prototype.updateUser).toHaveBeenCalledWith("145", body);
            expect(response.body).toEqual({ message: 'User does not exist' });
        });

        // Input: valid userId and valid body, however database can not update user
        // Expected status code: 500
        // Expected behavior: throws error message
        // Expected output: error message saying some error
        test("when user is not successfully updated", async () => {
            const body = {
                name: 'John Smith', 
            };
    
            jest.spyOn(User.prototype, 'updateUser').mockRejectedValue(new Error('Some error'));;
    
            const response = await request(app)
                                    .put('/users/')
                                    .set('Authorization', 'Bearer 123')
                                    .send(body);
                             
            expect(response.status).toBe(500);
            expect(User.prototype.updateUser).toHaveBeenCalledWith("123", body);
            expect(response.body).toEqual({ message: 'Some error' });
        });
    });

    // Interface DELETE /users/
    describe('DELETE /users/', () => {
        // Input: valid userId and non empty body
        // Expected status code: 200
        // Expected behavior: user info is updated
        // Expected output: message saying "User updated"
        test("when user exists and body is non-empty", async () => {
            jest.spyOn(User.prototype, 'deleteUser').mockReturnValue(true);
    
            const response = await request(app)
                                    .delete('/users/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(200);
            expect(User.prototype.deleteUser).toHaveBeenCalledWith("123");
            expect(response.body).toEqual({ message: 'User deleted' });
        });

        // Input: userId does not exist
        // Expected status code: 404
        // Expected behavior: nothing happens
        // Expected output: message saying "User does not exist"
        test("when user exists and body is non-empty", async () => {
            jest.spyOn(User.prototype, 'deleteUser').mockReturnValue(false);
    
            const response = await request(app)
                                    .delete('/users/')
                                    .set('Authorization', 'Bearer 145');
                             
            expect(response.status).toBe(404);
            expect(User.prototype.deleteUser).toHaveBeenCalledWith("145");
            expect(response.body).toEqual({ message: 'User does not exist' });
        });

        // Input: valid userId, however database can not update user
        // Expected status code: 500
        // Expected behavior: throws error message
        // Expected output: error message saying some error
        test("when user is not successfully updated", async () => {
            jest.spyOn(User.prototype, 'deleteUser').mockRejectedValue(new Error('Some error'));
    
            const response = await request(app)
                                    .delete('/users/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(500);
            expect(User.prototype.deleteUser).toHaveBeenCalledWith("123");
            expect(response.body).toEqual({ message: 'Some error' });
        });
    });

    // Interface GET /users/favourite
    describe('GET /users/favourite', () => {
        // Input: valid userId
        // Expected status code: 200
        // Expected behavior: user's favourite course are retrieved from db
        // Expected output: user's favourtie courses' ids
        test("when user id is valid", async () => {
            const data = ["CPEN 321", "CPEN 491"];
    
            jest.spyOn(UserCourses.prototype, 'getUserCourses').mockReturnValue(data);
    
            const response = await request(app)
                                    .get('/users/favourite')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(200);
            expect(UserCourses.prototype.getUserCourses).toHaveBeenCalledWith("123");
            expect(response.body).toEqual(data);
        });

        // Input: valid userId, however database can not retrieve user's favourite courses
        // Expected status code: 500
        // Expected behavior: throws error message
        // Expected output: error message saying some error
        test("when db throws and error retrieving courses", async () => {
            jest.spyOn(UserCourses.prototype, 'getUserCourses').mockRejectedValue(new Error('Some error'));
    
            const response = await request(app)
                                    .get('/users/favourite')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(500);
            expect(UserCourses.prototype.getUserCourses).toHaveBeenCalledWith("123");
            expect(response.body).toEqual({ message: 'Some error' });
        });
    });

    // Interface POST /users/favourite
    describe('POST /users/favourite', () => {});

    // Interface DELETE /users/favourite/:courseId
    describe('DELETE /users/favourite/:courseId', () => {});

    // Interface GET /users/courseKeywords
    describe('GET /users/courseKeywords', () => {});

    // Interface POST /users/recommendCourses
    describe('POST /users/recommendCourses', () => {});
  });