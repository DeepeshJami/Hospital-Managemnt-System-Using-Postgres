# Hospital Management System Using Postgres

This Hospital Management System is designed to streamline the administrative and clinical workflows of a hospital. It utilizes a PostgreSQL database for data storage.

## Features

- Patient Management: Register, update, and view patient information.
- Doctor Management: Manage doctor details, specializations, and schedules.
- Appointment System: Schedule and manage appointments between patients and doctors.
- Report Generation: Generate reports for patient records and appointments.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Frontend**: HTML, CSS, JavaScript (or any frontend framework of your choice)

## Setup Instructions

### 1. Database Setup

1. Install PostgreSQL on your system.
2. Create a new database named `HMS`:

    ```sql
    CREATE DATABASE HMS;
    ```

3. Import the database schema and sample data from the provided dump file:

    ```bash
    pg_restore -U postgres -h localhost -d HMS -p 5432 -W -c -F c -v -d path/to/database_dump.dump
    ```

### 2. Backend Setup

1. Install Node.js and npm.
2. Install project dependencies:

    ```bash
    npm install
    ```

3. Configure the database connection in `server.js`:

    ```javascript
    const pool = new Pool({
      user: 'your_username',
      host: 'localhost',
      database: 'HMS',
      password: 'your_password',
      port: 5432,
    });
    ```

### 3. Frontend Setup

1. Open the `index.html` file and configure any frontend settings, if necessary.

### 4. Run the Application

1. Start the Node.js server:

    ```bash
    node server.js
    ```

2. Open your web browser and navigate to `http://localhost:3000` to access the Hospital Management System.

## Contributing

Feel free to contribute to the project by opening issues or submitting pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
Created By Deepesh Jami.
