from flask import Flask, render_template

import os

app= Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/<file_name>")
def show_file(file_name):
    return render_template(file_name)




#Starts the server
if __name__=="__main__":
    app.run(debug=True) 