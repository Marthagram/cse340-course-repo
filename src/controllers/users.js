import bcrypt from 'bcrypt';
import {createUser, authenticateUser} from '../models/users.js';
  
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
        if (user) {
            req.session.user = user;
            req.flash('success', 'Login successful!');
            res.redirect('/');
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

export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, logout };