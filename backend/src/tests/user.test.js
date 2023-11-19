import request  from 'supertest';
import app from '../app.js';
import Banned from '../models/Banned.js';
import User from '../models/User.js';
import UserCourses from '../models/UserCourses.js';
import fs from 'fs';

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
                year_level: "3"
            };

            const returnData = { userId: "123", ...data, notification_token: null };
    
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
    describe('POST /users/favourite', () => {
        // Input: valid userId and valid courseId
        // Expected status code: 200
        // Expected behavior: user's favourite course is added to db
        // Expected output: message saying "Course added"
        test("when user id and course id are valid", async () => {
            const courseId = "CPEN 321";
    
            jest.spyOn(UserCourses.prototype, 'addUserCourse').mockReturnValue(true);
    
            const response = await request(app)
                                    .post('/users/favourite')
                                    .set('Authorization', 'Bearer 123')
                                    .send({ courseId });
                             
            expect(response.status).toBe(200);
            expect(UserCourses.prototype.addUserCourse).toHaveBeenCalledWith("123", courseId);
            expect(response.body).toEqual({ message: 'Course added' });
        });

        // Input: valid userId and does not pass courseId
        // Expected status code: 400
        // Expected behavior: nothing happens
        // Expected output: message saying "Missing required fields, can not add course to favourites"
        test("when user id is valid and course id is missing", async () => {
            jest.spyOn(UserCourses.prototype, 'addUserCourse').mockReturnValue(true);
    
            const response = await request(app)
                                    .post('/users/favourite')
                                    .set('Authorization', 'Bearer 123')
                                    .send({});
                             
            expect(response.status).toBe(400);
            expect(UserCourses.prototype.addUserCourse).not.toHaveBeenCalled();
            expect(response.body).toEqual({ message: 'Missing required fields, can not add course to favourites' });
        });

        // Input: valid userId and valid courseId, however database can not add course
        // Expected status code: 500
        // Expected behavior: throws error message
        // Expected output: error message saying some error
        test("when db throws and error adding course", async () => {
            const courseId = "CPEN 321";
    
            jest.spyOn(UserCourses.prototype, 'addUserCourse').mockRejectedValue(new Error('Some error'));
    
            const response = await request(app)
                                    .post('/users/favourite')
                                    .set('Authorization', 'Bearer 123')
                                    .send({ courseId });
                             
            expect(response.status).toBe(500);
            expect(UserCourses.prototype.addUserCourse).toHaveBeenCalledWith("123", courseId);
            expect(response.body).toEqual({ message: 'Some error' });
        });
    });

    // Interface DELETE /users/favourite/:courseId
    describe('DELETE /users/favourite/:courseId', () => {
        // Input: valid userId and valid courseId
        // Expected status code: 200
        // Expected behavior: user's favourite course is removed from db
        // Expected output: message saying "Course removed"
        test("when user id and course id are valid", async () => {
            const courseId = "CPEN 321";
    
            jest.spyOn(UserCourses.prototype, 'removeUserCourse').mockReturnValue(true);
    
            const response = await request(app)
                                    .delete(`/users/favourite/${courseId}`)
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(200);
            expect(UserCourses.prototype.removeUserCourse).toHaveBeenCalledWith("123", courseId);
            expect(response.body).toEqual({ message: 'Course removed' });
        });

        // Input: valid userId and does not pass courseId
        // Expected status code: 404
        // Expected behavior: nothing happens
        // Expected output: message saying "Missing required fields, can not remove course from favourites"
        test("when user id is valid and course id is missing", async () => {
            jest.spyOn(UserCourses.prototype, 'removeUserCourse').mockReturnValue(true);
    
            const response = await request(app)
                                    .delete('/users/favourite/')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(404);
            expect(UserCourses.prototype.removeUserCourse).not.toHaveBeenCalled();
            expect(response.error.message).toEqual('cannot DELETE /users/favourite/ (404)');
        });

        // Input: valid userId but the course is not favourited for the user
        // Expected status code: 404
        // Expected behavior: nothing happens
        // Expected output: message saying "Course was not favourited for user"
        test("when user id is valid but course is not favourited", async () => {
            const courseId = "CPEN 321";
    
            jest.spyOn(UserCourses.prototype, 'removeUserCourse').mockReturnValue(false);
    
            const response = await request(app)
                                    .delete(`/users/favourite/${courseId}`)
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(404);
            expect(UserCourses.prototype.removeUserCourse).toHaveBeenCalledWith("123", courseId);
            expect(response.body).toEqual({ message: 'Course was not favourited for user' });
        });

        // Input: valid userId and valid courseId, however database can not remove course
        // Expected status code: 500
        // Expected behavior: throws error message
        // Expected output: error message saying some error
        test("when db throws and error removing course", async () => {
            const courseId = "CPEN 321";
    
            jest.spyOn(UserCourses.prototype, 'removeUserCourse').mockRejectedValue(new Error('Some error'));
    
            const response = await request(app)
                                    .delete(`/users/favourite/${courseId}`)
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(500);
            expect(UserCourses.prototype.removeUserCourse).toHaveBeenCalledWith("123", courseId);
            expect(response.body).toEqual({ message: 'Some error' });
        });
    });

    // Interface GET /users/courseKeywords
    describe('GET /users/courseKeywords', () => {
        // Input: valid userId
        // Expected status code: 200
        // Expected behavior: user's course keywords are retrieved from db
        // Expected output: user's course keywords
        test("when user id is valid", async () => {
            const response = await request(app)
                                    .get('/users/courseKeywords')
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(200);
            expect(response.body.length).toEqual(280);
        });

        // Input: valid userId, but readFile fails
        // Expected status code: 500
        // Expected behavior: throws error message
        // Expected output: error message saying some error
        test("when readFile fails", async () => {
            // Set up the error you want to simulate
            const expectedError = new Error('File not found');
            
            // Mock fs.readFile using jest.spyOn
            const spy = jest.spyOn(fs, 'readFile').mockImplementation((path, encoding, callback) => {;
                callback(expectedError, null);
            });

            const response = await request(app)
                                    .get('/users/courseKeywords')
                                    .set('Authorization', 'Bearer 123');
     
            expect(response.status).toBe(500);

            spy.mockRestore();
        });
    });

    // Interface GET /users/recommendCourses
    describe('GET /users/recommendCourses', () => {
        // Input: valid userId and valid keywords
        // Expected status code: 200
        // Expected behavior: user's recommended courses are retrieved from db
        // Expected output: user's recommended courses
        test("when user id and keywords are valid", async () => {
            const keywords = ["Art", "Linear Algebra", "TEST"];
            const response = await request(app)
                                    .get(`/users/recommendedCourses?userKeywords=${keywords.join(',')}`)
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(200);
            expect(response.body['Art'].length).toEqual(17);
            expect(response.body['Linear Algebra'].length).toEqual(11);
        });

        // Input: blank keywords
        // Expected status code: 400
        // Expected behavior: nothing happens
        // Expected output: message saying "Missing required keywords"
        test("when keywords are blank", async () => {
            const response = await request(app)
                                    .get(`/users/recommendedCourses`)
                                    .set('Authorization', 'Bearer 123');
                             
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Missing required keywords' });
        });

        // Input: valid userId, but readFile fails
        // Expected status code: 500
        // Expected behavior: throws error message
        // Expected output: error message saying some error
        test("when readFile fails", async () => {
            const keywords = ["Art", "Linear Algebra"];
            // Set up the error you want to simulate
            const expectedError = new Error('File not found');
            
            const spy = jest.spyOn(fs, 'readFile').mockImplementation((path, encoding, callback) => {;
                callback(expectedError, null);
            });

            const response = await request(app)
                                    .get(`/users/recommendedCourses?userKeywords=${keywords.join(',')}`)
                                    .set('Authorization', 'Bearer 123');
     
            expect(response.status).toBe(500);

            spy.mockRestore();
        });
    });
});