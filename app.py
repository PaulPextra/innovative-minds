from flask import (Flask,abort, session, render_template, jsonify, request, flash, redirect, url_for, current_app, session)
from functools import wraps
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from werkzeug.utils import secure_filename
from colorama import init, Fore, Back, Style
init(autoreset=True)
from flaskext.mysql import MySQL
import pymysql.cursors
import json
import os

app = Flask(__name__)

# Flask-Bcrypt and Flask-Login configuration
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

app.secret_key = os.getenv('SECRET_KEY')

# Database Configuration
app.config['MYSQL_DATABASE_HOST'] = os.getenv('DATABASE_HOST')
app.config['MYSQL_DATABASE_DB'] = os.getenv('DATABASE_DB')
app.config['MYSQL_DATABASE_USER'] = os.getenv('DATABASE_USER')
app.config['MYSQL_DATABASE_PASSWORD'] = os.getenv('DATABASE_PASSWORD')

# Initializing MySQL Database
mysql = MySQL(app, cursorclass = pymysql.cursors.DictCursor)

# Allowed extensions for image uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class User(UserMixin):
    def __init__(self, id, username, email, password, is_admin):
        self.id = id
        self.username = username
        self.email = email
        self.password = password
        self.is_admin = is_admin

@app.errorhandler(403)
def forbidden(e):
    
    return render_template('403.html'), 403

def is_admin():
    """Returns True if the current user is an admin."""
    return current_user.is_authenticated and current_user.is_admin

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            abort(403)
        return f(*args, **kwargs)
    return decorated_function

def get_user_by_id(id):
    # Query the database to get user details, including the is_admin field
    conn = mysql.get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE id = %s", (id,))
    user = cur.fetchone()
    cur.close()
    
    if user:
        return User(user['id'], user['username'], user['email'], user['password'], user['is_admin'])
    return None

def is_user_registered(email):
    """Check if the user is registered by looking for their email in the students table."""
    conn = mysql.get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM students WHERE Email = %s", (email,))
    student = cur.fetchone()
    cur.close()
    return student is not None  # Return True if the user is found in the students table

    
