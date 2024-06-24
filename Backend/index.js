const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Database Configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'revspire_db'
};

console.log("Hello")

// Endpoint to view all content
app.get('/view-all-content', async (req, res) => {
    const viewer_id = req.body.viewer_id;

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Fetching all content from the database, including mimetype
        const [allContent] = await connection.query(`SELECT * FROM content`);

        connection.end();

        res.json({ success: true, content: allContent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to upload content
app.post('/upload-content', async (req, res) => {
    const { created_by, name, content, thumbnail, source, folder, mimetype } = req.body;

    if (!created_by || !name || !content || !thumbnail || !source || !folder || !mimetype) {
        return res.status(400).json({ success: false, message: 'All fields (created_by, name, content, thumbnail, source, folder, mimetype) are mandatory in the request body.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Check if a content with the same name and folder already exists
        const [existingContent] = await connection.query(`
            SELECT id 
            FROM content 
            WHERE name = ? AND folder = ?`, [name, folder]);

        if (existingContent.length > 0) {
            return res.status(400).json({ success: false, message: 'Content name already exists.' });
        }

        // Insert the new content into the database, including mimetype
        await connection.execute(`
            INSERT INTO content (name, content, thumbnail, source, folder, created_by, updated_by, mimetype)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, content, thumbnail, source, folder, created_by, created_by, mimetype]
        );

        connection.end();

        res.json({ success: true, message: 'Content uploaded successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to view one content by ID
app.get('/view-content/:contentId', async (req, res) => {
    const content_id = req.params.contentId;
    const viewer_id = req.body.viewer_id;

    if (!viewer_id) {
        return res.status(400).json({ success: false, message: 'The viewer_id field is mandatory in the request body.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Fetch the specified content from the database
        const [content] = await connection.query(`
            SELECT * 
            FROM content 
            WHERE id = ?`, [content_id]);

        if (!content.length) {
            connection.end();
            return res.status(404).json({ success: false, message: 'Content not found.' });
        }

        const contentInfo = content[0];

        connection.end();

        res.json({ success: true, content: contentInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to edit content using content_id from the URL
app.patch('/edit-content/:contentId', async (req, res) => {
    const { updated_by, mimetype, ...updateFields } = req.body;
    const content_id = req.params.contentId;

    if (!updated_by) {
        return res.status(400).json({ success: false, message: 'The updated_by field is mandatory in the request body.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        // Check if a content with the same name and folder already exists
        const [existingContent] = await connection.query(`
            SELECT id 
            FROM content 
            WHERE name = ? AND folder = ? AND id != ?`, [updateFields.name, updateFields.folder, content_id]);

        if (existingContent.length > 0) {
            return res.status(400).json({ success: false, message: 'Content name already exists.' });
        }

        // Constructing the SQL update string dynamically based on provided fields
        const updateString = Object.keys(updateFields).map(field => `${field} = ?`).join(", ");

        // Updating the specified content in the database, including mimetype
        await connection.execute(`
            UPDATE content 
            SET ${updateString}, mimetype = ?, updated_by = ?
            WHERE id = ?`,
            [...Object.values(updateFields), mimetype, updated_by, content_id]
        );

        connection.end();

        res.json({ success: true, message: 'Content updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to delete content using content_id from the URL
app.delete('/delete-content/:contentId', async (req, res) => {
    const { updated_by } = req.body;
    const content_id = req.params.contentId;

    if (!updated_by) {
        return res.status(400).json({ success: false, message: 'The updated_by field is mandatory in the request body.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Deleting the specified content from the database
        await connection.execute(`
            DELETE FROM content 
            WHERE id = ?`, [content_id]
        );

        connection.end();

        res.json({ success: true, message: 'Content deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to view a specific folder using folder_id from the URL
app.get('/view-folder/:folderId', async (req, res) => {
    const folder_id = req.params.folderId;

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Fetch the folder information from the database
        const [folder] = await connection.query(`
            SELECT * 
            FROM folder 
            WHERE id = ?`, [folder_id]);

        connection.end();

        if (!folder.length) {
            return res.status(404).json({ success: false, message: 'Folder not found' });
        }

        res.json({ success: true, folder: folder[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to view all folders
app.get('/view-all-folders', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        // Fetch all folders from the database
        const [allfolders] = await connection.query(`
            SELECT * 
            FROM folder`);

        connection.end();

        res.json({ success: true, folders: allfolders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to create a new folder
app.post('/create-folder', async (req, res) => {
    const { name, parent_folder, created_by } = req.body;

    if (!name || !parent_folder || !created_by) {
        return res.status(400).json({ success: false, message: 'All fields (name, parent_folder, created_by) are mandatory in the request body.' });
    }

    // Check if the folder name is "root" (case-insensitive)
    if (name.toLowerCase() === 'root') {
        return res.status(400).json({ success: false, message: 'Folder name "root" is reserved and cannot be used.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Check if a folder with the same name already exists in the parent folder
        const [existingFolder] = await connection.query(`
            SELECT id 
            FROM folder 
            WHERE name = ? AND parent_folder = ?`, [name, parent_folder]);

        if (existingFolder.length > 0) {
            return res.status(400).json({ success: false, message: 'Folder name already exists in the parent folder.' });
        }

        // Insert the new folder into the database
        await connection.execute(`
            INSERT INTO folder (name, parent_folder, created_by, updated_by)
            VALUES (?, ?, ?, ?)`,
            [name, parent_folder, created_by, created_by]
        );

        connection.end();

        res.json({ success: true, message: 'Folder created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


// Endpoint to edit a folder using folder_id from the URL
app.patch('/edit-folder/:folderId', async (req, res) => {
    const { updated_by, name, parent_folder } = req.body;
    const folder_id = req.params.folderId;

    if (!updated_by) {
        return res.status(400).json({ success: false, message: 'The updated_by field is mandatory in the request body.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Check if the folder being edited is the root folder
        const [existingFolder] = await connection.query(`
            SELECT name 
            FROM folder 
            WHERE id = ?`, [folder_id]);

        if (!existingFolder.length) {
            return res.status(404).json({ success: false, message: 'Folder not found.' });
        }

        const folderName = existingFolder[0].name;

        if (folderName.toLowerCase() === 'root') {
            return res.status(400).json({ success: false, message: 'Cannot edit the root folder.' });
        }

        // Check if a folder with the same name already exists in the parent folder
        const [existingFolderWithName] = await connection.query(`
            SELECT id 
            FROM folder 
            WHERE name = ? AND parent_folder = ? AND id != ?`, [name, parent_folder, folder_id]);

        if (existingFolderWithName.length > 0) {
            return res.status(400).json({ success: false, message: 'Folder name already exists in the parent folder.' });
        }

        // Check if the new folder name is "root"
        if (name.toLowerCase() === 'root') {
            return res.status(400).json({ success: false, message: 'Cannot rename a folder to "root".' });
        }

        // Constructing the SQL update string dynamically based on provided fields
        const updateString = Object.keys(req.body).map(field => `${field} = ?`).join(", ");

        // Updating the specified folder in the database
        await connection.execute(`
            UPDATE folder 
            SET ${updateString}, updated_by = ?
            WHERE id = ?`,
            [...Object.values(req.body), updated_by, folder_id]
        );

        connection.end();

        res.json({ success: true, message: 'Folder updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to delete a folder using folder_id from the URL
app.delete('/delete-folder/:folderId', async (req, res) => {
    const { updated_by } = req.body;
    const folder_id = req.params.folderId;

    if (!updated_by) {
        return res.status(400).json({ success: false, message: 'The updated_by field is mandatory in the request body.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Check if the folder being deleted is named "root"
        const [folderData] = await connection.query(`
            SELECT name 
            FROM folder 
            WHERE id = ?`, [folder_id]);

        if (!folderData.length) {
            return res.status(404).json({ success: false, message: 'Folder not found.' });
        }

        const folderName = folderData[0].name;

        if (folderName.toLowerCase() === 'root') {
            return res.status(400).json({ success: false, message: 'Cannot delete the root folder.' });
        }

        // Deleting the specified folder from the database
        await connection.execute(`
            DELETE FROM folder 
            WHERE id = ?`, [folder_id]
        );

        connection.end();

        res.json({ success: true, message: 'Folder deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to view sorted content and folders
app.post('/view-content-and-folders-sorted', async (req, res) => {
    const viewer_id = req.body.viewer_id;
    let folder_id = req.body.folder_id;
    const sortOption = req.body.sortOption || 'type'; // Default sorting option
    const order = req.body.order || 'ASC'; // Default sorting order

    // Validate viewer_id field
    if (!viewer_id) {
        console.error('viewer_id field is missing in the request');
        return res.status(400).json({ success: false, message: 'The viewer_id field is mandatory in the request body.' });
    }

    try {
        // Establish a new database connection
        const connection = await mysql.createConnection(dbConfig);

        // Handle root folder ID retrieval
        if (!folder_id) {
            const [rootFolder] = await connection.query(`
                SELECT id 
                FROM folder 
                WHERE name = 'root'`);
            if (rootFolder.length) {
                folder_id = rootFolder[0].id;
            } else {
                console.error('Root folder not found');
                return res.status(400).json({ success: false, message: 'Root folder not found.' });
            }
        }

        // Construct queries for fetching folders and content
        let folderQuery = `
        SELECT f.*, 
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by, 
        CONCAT(updater.first_name, ' ', updater.last_name) AS updated_by,
        parent.name AS parent_folder_name
        FROM folder f
        LEFT JOIN folder parent ON f.parent_folder = parent.id
        LEFT JOIN user AS creator ON f.created_by = creator.id
        LEFT JOIN user AS updater ON f.updated_by = updater.id
        WHERE f.parent_folder = ?`;

        let contentQuery = `
        SELECT c.*, 
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by, 
        CONCAT(updater.first_name, ' ', updater.last_name) AS updated_by,
        f.name AS folder_name
        FROM content c
        LEFT JOIN folder f ON c.folder = f.id
        LEFT JOIN user AS creator ON c.created_by = creator.id
        LEFT JOIN user AS updater ON c.updated_by = updater.id
        WHERE c.folder = ?`;

        // Execute queries to fetch folders and content
        const [folders] = await connection.query(folderQuery, [folder_id]);
        const [content] = await connection.query(contentQuery, [folder_id]);

        // Close the database connection
        connection.end();

        // Combine and send the response
        const combinedResult = [...folders, ...content];
        res.json({ success: true, items: combinedResult });
    } catch (error) {
        // Log and handle errors
        console.error('Error occurred in /view-content-and-folders-sorted endpoint:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to retrieve the table name based on record_id
app.post('/get-table-name', async (req, res) => {
    const record_id = req.body.record_id;
    console.log( record_id)

    // Validate record_id field
    if (!record_id || record_id.length < 3) {
        console.error('Invalid or missing record_id');
        return res.status(400).json({ success: false, message: 'Invalid or missing record_id in the request body.' });
    }

    try {
        // Extract the first three characters from record_id
        const idPrefix = record_id.substring(0, 3);

        // Establish a new database connection
        const connection = await mysql.createConnection(dbConfig);

        // Query to fetch the tablename
        const query = `SELECT tablename FROM tableidentifier WHERE id = ?`;
        const [rows] = await connection.query(query, [idPrefix]);

        // Check if tablename is found
        if (rows.length === 0) {
            console.error('No matching tablename found');
            return res.status(404).json({ success: false, message: 'No matching tablename found for the provided record_id.' });
        }

        // Close the database connection
        connection.end();

        // Send the response
        res.json({ success: true, tablename: rows[0].tablename });
    } catch (error) {
        // Log and handle errors
        console.error('Error occurred in /get-table-name endpoint:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

   
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
