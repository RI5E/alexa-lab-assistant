from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/instructors")
def instructors():
    return render_template("instructors.html")


@app.route("/test/<string:name>")
def test(name):
    return render_template("test.html", name=name)

@app.route("/create")
def create():
    return render_template("create.html")

if __name__ == "__main__":
    app.run(debug=True)