# User loader for flask-login
@login_manager.user_loader
def load_user(id):
    user_data = get_user_by_id(id)  # Function to query the database for the user
    
    if user_data:
        # Assuming user_data is an instance of the User class, access attributes via dot notation
        return user_data
    return None

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        # Password validation
        if password != confirm_password:
            flash("Passwords do not match", "flash_error")
            return render_template('signup.html')
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        try:
            conn = mysql.get_db()
            cur = conn.cursor()
            cur.execute('INSERT INTO users(email, username, password) VALUES (%s, %s, %s)', 
                        (email, username, hashed_password))
            conn.commit()
            flash("Account created successfully! Please log in.", "flash_success")
            return redirect(url_for('login'))
        except Exception as e:
            flash(f"Error creating a user account: {str(e)}", "flash_error")
            return render_template('signup.html')
    return render_template('signup.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        # Query database for user by email
        conn = mysql.get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if user and bcrypt.check_password_hash(user['password'], password):
            login_user(User(user['id'], user['username'], user['email'], user['password'], user['is_admin']))
            session['user_email'] = email
            flash('Login successful!', 'flash_success')
            return redirect(url_for('studentform'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'flash_error')

    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'flash_success')

    return redirect(url_for('login'))

@app.route('/')
def home():

    return render_template('home.html')


@app.route('/application/confirmation')
def application_confirmation():

    return render_template('confirmation.html')


@app.route('/services')
def services():
    
    return render_template('services.html')

@app.route('/portal/students')
@login_required
def studentform():
    if is_user_registered(current_user.email):
        flash('You have already registered and do not need to register again.', 'flash_info')
        return redirect(url_for('home'))
    return render_template('studentform.html')


@app.route('/portal/students/form', methods=['GET', 'POST'])
@login_required
def student_registration():
    print(f"{Style.RESET_ALL}")
    selected_courses = []  # Default: no courses selected

    if request.method == 'POST':
        test = True
        message = ""
        print(request.form)

        try:
            selected_courses = request.form.getlist('courses[]')
            print(selected_courses)  # Debug: Check if courses are correctly retrieved

            # Get form data
            firstName = request.form["firstName"]
            middleName = request.form["middleName"]
            lastName = request.form["lastName"]
            email = current_user.email  # Use the currently logged-in user's email
            dob = request.form["dob"]
            gender = request.form["gender"]
            phone = request.form["phone"]
            address = request.form["address"]
            state = request.form["state"]
            city = request.form["city"]
            emergencyContact = request.form["emergencyContact"]
            greScore = request.form["gre"]

            # Get image data
            if 'image' not in request.files:
                flash('No image part', 'flash_error')
            image = request.files["image"]
            if image.filename == '':
                flash('No selected file', 'flash_error')
            if image and allowed_file(image.filename):
                filename = secure_filename(image.filename)
                upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
                if not os.path.exists(upload_folder):
                    os.makedirs(upload_folder)
                filepath = os.path.join(upload_folder, filename)
                print(filepath)
                image.save(filepath)
            else:
                flash('Unsupported file type', 'flash_error')

            # Validate form data
            if firstName.strip() == '' or middleName.strip() == '' or lastName.strip() == '' or email.strip() == '' or dob.strip() == '' or gender.strip() == '' or phone.strip() == '' or address.strip() == '' or state.strip() == '' or city.strip() == '' or emergencyContact.strip() == '' or greScore.strip() == '' or filename.strip() == '':
                test = False
                flash('Please fill in all fields to register a student', 'flash_error')
            elif not greScore.isnumeric():
                test = False
                flash('GRE Score must be numeric', 'flash_error')

            if test:
                try:
                    # Insert student record
                    conn = mysql.get_db()
                    cur = conn.cursor()
                    cur.execute('INSERT INTO students (FirstName, MiddleName, LastName, Email, DOB, Gender, Phone, Address, State, City, Emergency_Contact, Gre_Score, Image) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', 
                                (firstName, middleName, lastName, email, dob, gender, phone, address, state, city, emergencyContact, greScore, filename))
                    student_id = cur.lastrowid  # Get the ID of the newly inserted student

                    # Collect selected courses and insert into the student_courses table
                    selected_courses = request.form.getlist('courses[]')
                    print(request.form)
                    print(selected_courses)
                    for course_id in selected_courses:
                        cur.execute('INSERT INTO student_courses (student_id, course_id) VALUES (%s, %s)', (student_id, course_id))
                    conn.commit()
                    cur.close()
                    flash('Student registration successful, including course selection!', 'flash_success')
                    return json.dumps('success')
                except Exception as e:
                    test = False
                    message = f"Database error: {str(e)}"
                    print(f"{Back.RED}Error while processing the request: {str(e)}{Style.RESET_ALL}")

        except Exception as e:
            test = False
            message = f"Error processing the request: {str(e)}"
            print(f"{Back.RED}Error while processing the request: {str(e)}{Style.RESET_ALL}")

        finally:
            if test:
                return jsonify({
                    "status": "success",
                    "message": "Successfully registered user!"
                })
            else:
                return jsonify({
                    "status": "fail",
                    "message": message
                })

    cur.close()
    return render_template('studentform.html', selected_courses=selected_courses)


@app.route('/admin/dashboard')
@admin_required  # Restrict this route to admin users
def admin_dashboard():
    conn = mysql.get_db()
    cur = conn.cursor()
    cur.execute('select * from students')
    rv = cur.fetchall()
    cur.close()
    
    return render_template('dashboard.html', students=rv)


@app.route('/admin/dashboard', methods=['POST'])
@admin_required  # Restrict this route to admin users
def student_search():
    data = request.json
    name = data.get("name", '')
    status = data.get("status", '')
    gender = data.get("gender", '')
    greScore = data.get("greScore", 0)

    conn = mysql.get_db()
    cur = conn.cursor()
    query = "SELECT * FROM students WHERE (FirstName LIKE %s OR LastName LIKE %s OR MiddleName LIKE %s) AND Admission_Status LIKE %s AND Gender LIKE %s AND Gre_Score >= %s"
    cur.execute(query, ('%' + name + '%', '%' + name + '%', '%' + name + '%', status, gender, greScore))
    rv = cur.fetchall()
    cur.close()

    return json.dumps('success')


@app.route('/portal/students/<int:id>')
@admin_required  # Restrict this route to admin users
def student_profile(id):
    conn = mysql.get_db()
    cur = conn.cursor()

    # Get student information
    cur.execute('SELECT * FROM students WHERE ID = %s', (id,))
    student = cur.fetchone()

    # Get courses the student is enrolled in
    cur.execute('SELECT c.course_name FROM student_courses sc JOIN courses c ON sc.course_id = c.course_id WHERE sc.student_id = %s', (id,))
    student_courses = cur.fetchall()
    cur.close()

    if student:
        return render_template('detail.html', profile=student, courses=student_courses)
    else:
        return "Student not found", 404


@app.route('/portal/students/<int:id>', methods=['POST'])
@admin_required  # Restrict this route to admin users
def change_status(id):
    print(f"{Style.RESET_ALL}")
    test = True
    try:
        status = request.json["status"]
        # validate form data
        if(status.strip() == ""):
            test = False
        if test:
            try:
                connection = mysql.get_db()
                cursor = connection.cursor()
                cursor.execute("UPDATE students SET Admission_Status = %s WHERE ID = %s", (status, id))
                connection.commit()
                connection.close()

                return json.dumps('success')
            except Exception:
                test = False
                print(f"{Back.RED}Update error: Was not able to update to table!{Style.RESET_ALL}")
    except Exception:
        test = False
        print(f"{Back.RED}Error while processing the request!{Style.RESET_ALL}")
    finally:
        if test:
            return jsonify({"status": "success"})
        else:
            message = f"Error did not update table!"
            return jsonify({
                "status": "fail",
                "message": message
            })


# Running the app
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5050, debug=True) 