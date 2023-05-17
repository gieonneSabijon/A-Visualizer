from flask import Flask, render_template, request, jsonify 
from astar import astar, NoPathException
import re
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/endpoint', methods=['POST'])
def handle_request():
    data = request.get_json()
    maze = []
    diagonalAllow = False
    for i in data:
        if i == "allow" or i == "deny":
            if i == "allow":
                diagonalAllow = True
            else:
                diagonalAllow = False
            continue
        row = []
        for j in i:
            if "wall" in j:
                row.append(1)
            else:
                row.append(0)

            if "start" in j:
                start = tuple(map(int, list(reversed(re.findall(r'[0-9]+', j)))))
            elif "end" in j:
                end = tuple(map(int, list(reversed(re.findall(r'[0-9]+', j)))))
        maze.append(row)
    try:
        path = astar(maze,start, end, diagonalAllow)
        return jsonify(path)
    
    except (NoPathException, UnboundLocalError) as e:
        return jsonify({'error': 'No Path Found'})
    

if __name__ == "__main__":
    app.run(debug = True)