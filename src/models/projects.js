import db from './db.js'


const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY project_date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getUpComingProjects = async(number_of_projects) =>{
        const query = `
        SELECT
          p.project_id,
          p.organization_id,
          o.name AS organization_name,
          p.title,
          p.description,
          p.location,
          p.project_date
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
     LIMIT $1; 
      `;
    const queryParams = [number_of_projects]; // Added this missing definition!
         
        const result = await db.query(query, queryParams);
        return result.rows;
     
}


    const getProjectDetails = async(id) =>{
        const query = `
        SELECT
          p.project_id,
          p.organization_id,
          o.name AS organization_name,
          p.title,
          p.description,
          p.location,
          p.project_date
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1; 
      `;


        const queryParams = [id];
    
        const result = await db.query(query, queryParams);
         return result.rows.length > 0 ? result.rows[0] : null;

  
    }

const createProject = async (organizationId, title, description, location, date) => {
    const query = `
      INSERT INTO service_project (organization_id, title, description, location, project_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [organizationId, title, description, location, date];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;

  }

  const updateProject = async (project_id, organizationId, title, description, location, project_date) => {
  const query = `
    UPDATE service_project
    SET organization_id = $1, title = $2, description = $3, location = $4, project_date = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const queryParams = [ organizationId, title, description, location, project_date, project_id];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated project with ID:', project_id);
  }

  return result.rows[0].project_id;
};

  
export {  getProjectsByOrganizationId, getUpComingProjects, getProjectDetails, createProject, updateProject};

 