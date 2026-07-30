import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import router from './src/routes.js';
import flash from './src/middleware/flash.js';
import session from 'express-session';
import { testConnection } from './src/models/db.js';


const app = express();


// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;


// Define the session secret for express-session to allow remembering logged-in users across requests. This should be a long, random string in production.
const SESSION_SECRET = process.env.SESSION_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
    * Configure Express middleware
  */

// 1. Body parsers FIRST - session needs to read cookies from parsed req
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 2. Static files
app.use(express.static(path.join(__dirname, 'public')));

// 3. SESSION - must be before flash and before any route that uses req.session
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // better: don't create session until we store something
    cookie: { 
        maxAge: 60 * 60 * 1000, // 1 hour
        secure: false // set true if using https
    }
}));

// 4. FLASH - now req.session exists
app.use(flash);

// 5. Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 6. Locals middleware - now safe to use req.session
app.use((req, res, next) => {
    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
    }

    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// 7. Request logger
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// 8. Routes
app.use(router);

// 9. 404 + Error handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: NODE_ENV === 'development' ? err.stack : ''
    });
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});




