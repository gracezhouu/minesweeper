import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  class Square extends React.Component {
    constructor(props) {
      super(props);
      this.state = {//
        cell: props.cell
      };
    }

    render() {
      return (
        <button className={`square ${this.state.cell.className}`} onClick={() => this.props.onClick()}>
          {this.state.cell.value}
        </button>
      );
    }
  }
  
  const SAFE_CELL = 0
  const MINE_CELL = 9
  const FRONT = 0
  const BACK = 1
  const FLAG = 2
  const NOT_SURE = 3
  const AROUND = [
    [-1,-1],
    [-1,0],
    [-1,1],
    [0,-1],
    [0,1],
    [1,-1],
    [1,0],
    [1,1]
  ]

  class Board extends React.Component {
    constructor(props) {
      super(props);
      this.state = {//
        rows: props.rows,
        columns: props.columns,
        //squares: this.initData(props.rows, props.columns),
        xIsNext: true,
        dataList:this.initData(props.rows, props.columns),
      };
    }

    mineShuffle (array, mine = array.length) {
      let count = mine
      let index
      while (count) {
        index = Math.floor(Math.random() * count--);
        [array[count], array[index]] = [array[index], array[count]]
      }
      return array
    }

    initData(rows, cols) {
      const mines = 10
      const safeCellNum = rows * cols - mines
      const safeArea = (new Array(safeCellNum).fill(SAFE_CELL))
      const mineArea = (new Array(mines).fill(MINE_CELL))
      let totalArea = safeArea.concat(mineArea)
      totalArea = this.mineShuffle(totalArea)

      let dataList = totalArea.reduce((memo, curr, index) => {
        if (index % cols === 0) {
          memo.push([{value: curr}])
        } else {
          memo[memo.length - 1].push({value:curr})
        }
        return memo
      }, [])
      this.setEnvNum(dataList)  
      //return totalArea
      return dataList
    }

    setEnvNum(dataList) {
      dataList.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          cell.status = BACK
          cell.rowIndex = rowIndex
          cell.colIndex = colIndex
          cell.className = ''
          if (cell.value === MINE_CELL) {
            AROUND.forEach(offset => {
              const row = rowIndex +offset[0]
              const col = colIndex + offset[1]
              if(
                dataList[row]&&
                dataList[row][col] &&
                dataList[row][col].value !==undefined &&
                dataList[row][col].value !==MINE_CELL
              ) dataList[row][col].value ++
            })
          }
        }) 
      });
    }

    handleClick(i, j) {
      let dataList = this.state.dataList;
      if (dataList[i][j].status === FLAG) return
      dataList[i][j].status = FRONT
      dataList[i][j].className = 'front'
    }

    renderSquare(i,j) {
      return (
        <Square 
          cell={this.state.dataList[i][j]}
          onClick={() => this.handleClick(i, j)} 
        />
      );
    }

    createTable = () => {
      let table = []
  
      // Outer loop to create parent
      for (let i = 0; i < this.state.rows; i++) {
        let children = []
        //Inner loop to create children
        for (let j = 0; j < this.state.columns; j++) {
          children.push(this.renderSquare(i,j))
        }
        //Create the parent and add the children
        table.push(<div className="board-row">{children}</div>)
      }
      return table
    }
  
    render() {
      const winner = calculateWinner(this.state.squares);
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div>
          <div className="status">{status}</div>
          {this.createTable()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board rows="10" columns="10"/>
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  

  function calculateWinner(squares) {
    // const lines = [
    //   [0, 1, 2],
    //   [3, 4, 5],
    //   [6, 7, 8],
    //   [0, 3, 6],
    //   [1, 4, 7],
    //   [2, 5, 8],
    //   [0, 4, 8],
    //   [2, 4, 6],
    // ];
    // for (let i = 0; i < lines.length; i++) {
    //   const [a, b, c] = lines[i];
    //   if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    //     return squares[a];
    //   }
    // }
    return null;
  }