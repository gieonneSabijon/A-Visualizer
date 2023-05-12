class Node():
    def __init__(self, parent=None, position=None):
        self.parent = parent
        self.position = position

        self.g = 0
        self.h = 0
        self.f = 0

    def __eq__(self, other):
        return self.position == other.position
    
def astar(maze, start, end):
    nStart = Node(None, start)
    nEnd = Node(None, end)
    nStart.g = nStart.h = nStart.f = nEnd.g = nEnd.h = nEnd.f= 0
    
    open = []
    closed = []

    open.append(nStart)

    while len(open) > 0:
        current = open[0]
        currentI = 0

        #Finds the node in open with the lowest F value 
        for i, node in enumerate(open):
            if node.f < current.f:
                current = node
                currentI = i
                

        #Removes the Node from open and puts it into closed
        open.pop(currentI)
        closed.append(current)
        

        if (current == nEnd): #If the current node reaches the end
            path = []
            c = current
            while c is not None: #creates the path from end to beginning
                path.append(c.position)
                c = c.parent
            #returns the reversed path (start to end)
            return path[::-1]
        
        children = []
        '''
        x being (0,0) our current node
        (-1, -1)(0, -1)(1, -1)
        (-1,  0)(  x  )(1,  0) 
        (-1,  1)(0,  1)(1,  1)
        '''
        #Loop through the adjacent nodes
        for newPOS in [(-1, -1), (0, -1), (1, -1), (1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0)]:
            #sets POS by offsetting our current node by the adjacement's position
            nodePOS = (current.position[0] + newPOS[0], current.position[1] + newPOS[1])

            #Checks if position is outside maze
            if nodePOS[0] > (len(maze) - 1) or nodePOS[0] < 0 or nodePOS[1] > (len(maze[len(maze) -1]) -1) or nodePOS[1] < 0:
                continue

            #Check if position is obstructed
            if maze[nodePOS[0]][nodePOS[1]] != 0:
                continue

            newNode = Node(current, nodePOS)
            children.append(newNode)

        

        for child in children:
            for closedChild in closed:
                if child == closedChild:
                    continue
            
            child.g = current.g + 1
            child.h = ((child.position[0] - nEnd.position[0]) ** 2) + ((child.position[1] - nEnd.position[1]) ** 2)
            child.f = child.g + child.h

            for nOpen in open:
                if child == nOpen and child.g > nOpen.g:
                    continue

            open.append(child)

def main():

    maze = [[0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

    start = (0, 0)
    end = (7, 6)

    path = astar(maze, start, end)
    print(path)


if __name__ == '__main__':
    main()