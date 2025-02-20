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

## API Endpoints
- `GET /cats` - Retrieve a list of all cats
- `POST /cats` - Add a new cat
- `GET /cats/:id` - Retrieve a specific cat by ID
- `PUT /cats/:id` - Update a specific cat by ID
- `DELETE /cats/:id` - Delete a specific cat by ID
- `PATCH /cats/:id` - Update the cat's staff in charge and/or its adopter by the cat's ID
- `GET /staff` - Retrieve a list of all staff members
- `POST /staff` - Add a new staff member
- `GET /staff/:id` - Retrieve a specific staff member by ID
- `DELETE /staff/:id` - Delete a specific staff member by ID
- `GET /adpoters` - Retrieve a list of all adopters
- `POST /adopters` - Add a new adopter
- `GET /adopters/:id` - Retrieve a specific adopter by ID
- `DELETE /adopters/:id` - Delete a specific adopter by ID

The staff endpoints have basic authentication. The credentials to use them are:

```sh
User: admin
Password: password
```

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.
