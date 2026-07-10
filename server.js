import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';

import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import {getAllOrganizationProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';
const app = express();


// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));



/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const title = 'Our Partner Organizations';
    const organizations = await getAllOrganizations();
    console.log('Organizations:', organizations);
    res.render('organizations', { title, organizations });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    const service_projects = await getAllOrganizationProjects(); // default to empty so EJS never crashes
    console.log('Service Projects:', service_projects);
    res.render('projects', { title, service_projects }); // always sends something
});
app.get('/categories', async (req, res) => {
    const title = 'Categories';
    const categories = await getAllCategories();
    console.log('Categories:', categories);
    res.render('categories', { title, categories });
   
});
// */

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});




