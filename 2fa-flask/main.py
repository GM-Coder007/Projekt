import os
from flask import Flask, flash, request, redirect, url_for, jsonify, Response
from werkzeug.utils import secure_filename
import jwt
import time
from dotenv import load_dotenv
import uuid

from model import train, is_trained, predict

load_dotenv()

# from flask_jwt_extended import create_access_token
# from flask_jwt_extended import get_jwt_identity
# from flask_jwt_extended import jwt_required
# from flask_jwt_extended import JWTManager

MAX_FILE_SIZE = 16 * 1000 * 1000
UPLOAD_FOLDER = 'uploads'
ALLOWED_VIDEO_EXTENSIONS = {'mp4'}
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}

ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
ACCESS_TOKEN_EXPIRE = os.getenv('ACCESS_TOKEN_EXPIRE')
COOKIE_DOMAIN = os.getenv('COOKIE_DOMAIN')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE
# app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
# jwt = JWTManager(app)

folders_created = False


def decode_jwt(token):
    try:
        return jwt.decode(token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])
    except:
        return None


def allowed_file(filename, extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in extensions


@app.route('/video', methods=['POST'])
def upload_file():
    if not folders_created:
        create_folders()
    token = request.cookies.get('token')
    if not token:
        return jsonify({'msg': 'No token'}), 403

    decoded = decode_jwt(token)
    if not decoded:
        return jsonify({'msg': 'Invalid token'}), 403

    user_id = decoded['sub']

    # check if the post request has the file part
    if 'file' not in request.files:
        return jsonify(msg="No file part"), 400
    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify(msg="No selected file"), 400
    if file and allowed_file(file.filename, ALLOWED_VIDEO_EXTENSIONS):
        filename = secure_filename(file.filename)
        file_name, file_extension = os.path.splitext(filename)
        full_path = os.path.join(
            app.config['UPLOAD_FOLDER'], "videos", user_id + file_extension)
        file.save(full_path)
        # (url_for('download_file', name=filename))
        train(user_id)
        return jsonify(msg="Model trained successfully")
    return jsonify(msg="File not allowed"), 400


@app.route('/twofa', methods=['POST'])
def twofa():
    if not folders_created:
        create_folders()
    token = request.cookies.get('token')
    if not token:
        return jsonify({'msg': 'No token'}), 403

    decoded = decode_jwt(token)
    if not decoded:
        return jsonify({'msg': 'Invalid token'}), 403

    user_id = decoded['sub']

    set_cookie = request.args.get("setCookie", default=False, type=bool)

    if not os.path.exists(os.path.join("models", user_id + ".pickle")):
        return jsonify(msg="Model not trained"), 400

    # check if the post request has the file part
    if 'file' not in request.files:
        return jsonify(msg="No file part"), 400
    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify(msg="No selected file"), 400
    if file and allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS):
        filename = secure_filename(file.filename)
        file_name, file_extension = os.path.splitext(filename)
        full_path = os.path.join(
            app.config['UPLOAD_FOLDER'], "images", user_id)

        if not os.path.exists(full_path):
            os.makedirs(full_path)

        full_path = os.path.join(full_path, uuid.uuid4().hex + file_extension)

        file.save(full_path)
        # (url_for('download_file', name=filename))
        if predict(user_id, full_path):
            return send_token(user_id, set_cookie)
        else:
            return jsonify(msg="Your face was not recognized"), 403
    return jsonify(msg="File not allowed"), 400


# @app.route('/token')
def send_token(user_id, set_cookie=False):
    # user_id = "629bd66142db259699494f69"
    timestamp = int(time.time())
    expire = timestamp + int(ACCESS_TOKEN_EXPIRE)
    access_token = jwt.encode(
        {"sub": user_id, "twofa": True, "iat": timestamp, "exp": expire}, ACCESS_TOKEN_SECRET, algorithm="HS256")
    res = jsonify(token=access_token, twofa=True)
    if set_cookie:
        res.set_cookie('token', access_token, max_age=expire,
                       httponly=True, samesite='Strict', domain=COOKIE_DOMAIN)
    return res


def create_folders():
    if not os.path.exists(os.path.join(UPLOAD_FOLDER, "images")):
        os.makedirs(os.path.join(UPLOAD_FOLDER, "images"))
    if not os.path.exists(os.path.join(UPLOAD_FOLDER, "videos")):
        os.makedirs(os.path.join(UPLOAD_FOLDER, "videos"))
    if not os.path.exists("models"):
        os.makedirs("models")
    folders_created = True


if __name__ == "__main__":
    app.run(host='0.0.0.0')
