# Role-Based App

A React application with role-based access control and features.

## Features

### Role-Based Access Control
- **Member Users**: Full access to social features, training tracking, and dojo interactions
- **Partner Users**: Limited access to business analytics, revenue tracking, and location management

### Member Features
- Member profiles and connections
- Direct messaging and group chats
- Training progress tracking
- Dojo check-ins and reviews
- Social notifications for interactions

### Partner Features
- Analytics dashboard with member statistics
- Revenue tracking and reporting
- Location management tools
- Business-specific notifications
- No access to member interactions

## Architecture

### Component Structure
- Base components for shared functionality
- Role-specific wrappers to enforce restrictions
- Type-safe implementation with TypeScript

### Context Providers
- **Members**:
  - ConnectionsProvider for social features
  - ChatProvider for messaging
  - NotificationProvider for social notifications

- **Partners**:
  - PartnerNotificationProvider for business alerts
  - Restricted from social contexts

### Routing
- Role-based route restrictions
- Automatic redirection based on user role
- Protected routes for sensitive features

## Development

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration
```

## Security

### Access Control
- Route-level restrictions
- Context-level restrictions
- Component-level restrictions
- Type-safe implementation

### Data Access
- Role-based data filtering
- Aggregate data for partners
- Individual data for members

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
