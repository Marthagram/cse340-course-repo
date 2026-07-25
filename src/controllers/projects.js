import { body, validationResult } from 'express-validator';


// Import any needed model function
import {getUpComingProjects, getProjectDetails, createProject, updateProject } from '../models/projects.js';
import {getProjectCategories } from '../models/categories.js';
import {getAllOrganizations } from '../models/organizations.js';


const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const projectEditValidation = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3, max: 200 }),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 1000 }),
    body('location').trim().notEmpty().withMessage('Location is required').isLength({ max: 200 }),
    body('project_date').notEmpty().withMessage('Date is required').isISO8601(), // CHANGED
    body('organizationId').notEmpty().withMessage('Organization is required').isInt(), // ADDED BACK
];

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

const showNewProjectForm = async (req, res) => {
    const title = 'Create New Project';
    const organizations = await getAllOrganizations();
    res.render('new-project', { title, organizations });
}


const  processNewProjectForm = async (req, res) => {
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    // Extract the project data on the form submission using req.body.
    const {organizationId, title, description, location, date} = req.body;


    // Create the new project in the database
    const newProjectId = await createProject(organizationId, title, description, location, date);
    req.flash('success', 'New service project created successfully!');
    res.redirect(`/project/${newProjectId}`)

}

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Project';

    res.render('edit-project', { title, projectDetails, organizations });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    // Check for validation errors
const results = validationResult(req);
if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
        req.flash('error', error.msg);
    });

    // Redirect back to the edit organization form
    return res.redirect('/edit-project/' + req.params.id);
}


    const { organizationId, title, description, location, project_date } = req.body;
      console.log("BODY:", req.body);
    await updateProject(projectId, organizationId, title, description, location, project_date);
    
    // Set a success flash message
    req.flash('success', 'Project updated successfully!');

    res.redirect(`/project/${projectId}`);
};
 // Export any controller functions
export  { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, projectEditValidation, showEditProjectForm, processEditProjectForm};

