const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from the current directory


const pool = new Pool({
    user: 'postgres', // Replace with your postgres username
    host: 'localhost', // Typically 'localhost' if your database is on your local machine
    database: 'HMS', // Replace with your database name
    password: '8123', // Replace with your database password
    port: 5432, // The default port for PostgreSQL
});

app.post('/api/add-patient', async (req, res) => {
    const { patientid, name, age, gender, address, dob, ssn, bloodtype, primaryphysicianid } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Patients (patientid, name, age, gender, address, dob, ssn, bloodtype, primaryphysicianid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', 
            [patientid, name, age, gender, address, dob, ssn, bloodtype, primaryphysicianid]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to get all patients
app.get('/api/get-patients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Patients');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to schedule an appointment
app.post('/api/schedule-appointment', async (req, res) => {
    const { appointmentid, patientID, doctorID, appointmentDate, appointmentTime, reason } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Appointments (appointmentid, PatientID, DoctorID, AppointmentDate, AppointmentTime, Reason) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
            [appointmentid, patientID, doctorID, appointmentDate, appointmentTime, reason]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to add a diagnosis
app.post('/api/add-diagnosis', async (req, res) => {
    const { patientID, doctorID, diagnosisDate, details, treatment } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Diagnosis (PatientID, DoctorID, DiagnosisDate, DiagnosisDetails, Treatment) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [patientID, doctorID, diagnosisDate, details, treatment]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to get diagnosis data for a patient
app.get('/api/get-diagnosis/:patientid', async (req, res) => {
    const { patientid } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Diagnosis WHERE patientid = $1', [patientid]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/api/add-employee', async (req, res) => {
    const { empid, name, phone, address, gender, ssn, salary, jobtype} = req.body;
    try {
        await pool.query('INSERT INTO Employee (EmpID, Name, Phone, Address, Gender, SSN, Salary, jobtype) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
        [empid, name, phone, address, gender, ssn, salary, jobtype]);
        res.json({ message: 'Employee added' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.delete('/api/remove-employee/:empid', async (req, res) => {
    const { empid } = req.params;
    try {
        await pool.query('DELETE FROM Employee WHERE EmpID = $1', [empid]);
        res.json({ message: 'Employee removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/get-employees/:jobtype', async (req, res) => {
    const { jobtype } = req.params;
    let query = 'SELECT * FROM Employee';
    if (jobtype !== 'all') {
        query += ` WHERE JobType = '${jobtype}'`;
    }
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/rooms/:filter', async (req, res) => {
    const { filter } = req.params;
    let query = 'SELECT * FROM Rooms';
    if (filter === 'occupied') {
        query += ' WHERE IsOccupied = TRUE';
    } else if (filter === 'unoccupied') {
        query += ' WHERE IsOccupied = FALSE';
    }
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// Endpoint for assigning a patient to a room
app.post('/api/assign-room', async (req, res) => {
    const { patientid, roomid } = req.body;
    try {
        await pool.query('UPDATE Rooms SET IsOccupied = TRUE, PatientID = $1 WHERE RoomID = $2', [patientid, roomid]);
        res.json({ message: 'Patient assigned to room' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint for removing a patient from a room
app.post('/api/remove-patient/:roomid', async (req, res) => {
    const { roomid } = req.params;
    try {
        await pool.query('UPDATE Rooms SET IsOccupied = FALSE, PatientID = NULL WHERE RoomID = $1', [roomid]);
        res.json({ message: 'Patient removed from room' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/api/update-primary-physician', async (req, res) => {
    const { patientid, doctorid } = req.body;
    try {
        await pool.query('UPDATE Patients SET PrimaryPhysicianID = $1 WHERE PatientID = $2', [doctorid, patientid]);
        res.json({ message: 'Primary physician updated' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/api/remove-primary-physician/:patientid', async (req, res) => {
    const { patientid } = req.params;
    try {
        await pool.query('UPDATE Patients SET PrimaryPhysicianID = NULL WHERE PatientID = $1', [patientid]);
        res.json({ message: 'Primary physician removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});




const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
