import request  from 'supertest';
import app from '../app.js';
import Banned from '../models/Banned.js';

// Mock the models
jest.mock('../models/Banned.js');

describe('Testing All Reports Interfaces:', () => {
    beforeAll(() => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockReturnValue(false);
    });

    // Interface GET /reports/all-users
    describe('POST /reports/all-users', () => {});

    // Interface GET /reports/user/:userId
    describe('GET /reports/user/:userId', () => {});

    // Interface POST /reports/
    describe('POST /reports/', () => {});
});