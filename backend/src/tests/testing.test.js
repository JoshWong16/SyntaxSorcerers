import request  from 'supertest';
import app from '../app.js';
import Banned from '../models/Banned.js';
import db from '../db/db.js';

// Mock the models
jest.mock('../db/db.js', () => ({
    database: {
        collection: jest.fn(),
    },
}));
jest.mock('../models/Banned.js');

describe('Testing All Posts Interfaces:', () => {
    test('when valid postId, but database throws error', async () => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockResolvedValue(false);

        const spy = jest.spyOn(db.database, 'collection');
        spy.mockReturnValue({
            findOne: jest.fn().mockResolvedValue({ key: 'value1' }),
        });

        const response = await request(app)
                                .get('/users')
                                .set('Authorization', 'Bearer 123');

    
        expect(response.status).toBe(500);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(response.body.message).toEqual('test error');
    });
    
    test('when valid postId, but database throws error', async () => {
        jest.spyOn(Banned.prototype, 'getBannedUser').mockResolvedValue(false);
        const spy = jest.spyOn(db.database, 'collection');
        spy.mockReturnValue({
            findOne: jest.fn().mockResolvedValue({ key: 'value2' }),
        });
        
        const response = await request(app)
                                .get('/users')
                                .set('Authorization', 'Bearer 123');
    
        expect(response.status).toBe(500);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(response.body.message).toEqual('test error');
    });
});