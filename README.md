# Bus Management Application

## Requirements
To run the application locally, you need to start both the backend and frontend projects, as well as set up the database.

### Backend Setup (`bus-app-back`)
1. Ensure you have **Java** and **Spring Boot** installed.
2. **Clone the backend repository:**
   In your IDE terminal, clone the backend repository using the following command:
   ```sh
   git clone https://github.com/rafa2892/bus-app-back-deploy-version
   
3. **Navigate to the backend folder:**
   In your IDE terminal, navigate to the backend folder.
   ```sh
   cd bus-app-back-deploy-version
   ```
   
4. Configure the database connection in `application.properties`.                                                                                                                                                

5. Run the backend service:
   ```sh
   ./mvnw spring-boot:run
   ```
6. The backend should now be running on **http://localhost:8080**.

### Database Setup
1. Clone the database repository (if stored separately):
   ```sh
   git clone https://github.com/rafa2892/bus-app-BBDD
   ```
2. Import the database into **MySql**.
3. Ensure the backend is correctly connected to the database before proceeding.

### Frontend Setup (`bus-app-front`)
1. Ensure you have **Node.js** and **Angular CLI** installed.
2. Clone the frontend repository:
   ```sh
   git clone https://github.com/rafa2892/bus-app-front.git
   ```
3. Navigate to the frontend folder:
   ```sh
   cd bus-app-front
   ```
4. Install dependencies:
   ```sh
   npm install
   ```
5. Start the Angular application:
   ```sh
   ng serve
   ```
6. The frontend should now be accessible at **http://localhost:4200**.

### Summary
- **Backend:** `http://localhost:8080`
- **Frontend:** `http://localhost:4200`
- **Database:** PostgreSQL (configured in backend)

Once both the backend and frontend are running, you can access the bus management system and test its features.

