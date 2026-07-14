// Import any needed model function
import {getAllOrganizationProjects } from '../models/projects.js';

// define the controller function
const projectsPageCrtler = async (req, res) => {
    const title = 'Service Projects';
    const service_projects = await getAllOrganizationProjects(); // default to empty so EJS never crashes
    console.log('Service Projects:', service_projects);
    res.render('projects', { title, service_projects }); // always sends something
};

 // Export any controller functions
export  { projectsPageCrtler};