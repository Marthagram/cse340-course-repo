// This file will contain all of the routing logic for your application

import express from 'express';

// importing individual pages' controller logic
import { organizationsPage } from './controllers/organizations.js';
import { homePageCrtler } from './controllers/index.js';
import { categoriesPageCrtler, showCategoryDetails } from './controllers/categories.js';
import {showProjectsPage, showProjectDetailsPage} from './controllers/projects.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { testErrorPageCrtler } from './controllers/errors.js';







// their routing logic

const router = express.Router();

router.get('/organizations', organizationsPage);
router.get('/', homePageCrtler);
router.get('/categories', categoriesPageCrtler);
router.get('/projects', showProjectsPage);
// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

// Route for project details page
router.get('/category/:id', showCategoryDetails);


// error-handling routes
router.get('/test-error', testErrorPageCrtler);


export default router;