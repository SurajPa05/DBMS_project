from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import bcrypt
import jwt
from datetime import datetime, timedelta
from dateutil import parser
from functools import wraps
import os

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
DB_CONFIG = {
    'host': 'localhost',
    'database': 'event_management',
    'user': 'root',
    'password': 'root'  # Change this to your MySQL password
}

def get_db_connection():
    """Create and return a database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def token_required(f):
    """Decorator to require JWT token for protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'participant')
        
        if not all([name, email, password]):
            return jsonify({'message': 'Name, email, and password are required'}), 400
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT user_id FROM Users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'message': 'User already exists'}), 409
        
        # Insert new user
        cursor.execute(
            "INSERT INTO Users (name, email, password_hash, role) VALUES (%s, %s, %s, %s)",
            (name, email, password_hash, role)
        )
        connection.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Error as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'message': 'Email and password are required'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user['user_id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'user_id': user['user_id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200
        
    except Error as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/events', methods=['GET'])
def get_events():
    """Get all events"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT e.*, u.name as creator_name,
                   COUNT(r.reg_id) as registration_count
            FROM Events e
            LEFT JOIN Users u ON e.created_by = u.user_id
            LEFT JOIN Registrations r ON e.event_id = r.event_id
            GROUP BY e.event_id
            ORDER BY e.event_date ASC
        """)
        events = cursor.fetchall()
        
        # Convert datetime objects to strings
        for event in events:
            if event['event_date']:
                event['event_date'] = event['event_date'].isoformat()
            if event['created_at']:
                event['created_at'] = event['created_at'].isoformat()
        
        return jsonify(events), 200
        
    except Error as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/events', methods=['POST'])
@token_required
def create_event(current_user_id):
    """Create a new event"""
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        location = data.get('location')
        event_date = data.get('event_date')
        
        if not all([title, event_date]):
            return jsonify({'message': 'Title and event date are required'}), 400
        
        # Convert ISO datetime to MySQL format
        try:
            parsed_date = parser.parse(event_date)
            event_date = parsed_date.strftime('%Y-%m-%d %H:%M:%S')
        except ValueError:
            return jsonify({'message': 'Invalid date format'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO Events (title, description, location, event_date, created_by) VALUES (%s, %s, %s, %s, %s)",
            (title, description, location, event_date, current_user_id)
        )
        connection.commit()
        
        return jsonify({'message': 'Event created successfully'}), 201
        
    except Error as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
@token_required
def delete_event(current_user_id, event_id):
    """Delete an event (only creator or admin)"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Check if user is admin or event creator
        cursor.execute("SELECT role FROM Users WHERE user_id = %s", (current_user_id,))
        user = cursor.fetchone()
        
        cursor.execute("SELECT created_by FROM Events WHERE event_id = %s", (event_id,))
        event = cursor.fetchone()
        
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        
        if user['role'] != 'admin' and event['created_by'] != current_user_id:
            return jsonify({'message': 'Unauthorized to delete this event'}), 403
        
        cursor.execute("DELETE FROM Events WHERE event_id = %s", (event_id,))
        connection.commit()
        
        return jsonify({'message': 'Event deleted successfully'}), 200
        
    except Error as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/events/<int:event_id>/register', methods=['POST'])
@token_required
def register_for_event(current_user_id, event_id):
    """Register user for an event"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        
        # Check if event exists
        cursor.execute("SELECT event_id FROM Events WHERE event_id = %s", (event_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Event not found'}), 404
        
        # Check if already registered
        cursor.execute("SELECT reg_id FROM Registrations WHERE user_id = %s AND event_id = %s", 
                      (current_user_id, event_id))
        if cursor.fetchone():
            return jsonify({'message': 'Already registered for this event'}), 409
        
        # Register user
        cursor.execute(
            "INSERT INTO Registrations (user_id, event_id) VALUES (%s, %s)",
            (current_user_id, event_id)
        )
        connection.commit()
        
        return jsonify({'message': 'Successfully registered for event'}), 201
        
    except Error as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/events/<int:event_id>/unregister', methods=['DELETE'])
@token_required
def unregister_from_event(current_user_id, event_id):
    """Unregister user from an event"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        
        cursor.execute(
            "DELETE FROM Registrations WHERE user_id = %s AND event_id = %s",
            (current_user_id, event_id)
        )
        connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'message': 'Registration not found'}), 404
        
        return jsonify({'message': 'Successfully unregistered from event'}), 200
        
    except Error as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/user/events', methods=['GET'])
@token_required
def get_user_events(current_user_id):
    """Get events registered by current user"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT e.*, u.name as creator_name, r.registered_at
            FROM Events e
            JOIN Registrations r ON e.event_id = r.event_id
            LEFT JOIN Users u ON e.created_by = u.user_id
            WHERE r.user_id = %s
            ORDER BY e.event_date ASC
        """, (current_user_id,))
        events = cursor.fetchall()
        
        # Convert datetime objects to strings
        for event in events:
            if event['event_date']:
                event['event_date'] = event['event_date'].isoformat()
            if event['created_at']:
                event['created_at'] = event['created_at'].isoformat()
            if event['registered_at']:
                event['registered_at'] = event['registered_at'].isoformat()
        
        return jsonify(events), 200
        
    except Error as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
