from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/register")
def register():
    return render_template("register.html")

from datetime import datetime

@app.route("/dashboard")
def dashboard():
    files = []

    for filename in os.listdir(app.config["UPLOAD_FOLDER"]):
        path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        files.append({
            "name": filename,
            "size": round(os.path.getsize(path) / 1024, 2),   # KB
            "date": datetime.fromtimestamp(os.path.getmtime(path)).strftime("%d-%m-%Y %H:%M")
        })

    return render_template("dashboard.html", files=files)

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return redirect(url_for("dashboard"))

    file = request.files["file"]

    if file.filename != "":
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], file.filename))

    return redirect(url_for("dashboard"))

@app.route("/download/<filename>")
def download(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename, as_attachment=True)

@app.route("/delete/<filename>")
def delete(filename):
    path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    if os.path.exists(path):
        os.remove(path)

    return redirect(url_for("dashboard"))

@app.route("/features")
def features():
    return render_template("features.html")


if __name__ == "__main__":
    app.run(debug=True)