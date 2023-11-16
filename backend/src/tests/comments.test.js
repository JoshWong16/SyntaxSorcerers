import request  from 'supertest';
import app from '../app.js';
import Banned from '../models/Banned.js';

// Mock the models
jest.mock('../models/Banned.js');

describe('Testing All Posts Interfaces:', () => {
    beforeAll(() => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockReturnValue(false);
    });
 
    // Interface GET /comments/:postId
    describe('GET /comments/:postId', () => {});

    // Interface GET /comments/comment/:commentId
    describe('GET /comments/comment/:commentId', () => {});

    // Interface POST /comments/
    describe('POST /comments/', () => {});
    
    // Interface PUT /comments/:commentId
    describe('PUT /comments/:commentId', () => {});

    // Interface DELETE /comments/:commentId
    describe('DELETE /comments/:commentId', () => {});
});