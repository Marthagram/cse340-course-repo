import db from './db.js'
import bcrypt from 'bcrypt'

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
        // Log the saved record to your terminal when registering a new user
console.log("SAVED USER IN DB:", result.rows[0]);
    }


    return result.rows[0].user_id;
};


const findUserByEmail = async (email) => {
   const query = `
    SELECT u.user_id, u.email, u.password_hash, r.role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
`;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
}; 

const authenticateUser = async (email, password) => {
  // 1. Get the user by email
  const user = await findUserByEmail(email);

  // 2. If no user is found, return null
  if (!user) {
    return null;
  }

  // 3. Verify if the provided password matches the stored hash
  const isPasswordValid = await verifyPassword(password, user.password_hash);

  // 4. If password is valid, delete password_hash and return the user object
  if (isPasswordValid) {
    delete user.password_hash;
    return user;
  }

  // If password check fails, return null
  return null;

}

const getAllResgisteredUsers = async () => {
    const query = `
        SELECT u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
    `;


    const result = await db.query(query);


    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows;
};  

export {createUser, authenticateUser, getAllResgisteredUsers};