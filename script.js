
const score = document.getElementById("score");
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


const keyHandler = (e) => {
  if (isCpu)
    return

  if (isGameOver)
    return

  if (e.key === "ArrowLeft") {
    figure.col--
    if (!canMove(figure.matrix, figure.row, figure.col)) {
      figure.col++
    }
  } else if (e.key === "ArrowRight") {
    figure.col++
    if (!canMove(figure.matrix, figure.row, figure.col)) {
      figure.col--
    }
  }
  else if (e.key === "ArrowDown") {
    figure.row++
    if (!canMove(figure.matrix, figure.row, figure.col)) {
      figure.row--
      placeFigure(figure.matrix, figure.row, figure.col, figure.name)
    }
  }
  else if (e.key === "ArrowUp") {
    const m = figure.matrix
    figure.matrix = rotateRight(figure.matrix)
    if (!canMove(figure.matrix, figure.row, figure.col)) {
      figure.matrix = m
    }
  }
  else if (e.key === " "){
  }
}


document.addEventListener("keydown", keyHandler)
const fps = 1000 / 60
let drawCount = 0 // frame counter


let scoreCount = 0
let isCpu = false


// game structs
const cellSize = 24

// init field
const fieldRows = 15
const fieldCols = 15
const field = []
for (let i = -2; i < fieldRows; i++) { // -2 is outer field figure's appear
  field[i] = []
  for (let j = 0; j < fieldCols; j++) {
    field[i][j] = 0
  }
}

const fieldPixWidth = fieldRows * cellSize
const fieldPixHeight = fieldCols * cellSize


const colors = {
  "line": "rgb(20, 200, 100)",
  "square": "rgb(42, 100, 100)",
  "L": "rgb(100, 100, 24)",
  "S": "rgb(100, 0, 100)"
}



const rotateRight = (sourceMatrix) => {


  const N = sourceMatrix.length - 1
  const matrix = sourceMatrix.map((row, i) => (row.map((col, j) => sourceMatrix[N - j][i])))
  return matrix
}

// init figure
// const figure = {
//   matrix,
//   row,
//   col,
//   name
// }
const matrixes = {
  'line': [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  'square': [
    [1, 1],
    [1, 1]
  ],
  'S': [
    [0, 0, 0,],
    [0, 1, 1,],
    [1, 1, 0,]
  ],
  'L': [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
  ]
}

// current figure
let figure = null



const getNextFigure = () => {

  const sequence = ['line', 'square', 'S', 'L']
  const rnd = Math.floor(Math.random() * (sequence.length - 1 - 0 + 1) + 0)

  name = sequence[rnd]
  const row = -2
  const col = Math.floor(fieldCols / 2) - Math.floor(matrixes[name].length / 2)


  return {
    name,
    matrix: matrixes[name],
    row,
    col
  }


}

// const raF = requestAnimationFrame(loop)

let isGameOver = false

figure = getNextFigure()

// some ai
if (isCpu){
  // analize field
  for (let i=field.length; i >= 0; i--){
    let emptyCounter = 0
    for (let j=0; j < field[0].length; j--){
    // check line for maximum in row empties
      if (field[0][j]){
        emptyCounter++
      }
    const empties = field[i][j]
  }
}
}


const showGameOver = () => {
  isGameOver = true
  //clearInterval(interval)
  // cancelAnimationFrame(rAF);
}

const canMove = (matrix, row, col) => {

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {

      if (matrix[i][j] && // return not 0
        (j + col < 0 ||
          j + col >= fieldCols ||
          row + i >= field.length ||
          field[row + i][col + j] // return not 0
        ))
        return false
    }
  }
  // can move
  return true
}

const placeFigure = (matrix, row, col, name) => {

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j]) {

        if (row + i < 0) { // край вылез за пределы
          return showGameOver()
        }
        // записываем клетку матрицы в поле
        field[row + i][col + j] = name

      }
    }
  }

  // check filled rows clear
  let i = field.length - 1
  let lineEraseCounter = 0
  while (i >= 0) {
    if (field[i].every(cell => !!cell)) {
      lineEraseCounter++
      // clear row and move down other
      for (let r = i; r >= 0; r--) {
        for (let c = 0; c < field[0].length; c++) {
          field[r][c] = field[r - 1][c]
        }
        
      }
    }
    else
      i-- 
  }
  scoreCount+=100 * (lineEraseCounter * lineEraseCounter)
  score.textContent = `Your score: ${scoreCount}`

  figure = getNextFigure()

}

let interval = null

window.onload = () => {

  interval = setInterval(draw, fps)

}

const draw = () => {
  // ctx.clearRect(0, 0, 600, 400)
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height)


  // draw field
  ctx.fillStyle = "rgb(140, 140, 140)"
  for (let i = 0; i < fieldRows; i++) {
    for (let j = 0; j < fieldCols; j++) {
      if (field[i][j])
        ctx.fillStyle = colors[field[i][j]]
      else ctx.fillStyle = "rgb(140, 140, 140)";
      ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1)
    }
  }



  // draw figure
  if (figure) {
    for (let i = 0; i < figure.matrix.length; i++) {
      for (let j = 0; j < figure.matrix[0].length; j++) {
        figure.matrix[i][j] > 0 ? ctx.fillStyle = colors[figure.name] : ctx.fillStyle = "rgb(200 200 0 / 0%)"
        ctx.fillRect((figure.col + j) * cellSize, (figure.row + i) * cellSize, cellSize - 1, cellSize - 1)
      }
    }
  }

  if (isGameOver) {

    ctx.fillStyle = 'white';

    ctx.font = `45px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = `30px Arial`;
    ctx.fillText('SCORE: '+ scoreCount, canvas.width / 2, canvas.height / 2 + 50);
  }


  if (drawCount % 50 <= 0) {
    // actions
    if (!isGameOver) {
      figure.row++
      if (!canMove(figure.matrix, figure.row, figure.col)) {
        figure.row--
        placeFigure(figure.matrix, figure.row, figure.col, figure.name)
      }
    }

  }






  drawCount++

}