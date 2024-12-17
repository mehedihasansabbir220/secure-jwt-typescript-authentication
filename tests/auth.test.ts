// import request from 'supertest';
// import { User } from '../src/models/User';
// import mongoose from 'mongoose';

// describe('Authentication Endpoints', () => {
//   let authToken: string;
  
//   beforeAll(async () => {
//     // Connect to test database
//     await mongoose.connect('mongodb://localhost:27017/test_db');
//   });

//   afterAll(async () => {
//     // Cleanup and disconnect
//     await mongoose.connection.dropDatabase();
//     await mongoose.connection.close();
//   });

//   beforeEach(async () => {
//     // Clear user collection before each test
//     await User.deleteMany({});
//   });

//   it('should register a new user', async () => {
//     const response = await request(app)
//       .post('/api/auth/register')
//       .send({
//         username: 'testuser',
//         email: 'test@example.com',
//         password: 'StrongPass123!'
//       });
    
//     expect(response.status).toBe(201);
//     expect(response.body.message).toBe('User registered successfully');
//   });

//   it('should login and return token', async () => {
//     // First register a user
//     await request(app)
//       .post('/api/auth/register')
//       .send({
//         username: 'loginuser',
//         email: 'login@example.com',
//         password: 'StrongPass123!'
//       });

//     // Then attempt login
//     const response = await request(app)
//       .post('/api/auth/login')
//       .send({
//         email: 'login@example.com',
//         password: 'StrongPass123!'
//       });
    
//     expect(response.status).toBe(200);
//     expect(response.body.token).toBeTruthy();
//     authToken = response.body.token;
//   });

//   it('should access protected route with valid token', async () => {
//     // Assumes previous login test has run and set authToken
//     const response = await request(app)
//       .get('/api/auth/profile')
//       .set('Authorization', `Bearer ${authToken}`);
    
//     expect(response.status).toBe(200);
//     expect(response.body.user).toBeTruthy();
//   });
// });