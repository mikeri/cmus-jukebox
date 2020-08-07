from flask import Flask, escape, request, render_template, url_for
import subprocess
import json
import os

app = Flask(__name__)


def cmus_list(arg):
    cmus_args = ["cmus-remote", "--raw", f"save -{arg} -"]
    output = subprocess.run(cmus_args, capture_output=True).stdout.decode()
    return output.split("\n")


def format_list(items):
    formatted_list = []
    for index, item in enumerate(items):
        display_name = os.path.splitext(item)[0].split("/")[-1:][0]
        formatted_list.append({"path": item, "name": display_name, "index": index, "id": f"song{index}"})
    return formatted_list


@app.route("/")
def main():
    name = request.args.get("name", "World")
    cmus_lib = format_list(cmus_list("l"))
    library_json = json.dumps(cmus_lib)
    return render_template("main.html", library=cmus_lib, library_json=library_json)


@app.route("/add", methods=["POST"])
def add_song():
    path = request.data.decode()
    if not path in cmus_list("q"):
        cmus_args = ["cmus-remote", "-q", path]
        subprocess.run(cmus_args)
        return "Ok, added to queue!"
    else:
        return "Song already in queue"
