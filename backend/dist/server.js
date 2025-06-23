"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
// Load environment variables
dotenv_1.default.config();
// Database configuration
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
});
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Initialize database
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if users table exists
            const { rows } = yield pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
            if (!rows[0].exists) {
                console.log('Creating users table...');
                yield pool.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          surname VARCHAR(255),
          college VARCHAR(255),
          program VARCHAR(255),
          campus_status VARCHAR(255),
          last_login TIMESTAMP
        );
      `);
                console.log('Users table created successfully');
            }
            // Insert a test user if no users exist
            const { rows: userRows } = yield pool.query('SELECT COUNT(*) FROM users');
            if (parseInt(userRows[0].count) === 0) {
                console.log('Creating test user...');
                const testPassword = 'password123';
                const hashedPassword = require('crypto').createHash('md5').update(testPassword).digest('hex');
                yield pool.query(`
        INSERT INTO users (email, password_hash, name, surname, college, program, campus_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
                    'test@example.com',
                    hashedPassword,
                    'Test',
                    'User',
                    'Test College',
                    'Test Program',
                    'active'
                ]);
                console.log('Test user created successfully');
            }
        }
        catch (error) {
            console.error('Database initialization error:', error);
        }
    });
}
// Initialize database on startup
initializeDatabase();
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Database connection test
pool.connect((err, client, done) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    }
    else {
        console.log('Successfully connected to the database');
        done();
    }
});
// Login route
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        console.log('Attempting login for email:', email);
        // Find user by email
        const { rows } = yield pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];
        if (!user) {
            console.log('No user found with email:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        console.log('User found:', user.id);
        // Compare passwords (using MD5 for now - should be updated to bcrypt)
        const crypto = require('crypto');
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        console.log('Comparing passwords...');
        if (hashedPassword !== user.password_hash) {
            console.log('Password mismatch');
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        console.log('Password matched, generating token...');
        // Generate JWT token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name,
            college: user.college,
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        console.log('Token generated, updating last login...');
        // Try to update last login, but don't fail if the column doesn't exist
        try {
            yield pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
            console.log('Last login updated');
        }
        catch (error) {
            console.warn('Could not update last_login:', error.message);
        }
        console.log('Sending response...');
        // Send response
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                college: user.college,
                program: user.program,
                campus_status: user.campus_status,
            },
        });
    }
    catch (error) {
        console.error('Login error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}));
// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SafeSphere API' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
