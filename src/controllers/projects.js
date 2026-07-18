// Import any needed model function
import {getUpComingProjects, getProjectDetails } from '../models/projects.js';
import {getProjectCategories } from '../models/categories.js';
// define the controller function
const showProjectsPage= async (req, res) => {
    const title = 'Upcoming Service Projects';
    const numOfProjects = 5;
    const service_projects = await getUpComingProjects(numOfProjects)
    console.log('Service Projects:', service_projects);
    res.render('projects', { title, service_projects }); // always sends something
};

const showProjectDetailsPage = async(req, res) =>{
    const projectId = req.params.id;
    const title = 'Specific Project'
    const service_project = await getProjectDetails(projectId);
    const projectCategories = await getProjectCategories(projectId);
    res.render('project', {title, service_project, projectCategories})

}

 // Export any controller functions
export  { showProjectsPage, showProjectDetailsPage};

