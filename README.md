# DojoLibre

A React-based web application for managing martial arts dojos, members, and training sessions.

## Features

- Interactive dojo map with real-time status
- Member profiles and connections
- Training session management
- Real-time notifications
- Responsive design with dark mode support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd role-based-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Google Maps API key:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

## IDE Setup

### VS Code
1. Install recommended extensions:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
2. Use workspace settings from `.vscode/settings.json`
3. Install project dependencies
4. Start the development server

### WebStorm/IntelliJ IDEA
1. Open the project folder
2. Install TypeScript from npm (if not already installed)
3. Configure the TypeScript compiler:
   - Use project version of TypeScript
   - Enable TSLint/ESLint integration
4. Install project dependencies
5. Start the development server

### Other IDEs
1. Ensure TypeScript support is enabled
2. Configure ESLint integration
3. Set up Prettier for code formatting
4. Install project dependencies
5. Start the development server

## Project Structure

```
role-based-app/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   │   ├── common/       # Shared components
│   │   ├── dojos/       # Dojo-related components
│   │   └── members/     # Member-related components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API and utility services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── .env                   # Environment variables
├── .env.example          # Example environment variables
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## Environment Variables

Required environment variables:

- `REACT_APP_GOOGLE_MAPS_API_KEY`: Google Maps API key for the interactive map

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
