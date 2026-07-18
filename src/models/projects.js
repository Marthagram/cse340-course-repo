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
        WHERE project_date >= CURRENT_DATE
        ORDER BY project_date ASC
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



       

    

export {  getProjectsByOrganizationId, getUpComingProjects, getProjectDetails};

 