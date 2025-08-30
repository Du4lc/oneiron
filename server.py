from flask import Flask, render_template, url_for
import os

app= Flask(__name__, static_folder="static", template_folder="templates")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/<file_name>")
def show_file(file_name):
    return render_template(file_name)




#Starts the server
if __name__=="__main__":
    # En dev, sin caché de estáticos para evitar “¿por qué no cambia?”
    app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
    app.run(debug=True) 



    