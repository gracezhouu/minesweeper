import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../../constants";
const grabAllAdjacentCells = (cells, rowParam, colParam)=>{
    const topLeftCell = rowParam>0&&colParam? cells[rowParam-1][colParam-1]:null
    const topCell = rowParam?cells[rowParam-1][colParam]:null
    const topRightCell = rowParam>0&&colParam<MAX_COLS-1 ? cells[rowParam-1][colParam+1]:null
    const leftCell = colParam>0?cells[rowParam][colParam-1]:null
    const rightCell = colParam<MAX_COLS-1 ? cells[rowParam][colParam+1]:null
    const bottomLeftCell = rowParam < MAX_ROWS - 1 && colParam > 0
        ? cells[rowParam + 1][colParam - 1]
        : null
    const bottomCell = rowParam<MAX_ROWS-1 ? cells[rowParam+1][colParam]:null
    const bottomRightCell = rowParam<MAX_ROWS-1&&colParam<MAX_COLS-1 ? cells[rowParam+1][colParam+1]:null
    return {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    }
}



export const generateCells = () => {
    // creating the cells;
    const cells = [];
    for (let row = 0; row < 9; row++) {
        cells.push([]);
        for (let col = 0; col < 9; col++) {
            cells[row].push({bomb: false, state: 0}); // 0 = unpressed, 1 = visible, 2 = flag
        }
    }
    // randomly put 10 bombs
    for(let i = 0;i<10;i++){
        let placedBomb = false
        while(!placedBomb){
            let row = Math.floor(Math.random()*9);
            let col = Math.floor(Math.random()*9);

            if(!cells[row][col].bomb){
                cells[row][col].bomb = true;
                placedBomb = true;
            }
        }
    }
    //calculate value of each cell
    for(let row =0;row<9;row++){
        for(let col=0;col<9;col++){
            const cell = cells[row][col]
            if(cell.bomb){
                cell.value = -1
                continue
            }
            //compute value
            let counter =0

            if (row > 0 && col > 0 && cells[row - 1][col - 1].bomb) {
                counter++;
            }

            if (row > 0 && cells[row - 1][col].bomb) {
                counter++;
            }

            if (row > 0 && col < 8 && cells[row - 1][col + 1].bomb) {
                counter++;
            }
            if (col > 0 && cells[row][col - 1].bomb) {
                counter++;
            }
            if (col < 8 && cells[row][col + 1].bomb) {
                counter++;
            }
            if (row < 8 && col > 0 && cells[row + 1][col - 1].bomb) {
                counter++;
            }
            if (row < 8 && cells[row + 1][col].bomb) {
                counter++;
            }
            if (row < 8 && col < 8 && cells[row + 1][col + 1].bomb) {
                counter++;
            }
            cell.value = counter
        }
    }
    return cells;
}

export const openMultipleCells = (cells, rowParam, colParam)=> {
    // const currentCell = cells[rowParam][colParam]
    // console.log(cells)
    console.log(colParam)
    if(cells[rowParam][colParam].state === 1||cells[rowParam][colParam].state===2){
        return cells
    }
    let newCells = cells.slice()
    newCells[rowParam][colParam].state = 1
    // console.log(rowParam)
    // console.log(colParam)
    // console.log(newCells)
    const{
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    } = grabAllAdjacentCells(cells, rowParam, colParam)

    if(topLeftCell?.state===0 && topLeftCell.value !== -1){
        if(topLeftCell.value === 0){
            newCells = openMultipleCells(newCells, rowParam-1,colParam-1)
        } else {
            newCells[rowParam-1][colParam-1].state = 1
        }
    }
    //topCell
    if(topCell?.state===0 && topCell.value !== -1){
        if(topCell.value === 0){
            newCells = openMultipleCells(newCells, rowParam-1,colParam)
        } else {
            newCells[rowParam-1][colParam].state = 1
        }
    }
    //topRightCell
    if(topRightCell?.state===0 && topRightCell.value !== -1){
        if(topRightCell.value === 0){
            newCells = openMultipleCells(newCells, rowParam-1,colParam+1)
        } else {
            newCells[rowParam-1][colParam+1].state = 1
        }
    }
    //leftCell
    if(leftCell?.state===0 && leftCell.value !== -1){
        if(leftCell.value === 0){
            newCells = openMultipleCells(newCells, rowParam,colParam-1)
        } else {
            newCells[rowParam][colParam-1].state = 1
        }
    }
    //rightCell
    if(rightCell?.state===0 && rightCell.value !== -1){
        if(rightCell.value === 0){
            newCells = openMultipleCells(newCells, rowParam,colParam+1)
        } else {
            newCells[rowParam][colParam+1].state = 1
        }
    }
    // bottomLeftCell
    if(bottomLeftCell?.state===0 && bottomLeftCell.value !== -1){
        if(bottomLeftCell.value === 0){
            newCells = openMultipleCells(newCells, rowParam+1,colParam-1)
        } else {
            newCells[rowParam+1][colParam-1].state = 1
        }
    }
    // bottomCell
    if(bottomCell?.state===0 && bottomCell.value !== -1){
        if(bottomCell.value === 0){
            newCells = openMultipleCells(newCells, rowParam+1,colParam)
        } else {
            newCells[rowParam+1][colParam].state = 1
        }
    }
    // bottomRightCell
    if(bottomRightCell?.state===0 && bottomRightCell.value !== -1){
        if(bottomRightCell.value === 0){
            newCells = openMultipleCells(newCells, rowParam+1,colParam+1)
        } else {
            newCells[rowParam+1][colParam+1].state = 1
        }
    }
    return newCells
}
