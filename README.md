# CatCafeProject

## Project overview
CatCafeProject is an API designed to facilitate automation testing for a Cat Café management system. It provides endpoints for managing cats, their staff, and adopters. It features a Swagger documentation for its endpoints.

## Prerequisites
- Node.js
- npm (Node Package Manager)

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/CodingRainbowCat/CatCafeProject.git
    ```
2. Navigate to the project directory:
    ```sh
    cd CatCafeProject
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Running the Project
To run the project, open the project in Visual Studio Code and execute the following command in the terminal:
```sh
npm run dev
```
After the server starts, you can access the Swagger interface by opening [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser.

### Authentication
The staff endpoints have JWT authentication, and uses a JWT secret. A JWT secret is a string used to sign and verify JSON Web Tokens (JWTs).  It's essential for ensuring that your JWTs are secure and can't be tampered with.
When you create a JWT, you use the secret to generate a signature. When a user sends the JWT back, your server uses the same secret to verify the signature.
You'll need to create a .env file with this variable set: "JWT_SECRET=". Use a long, random, and unpredictable string for the value.

To use the protected endpoints (the Staff ones) you must create an user with the /register endpoint. That way you'll have credentials for the /login endpoint, which will return a Token that you'll need to authenticate for the Staff endpoints.


To disable authentication (for development purposes), you can run the project with the DISABLE_AUTH environment variable:

Windows (PowerShell):
```sh
$env:DISABLE_AUTH="true"; npm run dev
```

Linux/Mac:
```sh
DISABLE_AUTH=true npm run dev
```

### Rate limit and Token expiration

The Login endpoint is set to accept up to 5 attempts. If you could not log in correctly after 5 attempts, you will be asked to wait 5 minutes.
These settings are set in the routes/authRoutes.ts file, under the loginLimiter constant.

The Access Token expiration is set to 15 minutes, and the expiration of the Refresh Token is set to 7 days.
These settings are set in the middleware/auth.ts file.


## Endpoints

### Auth
- `POST /auth/register` - Let you create a user to authenticate later
- `POST /auth/login` - Logs you in with a user and returns a Token, that you'll need for Staff endpoints
- `POST /auth/refresh` - When your token has expired (after 15 minutes), you can use this to get a new one so you don't need to log in again

### Cats
- `GET /cats` - Retrieve a list of all cats
- `POST /cats` - Add a new cat
- `GET /cats/:id` - Retrieve a specific cat by ID
- `PUT /cats/:id` - Update a specific cat by ID
- `DELETE /cats/:id` - Delete a specific cat by ID
- `PATCH /cats/:id` - Update the cat's staff in charge and/or its adopter by the cat's ID

### Staff (Auth required)
- `GET /staff` - Retrieve a list of all staff members
- `POST /staff` - Add a new staff member
- `GET /staff/:id` - Retrieve a specific staff member by ID
- `DELETE /staff/:id` - Delete a specific staff member by ID

### Adopters
- `GET /adpoters` - Retrieve a list of all adopters
- `POST /adopters` - Add a new adopter
- `GET /adopters/:id` - Retrieve a specific adopter by ID
- `DELETE /adopters/:id` - Delete a specific adopter by ID

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.
