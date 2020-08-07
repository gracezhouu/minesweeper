import React, {useEffect, useState} from 'react';


import "./App.css";
import NumberDisplay from "../NumberDisplay";
import {generateCells} from "../utils/generateCells"
import {openMultipleCells} from "../utils/generateCells"
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

        let newCells = cells;
        let cell = newCells[rowParam][colParam];
        //console.log(cells)
        if(!isLive){
            //TODO: make sure you don't click a bomb in the first click
            let isABomb=(cell.value ===-1)

            while(isABomb){
                newCells = generateCells()
                if(cell.value!==-1){
                    isABomb =false
                }
            }
            setIsLive(true)
        }

        const currentCell = newCells[rowParam][colParam]
        if(currentCell.state !== 0){
            return
        }
        if(currentCell.value === -1){
            //TODO: what happen bomb click
            setHasLost(true)
            newCells[rowParam][colParam].red = true
            newCells = showAllBombs(newCells)
            setCells(newCells)
        } else if(currentCell.value === 0){
            //TODO
            newCells = openMultipleCells(newCells, rowParam, colParam)
            setCells(newCells)
        }else{
            newCells[rowParam][colParam].state = 1
            setCells(newCells)
        }
        //TODO check to see if hasWon
        let safeCellsExists = false
        for (let row=0; row<MAX_ROWS; row++){
            for(let col = 0; col <MAX_COLS;col++){
                const currentCell = newCells[row][col]
                if(currentCell.value!==-1 && currentCell.state===0){
                    safeCellsExists = true
                }
            }
        }
        // if there is no safecell, flag all the left one
        if(!safeCellsExists){
            newCells = newCells.map(row => row.map(cell => {
                if(cell.value === -1){
                    return {
                        ...cell,
                        state: 2
                    }
                }
                return cell
            }))
            setHasWon(true)
        }
        setCells(newCells)
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
