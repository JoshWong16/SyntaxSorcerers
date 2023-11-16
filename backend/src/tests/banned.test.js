import request  from 'supertest';
import app from '../app.js';
import Banned from '../models/Banned.js';

// Mock the models
jest.mock('../models/Banned.js');

describe('Testing All Posts Interfaces:', () => {
    beforeAll(() => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockReturnValue(false);
    });
 
    // Interface GET /banned/all-users
    describe('GET /banned/all-users', () => {});

    // Interface GET /banned/user/:userId
    describe('GET /banned/user/:userId', () => {});

    // Interface POST /banned/
    describe('POST /banned/', () => {});
});