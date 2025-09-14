# Event Management System Backend

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

2. **Configure MySQL Database**
   - Make sure MySQL is running on your system
   - Update the `DB_CONFIG` in `app.py` with your MySQL credentials
   - Run the SQL scripts in the `scripts/` folder to create the database and tables

3. **Run the Application**
   \`\`\`bash
   python app.py
   \`\`\`

The API will be available at `http://localhost:5000`

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (requires auth)
- `DELETE /api/events/<id>` - Delete event (requires auth)
- `POST /api/events/<id>/register` - Register for event (requires auth)
- `DELETE /api/events/<id>/unregister` - Unregister from event (requires auth)
- `GET /api/user/events` - Get user's registered events (requires auth)

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
