from __future__ import print_function
from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
app = Flask(__name__)

json_table = []
labs = {}
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/test", methods = ['POST'])
def test():
	#print json.dumps(request.get_json())
	global json_table
	json_table = json.loads(json.dumps(request.get_json()))
	return "got here"

@app.route("/instructors")
def instructors():
    return render_template("instructors.html")


# @app.route("/test/<string:name>")
# def test(name):
#     return render_template("test.html", name=name)

@app.route("/create", methods=["GET"])
def show_create():
    return render_template("create.html")

@app.route("/create", methods=["POST"])
def create():
    print("nas")
    lab_name = request.form['lab-name']
    print("pas")
    synopsis = request.form['synopsis']
    materials = request.form['materials'].split('\n')
    num_steps = int(request.form['num-steps'])
    print("yeeee", num_steps)
    steps = [request.form['step-%d' % (i+1)] for i in range(num_steps)]
    print(lab_name, {"synopsis": synopsis, "materials": materials, "instructions": steps})
    labs[lab_name] = {"synopsis": synopsis, "materials": materials, "instructions": steps}
    return redirect(url_for('index'))

@app.route("/lab/<string:name>")
def get_lab(name):
    return jsonify(**labs[name])

@app.route("/tableView")
def table():
	global json_table
	return render_template("table.html", table_dict = json_table)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)

