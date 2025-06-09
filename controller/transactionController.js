const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

exports.processTransaction = (req, res) => {
    if (!req.files || !req.body.target_savings) {
        console.error("No file or target savings value provided.");
        return res.status(400).json({ error: 'No file or target savings value provided.' });
    }

    const file = req.files.file;
    const targetSavings = req.body.target_savings;

    const staticDir = path.join(__dirname, '../static');
    const uploadDir = path.join(__dirname, '../uploads');

    
    fs.mkdirSync(staticDir, { recursive: true });
    fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);

    
    file.mv(filePath, (err) => {
        if (err) {
            console.error("File upload failed:", err);
            return res.status(500).json({ error: 'File upload failed.' });
        }
        console.log("File uploaded successfully. Path:", filePath);

        const pythonScript = path.join(__dirname, '../transactions.py');
        const command = `python "${pythonScript}" "${filePath}" "${targetSavings}"`;

        console.log("Executing Python script:", command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({ error: `Error Processing file: ${stderr}` });
            }
        
            try {
                const results = JSON.parse(stdout.trim());
                return res.json(results);
            } catch (parseError) {
                return res.status(500).json({
                    error: 'Invalid response from Python script. Please check the script for issues.'
                });
            }
        });        
    });
};
