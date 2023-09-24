# Node Clean Architecture

This project is an example of implementing clean architecture in Node.js, focusing on Facebook authentication.

## Architecture

The project adheres to the principles of Clean Architecture, dividing the code into different layers:

- **Application**: Contains the controllers and application logic.
- **Domain**: Defines the entities, errors, and interfaces for authentication.
- **Data**: Implements services and repositories for interaction with APIs and databases.
- **Infra**: Holds infrastructure implementations, such as data access and external APIs.

## Design Patterns

- **Dependency Injection**: Used to inject dependencies, promoting looser coupling and facilitating testing.
- **Repository Pattern**: Applied to abstract the data access layer, allowing for the substitution of repository implementations.

## Testing

The project includes unit tests to validate the behavior of the different layers and services.

## Usage

To run the project, follow these steps:

1. Clone the repository
2. Install the dependencies with `npm install`
3. Run the project with `npm start`

