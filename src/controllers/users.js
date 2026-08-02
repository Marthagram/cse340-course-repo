import bcrypt from 'bcrypt';
import {createUser, authenticateUser, getAllRegisteredUsers} from '../models/users.js';
  
const showAllRegisteredUsers = async (req, res) => {
    try {
        const users = await getAllRegisteredUsers();
        res.render('all-users', { title: 'All Registered Users', users });
    } catch (error) {
        console.error('Error fetching registered users:', error);
        req.flash('error', 'An error occurred while fetching registered users.');
        return res.redirect('/dashboard');
    }
};

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'User Registration' });
}

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login'); // better to send to login
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.code === '23505') { // duplicate email
            req.flash('error', 'That email is already registered.');
        } else {
            req.flash('error', 'An error occurred during registration.');
        }
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authenticateUser(email, password);

        // user information were initially stored here in the sessions for continous/chain requests for a user without enterings details again and again
        
        // user information is stored in the session to maintain the user's logged-in state across different requests. This allows the application to recognize the user and provide personalized content or access to protected routes without requiring them to log in again for each request. The session acts as a temporary storage mechanism that holds user data, such as their ID, role, and other relevant information, enabling a seamless user experience throughout their interaction with the application.
        //  Once stored in session here, it can be used in other controller functions
        if (user) {
            req.session.user = user;
            req.flash('success', 'Login successful!');
            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login.');
        res.redirect('/login');
    }
};

const logout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};


const requireLogin = (req, res, next) => {

    //  Check if the user is logged in by verifying if req.session.user exists
    // requireLogin middleware is used to protect routes that require authentication. If the user is not logged in, they are redirected to the login page with an error message.\
    //  req.session.user is set when the user successfully logs in, and it contains the user's information. If this property is not present, it indicates that the user is not authenticated.
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', { 
        title: 'My Dashboard',
        name: user.name,
        email: user.email
    });
};


/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }

     

        // User has required role, continue
        next();
    };
};





export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, logout, requireLogin, showDashboard, requireRole, showAllRegisteredUsers };    