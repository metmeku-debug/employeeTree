# Employee Tree

This project is an Employee Tree application built with Angular. It allows users to add, delete, and update employees in a hierarchical tree structure. The tree has drag-and-drop functionality and uses Firebase as the backend. The application also utilizes the NG-ZORRO library for the tree component.

## Features

- **Add Employee**: Add new employees to the tree.
- **Delete Employee**: Remove employees from the tree.
- **Update Employee**: Update employee details.
- **Drag and Drop**: Reorganize the tree structure using drag-and-drop.
- **Firebase Backend**: Store and retrieve data from Firebase.
- **NG-ZORRO Tree**: Utilize NG-ZORRO library for the tree component.

## Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/perago-angular.git
  ```
2. Navigate to the project directory:
  ```bash
  cd perago-angular
  ```
3. Install dependencies:
  ```bash
  npm install
  ```

## Usage

1. Start the development server:
  ```bash
  ng serve
  ```
2. Open your browser and navigate to `http://localhost:4200`.

## Configuration

1. Set up your Firebase project and obtain the configuration details.
2. Update the Firebase configuration in `src/environments/environment.ts`:
  ```typescript
  export const environment = {
    production: false,
    firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
    }
  };
  ```


## License

This project is licensed under the MIT License.

