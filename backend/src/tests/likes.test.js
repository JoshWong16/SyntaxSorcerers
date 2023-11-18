import request  from 'supertest';
import app from '../app.js';
import Banned from '../models/Banned.js';

// Mock the models
jest.mock('../models/Banned.js');

describe('Testing All Posts Interfaces:', () => {
    beforeAll(() => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockReturnValue(false);
    });

    afterEach(() => {    
        jest.clearAllMocks();
    });

    // Interface GET /likes/:postId
    describe('GET /likes/:postId', () => {});

    // Interface POST /likes/
    describe('POST /likes/', () => {});

    // Interface DELETE /likes/:postId
    describe('DELETE /likes/:postId', () => {});
});