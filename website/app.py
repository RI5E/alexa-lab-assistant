from flask import Flask, render_template, request
import json
app = Flask(__name__)

json_table = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/test", methods = ['POST'])
def test():
	#print json.dumps(request.get_json())
	global json_table
	json_table = json.loads(json.dumps(request.get_json()))
	return "got here"

@app.route("/instructors/<string:name>")
def instructors(name):
    return render_template("instructors.html", name = name)

@app.route("/create")
def create():
    return render_template("create.html")

@app.route("/tableView")
def table():
	global json_table
	return render_template("table.html", table_dict = json_table)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False)

