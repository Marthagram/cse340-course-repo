// This file will contain all of the routing logic for your application

import express from 'express';

// importing individual pages' controller logic
import { organizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { homePageCrtler } from './controllers/index.js';
import { categoriesPageCrtler, showCategoryDetails, showAssignCategoriesForm, processAssignCategoriesForm, categoryValidation, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm } from './controllers/categories.js';
import {showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, projectEditValidation, showEditProjectForm, processEditProjectForm} from './controllers/projects.js';
import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, logout, requireLogin, showDashboard, requireRole, showAllRegisteredUsers } from './controllers/users.js';
import { testErrorPageCrtler } from './controllers/errors.js';







// their routing logic

const router = express.Router();

// ===== HOME =====
router.get('/', homePageCrtler);

// ===== ORGANIZATIONS =====
// show all organizations page
router.get('/organizations', requireLogin, organizationsPage);

// show a specific organization page
router.get('/organization/:id', showOrganizationDetailsPage);

// show new and process organization form
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

// show edit and process organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// ===== PROJECTS =====

// show all projects page
router.get('/projects', requireLogin, showProjectsPage);

// show a specific project page
router.get('/project/:id', showProjectDetailsPage);

// show and process new project form
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);


// show and process edit project form
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectEditValidation, processEditProjectForm);

// Assign categories to project
//  show and process the form to assign categories to a project
router.get('/project/:projectId/assign-categories', requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', requireRole('admin'), processAssignCategoriesForm);

// ===== CATEGORIES =====
router.get('/categories', requireLogin, categoriesPageCrtler);

// show specific category details page
router.get('/category/:id', showCategoryDetails);

// show and process new category form
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

// show and process edit category form
router.get('/edit-category/:id',  requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// ===== USERS =====
// show and process user registration form
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// show all registered Users

router.get('all-users', showAllRegisteredUsers)

// =====Login =======

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);



// ===== Logout =====
router.get('/logout', logout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);


// ===== ERROR TEST =====
router.get('/test-error', testErrorPageCrtler);
export default router;