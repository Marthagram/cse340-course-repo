import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT organization_id, name, description,
         contact_email, 
        logo_filename
      FROM public.organization;
    `;

     try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllOrganizations:', error.message);
        return [];
    }
}

const getOrganizationDetails = async (organizationId) => {
      const query = `
      SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM public.organization
      WHERE organization_id = $1;
    `;

      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      // Return the first row of the result set, or null if no rows are found
      return result.rows.length > 0 ? result.rows[0] : null;
};

export {getAllOrganizations, getOrganizationDetails};

// Important Security Note
// Notice that this function uses a parameterized query to safely include the organization ID in the SQL statement, which helps prevent SQL injection attacks. If you included the organization ID directly in the query string, it could allow malicious users to execute arbitrary SQL commands.

// In this course, you should always use parameterized queries when including user input in SQL statements. Never put the user input directly into the query string.