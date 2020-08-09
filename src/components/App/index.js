import React, {useEffect, useState} from 'react';


import "./App.css";
import NumberDisplay from "../NumberDisplay";
import {generateCells} from "../utils/generateCells"
import {openMultipleCells} from "../utils/generateCells"
import {setCellProp} from "../utils/setCellProp"
import Button from "../Button";
import {MAX_COLS, MAX_ROWS} from "../../constants";

const App = () => {
    const [cells,setCells] = useState(generateCells());
    const [face,setFace] = useState("😄")
    const [time, setTime] = useState(0)
    const [isLive, setIsLive] = useState(false)
    const [mineCounter, setMineCounter] = useState(10)
    const [hasLost, setHasLost] = useState(false)
    const [hasWon, setHasWon] = useState(false)

    useEffect(()=> {
        if(isLive && !hasWon && !hasLost){

            const interval = setInterval(()=> {
                if(time < 999){
                    //console.log("Time",time)
                    setTime(time+1)
                }
            }, 1000)

            return ()=> {
                clearInterval(interval)
            }
        }
    },[isLive,time, hasWon, hasLost])

    const handleMouseDown = e => {
        if (hasWon || hasLost) {
            return;
        }
        setFace("😮")
    }
    const handleMouseUp = ():void => {
        if (hasWon || hasLost) {
            return;
        }
        setFace("😄")
    }

    useEffect(() => {

        window.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mouseup",handleMouseUp)

        return () => {
            window.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    },[face, hasWon, hasLost])

    useEffect(()=> {
        if (hasLost){
            setIsLive(false)
            setFace("😵")
        }
    },[hasLost])

    useEffect(() => {
        if(hasWon) {
            setIsLive(false)  //TODO whether should add
            const newCells = cells.map(row =>
                row.map(cell =>
                    cell.value === -1 //
                        ? {
                            ...cell,
                            state: 1    //if bomb, make bomb visible
                        }
                        : cell
                )
            );

            setCells(newCells);
            setFace("😎")
        }
    },[hasWon])

    const renderCells = () => {
        return cells.map((row, rowIndex) => {
            return renderButtonsForRow(row, rowIndex);
        });
    };


    const renderButtonsForRow = (row, rowIndex) => {
        return row.map((cell, colIndex) => (
            <Button
                state={cell.state}
                value={cell.value}
                red={cell.red}
                key={`${rowIndex}-${colIndex}`}
                onClick={handleButtonClick}
                onContext={handleButtonContextClick}
                row={rowIndex}
                col={colIndex}
            />
        ));
    };


    //left click
    const handleButtonClick = (rowParam, colParam) => e => {
        e.preventDefault()

        if (hasWon || hasLost) {
            return;
        }

        let gameCells = cells;
        let cell = gameCells[rowParam][colParam];
        //console.log(cells)
        if(!isLive){
            //TODO: make sure you don't click a bomb in the first click
            if (cell.value === -1) {
                let hasABomb = true;
                let newCells = gameCells;
                while (hasABomb) {
                    newCells = generateCells();
                    const newCell = newCells[rowParam][colParam];
                    if (newCell.value !== -1) {    //why need to check -1
                        hasABomb = false;
                    }
                }
                gameCells = newCells;
                cell = gameCells[rowParam][colParam];
            }
            setIsLive(true)
        }

        const currentCell = gameCells[rowParam][colParam]
        if(currentCell.state !== 0){
            return
        }
        if(currentCell.value === -1){
            //TODO: what happen bomb click
            setHasLost(true)
            let newCells = setCellProp(gameCells, rowParam, colParam, "red", true);
            newCells = showAllBombs(newCells)
            setCells(newCells)
            return
        } else if(currentCell.value === 0){
            //TODO
            gameCells = openMultipleCells(gameCells, rowParam, colParam)
        }else if (currentCell.value > 0){
            gameCells = setCellProp(gameCells, rowParam, colParam, "state", 1);
        }
        //TODO check to see if hasWon
        const availableNonBombSpaces = gameCells.reduce(
            (acc, row) =>
                acc +
                row.reduce(
                    (acc2, cell) =>
                        cell.value !== -1 && cell.state === 0 ? acc2 + 1 : acc2,
                    0
                ),
            0
        );

        setCells(gameCells);

        if (availableNonBombSpaces === 0) {
            gameCells.map(row => row.map(cell => ({ ...cell, state: 2 })));
            setHasWon(true);
        }
    }
    //right click
    const handleButtonContextClick = (rowParam:number, colParam:number) => e=> {
        e.preventDefault()
        //console.log("we are in right click")
        if(!isLive){
            return
        }
        const currentCells = cells.slice()
        const currentCell = cells[rowParam][colParam]
        // console.log(currentCell)
        // console.log(currentCells)
        if(currentCell.state === 1){
            return
        } else if(currentCell.state ===0) {
            currentCells[rowParam][colParam].state = 2
            setCells(currentCells)
            setMineCounter(mineCounter-1)
        } else if(currentCell.state ===2){
            currentCells[rowParam][colParam].state = 0
            setCells(currentCells)
            setMineCounter(mineCounter+1)
        }
    }
    const handleFaceClick = e => {
        e.preventDefault();
        setCells(generateCells());
        setIsLive(false);
        setMineCounter(10);
        setTime(0);
        setHasLost(false);
        setHasWon(false);
        setFace("😁");
    }

    const showAllBombs = (cells)=>{
        return cells.map(row =>
            row.map(cell => {
                if (cell.value === -1){
                    return {
                        ...cell,
                        state: 1
                    }
                }
            return cell
        }))
    }


    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value ={mineCounter}/>
                <div className="Face" onClick={handleFaceClick}>
                    <span role="img" aria-label="face">{face}</span>
                </div>
                <NumberDisplay value={time}/>


            </div>
            <div className="Body">
                {renderCells()}
            </div>

        </div>
    )
}

export default App;
