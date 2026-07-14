// Import any needed model function
import { getAllOrganizations } from '../models/organizations.js';

// define the controller function
const organizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

 // Export any controller functions
export  {organizationsPage};