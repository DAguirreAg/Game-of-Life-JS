/* Inspiration:
https://pmav.eu/stuff/javascript-game-of-life-v3.1.1/
*/

/* MAIN VARS */
const ROW = 40;
const COL = 120;
var world = [];
var autorunning = false;
var interval_autorun = null;

// Get the canvas and context
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Define the image dimensions
var canvas_width = canvas.width;
var canvas_height = canvas.height;

var pxl_width = canvas_width / (COL + 2);
var pxl_height = canvas_height / (ROW + 2);

/** Matrix generation functions **/
/* Generate random matrix */
function generate_random() {
    a = []
    for (r = 0; r < ROW; r++) {
        a_row = []
        for (c = 0; c < COL; c++) {
            a_row.push(Math.round(Math.random()));
        }
        a.push(a_row)
    }
    a = add_border(a);
    return a;
}

/* Generate empty matrix */
function generate_empty() {
    a = new Array(ROW + 2).fill(Array(COL + 2).fill(0));
    return a;
}

/* Add empty border around result to avoid schrinking matrix */
function add_border(a) {
    a.unshift(Array(COL).fill(0));
    a.push(Array(COL).fill(0));
    for (i = 0; i < a.length; i++) {
        a[i].unshift(0);
        a[i].push(0);
    }
    return a
}

/** Game of Life's functions **/
// Update the matrix
function update(a) {
    a_i = []
    for (r = 1; r < ROW + 1; r++) {
        a_row_i = []
        for (c = 1; c < COL + 1; c++) {
            // Extract neighbouring/sliced matrix
            neighbours = get_slice(a, r, c);
            next_state = get_next_state(neighbours);

            a_row_i.push(next_state);
        };
        a_i.push(a_row_i);
    };
    add_border(a_i);

    return a_i;
}


// Get slice of matrix
function get_slice(a, r, c) {
    var b = a.slice(r - 1, r + 2)
    neighbours = [];
    for (i = 0; i < b.length; i++) {
        neighbours.push(b[i].slice(c - 1, c + 2));
    };
    return neighbours;
}


// Check next state
function get_next_state(neighbours) {

    // Calculate the # of alive cells
    var sum = 0;
    for (i = 0; i < neighbours.length; i++) {
        sum += neighbours[i].reduce((a, b) => {
            return a + b
        });
    }
    sum -= neighbours[1][1];

    // Calculate next state of the cell
    var curr_state = neighbours[1][1];
    var next_state = 0;

    if (curr_state == 1) { // If the cell is alive        
        if (sum < 2) {
            next_state = 0;
        } else if (sum <= 2 || sum <= 3) {
            next_state = 1;
        } else {
            next_state = 0;
        }
    } else { // If the cell is dead
        if (sum == 3) {
            next_state = 1;
        }
    }
    return next_state
}

/** Helper functions **/
// Print a beautify version of a multidim array
function print_matrix(a) {
    matrix_string = ""
    for (i = 0; i < a.length; i++) {
        row_string = ""
        for (j = 0; j < a[i].length; j++) {
            row_string += String(a[i][j]) + " "
        }
        matrix_string += row_string + "\n"
    }
    console.log(matrix_string)
}

/** User GUI functions **/
/* Draw Matrix into the canvas */
function draw_canvas(a) {

    // Clear previous
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw new
    for (r = 0; r < a.length; r++) {
        for (c = 0; c < a[0].length; c++) {

            if (a[r][c] == 1) {
                // Draw rectangle
                context.beginPath()
                context.fillStyle = 'black';
                context.rect(c * pxl_width, r * pxl_height, pxl_width, pxl_height);
                context.fill();

                context.strokeStyle = 'red';
                context.lineWidth = 0.5;
                context.stroke();
            }
        }
    }
}

/* Clean canvas */
function clean_canvas() {
    // Reset matrix
    world = generate_empty();

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
}

/* Generate random */
function generate_random_canvas() {
    // Reset matrix
    world = generate_random();

    // Display canvas
    draw_canvas(world);
}

/* Next step */
function next_step() {
    // Update world
    world = update(world);

    // Draw canvas
    draw_canvas(world);
}

/* Auto run */
function auto_run() {
    if (autorunning == false) {
        autorunning = true;
        interval_autorun = setInterval("next_step();", 100);
    } else {
        autorunning = false;
        console.log('autorunning stopped');
        clearInterval(interval_autorun);
    }
}

function init() {
    generate_random_canvas();
}

init();
