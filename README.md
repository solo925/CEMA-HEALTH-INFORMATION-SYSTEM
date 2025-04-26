# Health Information System

A robust application for managing clients and health programs, built with React (TypeScript) and Django REST Framework.

## Features

- **Client Management:** Register, search, and view client profiles
- **Health Program Management:** Create and manage health programs
- **Program Enrollment:** Enroll clients in multiple health programs
- **Dashboard:** Analytics and quick access to important information
- **RESTful API:** Exposes client profiles and program data via API
- **Security:** JWT authentication, data encryption, and robust security measures

## Technology Stack

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Material UI component library
- React Router for navigation
- RTK Query for API data fetching

### Backend
- Django and Django REST Framework
- PostgreSQL database
- JWT authentication
- Swagger/OpenAPI documentation

### DevOps
- Docker and Docker Compose
- GitHub Actions for CI/CD
- NGINX for production deployment

## Screenshots

![Dashboard](https://via.placeholder.com/800x450.png?text=Dashboard+Screenshot)
![Client Profile](https://via.placeholder.com/800x450.png?text=Client+Profile+Screenshot)
![Program Management](https://via.placeholder.com/800x450.png?text=Program+Management+Screenshot)

## Installation and Setup

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)
- Docker and Docker Compose (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/health-info-system.git
   cd health-info-system
   ```

2. **Backend Setup**
   ```bash
   cd server
   
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Create a .env file
   cp .env.example .env
   # Edit .env file with your settings
   
   # Apply migrations
   python manage.py migrate
   
   # Create superuser
   python manage.py createsuperuser
   
   # Run server
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd client
   
   # Install dependencies
   npm install
   
   # Create a .env file
   cp .env.example .env
   # Edit .env file with your settings
   
   # Run development server
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/v1
   - Admin interface: http://localhost:8000/admin
   - API documentation: http://localhost:8000/api/v1/swagger/

### Docker Setup

For a containerized development or production environment:

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## Project Structure

```
health-info-system/
├── client/                   # React frontend
│   ├── public/               # Static files
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   ├── constants/        # Constants
│   │   ├── types/            # TypeScript types
│   │   ├── HOC/              # Higher-Order Components
│   │   └── theme/            # UI theming
├── server/                   # Django backend
│   ├── api/                  # Django app
│   ├── core/                 # Core settings
│   ├── utils/                # Utility functions
│   └── manage.py             # Django management script
├── docker-compose.yml        # Docker Compose configuration
├── docker-compose.prod.yml   # Production Docker configuration
├── .github/                  # GitHub Actions workflows
├── docs/                     # Documentation
└── README.md                 # This file
```

## API Documentation

The API documentation is available at:
- Swagger UI: `/api/v1/swagger/`
- ReDoc: `/api/v1/redoc/`

## Key Features in Detail

### Client Management
- Registration of new clients with complete profiles
- Advanced search functionality
- Detailed client profiles
- Edit client information

### Health Program Management
- Create health programs with detailed information
- Track program statistics
- Manage program capacity and status

### Program Enrollment
- Enroll clients in multiple health programs
- Track enrollment status
- View enrollment history

### Performance Optimizations
- Code splitting for faster loading
- React.memo for component memoization
- useCallback and useMemo for function memoization
- Debouncing and throttling for search operations
- Optimized API queries

### Security Features
- JWT authentication with refresh token mechanism
- Content Security Policy implementation
- Rate limiting to prevent abuse
- Input validation and sanitization
- Sensitive data encryption
- CSRF protection

## Deployment

### Production Deployment
1. Set up environment variables for production
2. Build Docker images: `docker-compose -f docker-compose.prod.yml build`
3. Start services: `docker-compose -f docker-compose.prod.yml up -d`

### Continuous Integration/Continuous Deployment
The project includes GitHub Actions workflows for:
- Running tests on pull requests
- Deploying to production on merge to main branch

## Testing

### Backend Tests
```bash
cd server
python manage.py test
```

### Frontend Tests
```bash
cd client
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Roadmap

- Mobile application support
- Advanced reporting and analytics
- Email notifications
- Integration with other healthcare systems
- Patient portal for self-service

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material UI for the component library
- Django REST Framework for the API framework
- All contributors who have helped with the project