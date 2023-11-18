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

    // Interface GET /posts/:forumId
    describe('GET /posts/:forumId', () => {});

    // Interface GET /posts/post/:postId
    describe('GET /posts/post/:postId', () => {});

    // Interface POST /posts/
    describe('POST /posts/', () => {});

    // Interface DELETE /posts/:postId
    describe('DELETE /posts/:postId', () => {});

    // Interface PUT /posts/:postId
    describe('PUT /posts/:postId', () => {});
});