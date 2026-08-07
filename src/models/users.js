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
    SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
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

const getAllRegisteredUsers = async () => {
    const query = `
        SELECT u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
    `;


    const result = await db.query(query);


    if (result.rows.length === 0) {
        return []; // User not found
    }
    
    return result.rows;
};  

const addVolunteersToProject = async (project_id, user_id) => {
 const query = `INSERT INTO public.volunteer (project_id, user_id) 
   VALUES ($1, $2)
   ON CONFLICT (project_id, user_id) DO NOTHING
   RETURNING *` // <-- add this
  const queryParams = [project_id, user_id]

const result = await db.query(query, queryParams)

if (result.rows.length === 0) {
  console.log("Already a volunteer")
} else {
  console.log("New volunteer added")
}

}

const checkIfUserIsVolunteer = async (projectId, userId) => {
    const query = `
        SELECT * FROM public.volunteer
        WHERE project_id = $1 AND user_id = $2
    `;
    const queryParams = [projectId, userId];

    const result = await db.query(query, queryParams);
    return result.rows.length > 0;
};

const removeVolunteersFromProject = async (projectId, userId) => {
    const query = `
        DELETE FROM public.volunteer
        WHERE project_id = $1 AND user_id = $2
    `;
    const queryParams = [projectId, userId];

    await db.query(query, queryParams);
};

const getProjectListsFromVolunteer = async (userId) => {
    const query = `
        SELECT  p.project_id, p.title, p.description, p.location, p.project_date
        FROM public.service_project p
        JOIN public.volunteer v ON p.project_id = v.project_id
        JOIN public.users u ON v.user_id = u.user_id
        WHERE v.user_id = $1
    `;
    const queryParams = [userId];

    const result = await db.query(query, queryParams);
    return result.rows;
};

export {createUser, authenticateUser, getAllRegisteredUsers, addVolunteersToProject, removeVolunteersFromProject, getProjectListsFromVolunteer, checkIfUserIsVolunteer};