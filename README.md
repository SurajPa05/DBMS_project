# Event Management System

A complete full-stack Event Management System built for DBMS lab with modern technologies.

## 🚀 Features

- **User Authentication**: Secure login/register with JWT tokens
- **Event Management**: Create, view, edit, and delete events
- **Event Registration**: Register/unregister for events with real-time updates
- **Role-based Access**: Admin and participant roles with different permissions
- **Responsive Design**: Modern, clean UI that works on all devices
- **Real-time Updates**: Live registration counts and status updates

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for components and theming
- **React Router** for navigation
- **Axios** for API calls
- **Day.js** for date handling

### Backend
- **Python Flask** with REST API
- **MySQL** database with proper relationships
- **JWT** authentication
- **bcrypt** for password hashing
- **CORS** enabled for frontend integration

### Database
- **MySQL** with three main tables:
  - Users (authentication and roles)
  - Events (event information)
  - Registrations (user-event relationships)

## 📁 Project Structure

\`\`\`
event-management-system/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts (Auth, Snackbar)
│   │   ├── services/       # API service functions
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # Flask Python application
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── README.md
└── scripts/                # Database setup scripts
    ├── 01-create-database.sql
    └── 02-seed-data.sql
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MySQL Server

### Backend Setup

1. **Install Python dependencies**
   \`\`\`bash
   cd backend
   pip install -r requirements.txt
   \`\`\`

2. **Setup MySQL Database**
   - Start your MySQL server
   - Run the SQL scripts in the \`scripts/\` folder:
     \`\`\`sql
     mysql -u root -p < scripts/01-create-database.sql
     mysql -u root -p < scripts/02-seed-data.sql
     \`\`\`

3. **Configure Database Connection**
   - Edit \`backend/app.py\`
   - Update the \`DB_CONFIG\` with your MySQL credentials

4. **Start the Flask server**
   \`\`\`bash
   python app.py
   \`\`\`
   Server will run on \`http://localhost:5000\`

### Frontend Setup

1. **Install Node.js dependencies**
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

2. **Configure API URL (optional)**
   - Copy \`.env.example\` to \`.env\`
   - Update \`REACT_APP_API_URL\` if needed

3. **Start the React development server**
   \`\`\`bash
   npm start
   \`\`\`
   Application will open at \`http://localhost:3000\`

## 📱 Usage

1. **Register/Login**: Create an account or use sample credentials
2. **Browse Events**: View all available events on the Events page
3. **Create Events**: Use the "Create Event" button (requires login)
4. **Register for Events**: Click "Register" on any upcoming event
5. **Manage Events**: View your registered and created events in "My Events"
6. **Admin Features**: Admins can delete any event

## 🎨 Design Features

- **Modern UI**: Clean, minimal design with Material-UI components
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Consistent Theming**: Soft color palette with excellent contrast
- **User Feedback**: Toast notifications for all actions

## 🔧 API Endpoints

- \`POST /api/register\` - Register new user
- \`POST /api/login\` - User login
- \`GET /api/events\` - Get all events
- \`POST /api/events\` - Create new event (auth required)
- \`DELETE /api/events/<id>\` - Delete event (auth required)
- \`POST /api/events/<id>/register\` - Register for event (auth required)
- \`DELETE /api/events/<id>/unregister\` - Unregister from event (auth required)
- \`GET /api/user/events\` - Get user's registered events (auth required)

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- SQL injection prevention with parameterized queries
- CORS configuration for secure frontend-backend communication

## 📝 License

This project is created for educational purposes as part of a DBMS lab assignment.
\`\`\`
