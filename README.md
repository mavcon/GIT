# Role-Based App

A React TypeScript application with role-based access control and various features including member management, dojo management, and Google Maps integration.

## Project Structure

```
role-based-app/
├── public/           # Static files
├── src/             # Source code
│   ├── components/  # React components
│   │   ├── common/  # Shared components
│   │   ├── dojos/   # Dojo-related components
│   │   └── members/ # Member-related components
│   ├── context/     # React context providers
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components
│   ├── services/    # API and utility services
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
└── .env             # Environment variables
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/mavcon/GIT.git
cd role-based-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example` and configure your environment variables.

4. Start the development server:
```bash
npm start
```

## Collaboration Guidelines

### Git Workflow

1. Always pull the latest changes before starting work:
```bash
git pull origin master
```

2. Create a feature branch for your work:
```bash
git checkout -b feature/your-feature-name
```

3. Make your changes and commit them with descriptive messages:
```bash
git add .
git commit -m "feat: description of your changes"
```

4. Push your changes and create a pull request:
```bash
git push origin feature/your-feature-name
```

### Commit Message Format

Follow the conventional commits specification:
- feat: A new feature
- fix: A bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code changes that neither fix bugs nor add features
- test: Adding or modifying tests
- chore: Changes to build process or auxiliary tools

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Keep components small and focused
- Use proper naming conventions

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Include integration tests where necessary

## Available Scripts

- `npm start`: Run development server
- `npm test`: Run tests
- `npm run build`: Build for production
- `npm run lint`: Run linter
- `npm run format`: Format code

## Dependencies

- React
- TypeScript
- Tailwind CSS
- Google Maps API
- Other major dependencies...

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
