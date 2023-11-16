import request  from 'supertest';
import app from '../app.js';
import Banned from '../models/Banned.js';

// Mock the models
jest.mock('../models/Banned.js');

describe('Testing All Posts Interfaces:', () => {
    beforeAll(() => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockReturnValue(false);
    });
 
    // Interface GET /forums/
    describe('GET /forums/', () => {});

    // Interface POST /forums/
    describe('POST /forums/', () => {});

    // Interface DELETE /forums/:forumId
    describe('DELETE /forums/:forumId', () => {});

    // Interface GET /forums/user
    describe('GET /forums/user', () => {});

    // Interface POST /forums/user
    describe('POST /forums/user', () => {});

    // Interface DELETE /forums/user/:forumId
    describe('DELETE /forums/user/:forumId', () => {});
});