import { useState } from 'react';
import HighScoreForm from './HighScoreForm';

function Square({ value, onSquareClick}) {
    let className = "square";
    if (value === "X") {
        className += " X"; // Add X class for square
    } else if (value === "O") {
        className += " O"; // Add O class for square
    }

    return (
        <button className={className} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        const nextSquares = squares.slice();
        const bottomRow = getBottomRow(i);

        if (bottomRow !== null) {
            nextSquares[bottomRow * 7 + i] = xIsNext ? 'X' : 'O';
            onPlay(nextSquares);
        }
    }

    function getBottomRow(column) {
        for (let row = 5; row >= 0; row--) {
            if (!squares[row * 7 + column]) {
                return row;
            }
        }
        return null; // Column is full
    }

    function renderBoardRows() {
        const rows = [];
        for (let row = 0; row < 6; row++) {
            const squaresInRow = [];
            for (let col = 0; col < 7; col++) {
                const index = row * 7 + col;
                squaresInRow.push(
                    <Square
                        key={index}
                        value={squares[index]}
                        onSquareClick={() => handleClick(index % 7)}
                    />
                );
            }
            rows.push(<div className="board-row" key={row}>{squaresInRow}</div>);
        }
        return rows;
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner === 'tie') {
        status = "It's a tie!"
    } else if (winner) {
        status = winner + ' is the winner!';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <>
            <div className="status">{status}</div>
            {renderBoardRows()}
        </>
    );
}

export default function App() {
    const [history, setHistory] = useState([Array(42).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [showHighScoreForm, setShowHighScoreForm] = useState(false);
    const [showHighscores, setShowHighscores] = useState(false);
    const [highscores, setHighscores] = useState([]);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    const handlePlay = (nextSquares) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);

        const gameWinner = calculateWinner(nextSquares);
        if (gameWinner) {
            setShowHighScoreForm(true);
        }
    };

    const jumpTo = (nextMove) => {
        setCurrentMove(nextMove);
    };

    const moves = history.map((squares, move) => {
        const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    const fetchHighscores = async () => {
        try {
            const response = await fetch('http://localhost:5050/record');
            if (response.ok) {
                const data = await response.json();
                setHighscores(data);
            } else {
                console.log('Failed to fetch highscores');
            }
        } catch (error) {
            console.error('Error fetching highscores:', error);
        }
    };

    const handleToggleHighscores = () => {
        fetchHighscores();
        setShowHighscores((prevShowHighscores) => !prevShowHighscores);
    };

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>

            {showHighScoreForm && (
                <HighScoreForm
                    currentMove={currentMove}
                    onClose={() => setShowHighScoreForm(false)}
                    onHighscoreSubmit={() => {
                        setShowHighScoreForm(false);
                        fetchHighscores();
                        setShowHighscores(true);
                    }}
                />
            )}

            <button className={"highscores-toggle"} onClick={handleToggleHighscores}>Toggle Highscores</button>
            {showHighscores && (
                <div className="highscores-table">
                    <h2>Highscores</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Moves</th>
                        </tr>
                        </thead>
                        <tbody>
                        {highscores
                            .sort((a, b) => a.moves - b.moves)
                            .map((highscore) => (
                                <tr key={highscore._id}>
                                    <td>{highscore.name}</td>
                                    <td>{highscore.moves}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        // Horizontal wins
        [0, 1, 2, 3],
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6],
        [7, 8, 9, 10],
        [8, 9, 10, 11],
        [9, 10, 11, 12],
        [10, 11, 12, 13],
        [14, 15, 16, 17],
        [15, 16, 17, 18],
        [16, 17, 18, 19],
        [17, 18, 19, 20],
        [21, 22, 23, 24],
        [22, 23, 24, 25],
        [23, 24, 25, 26],
        [24, 25, 26, 27],
        [28, 29, 30, 31],
        [29, 30, 31, 32],
        [30, 31, 32, 33],
        [31, 32, 33, 34],
        [35, 36, 37, 38],
        [36, 37, 38, 39],
        [37, 38, 39, 40],
        [38, 39, 40, 41],
        // Vertical wins
        [0, 7, 14, 21],
        [1, 8, 15, 22],
        [2, 9, 16, 23],
        [3, 10, 17, 24],
        [4, 11, 18, 25],
        [5, 12, 19, 26],
        [6, 13, 20, 27],
        [7, 14, 21, 28],
        [8, 15, 22, 29],
        [9, 16, 23, 30],
        [10, 17, 24, 31],
        [11, 18, 25, 32],
        [12, 19, 26, 33],
        [13, 20, 27, 34],
        [14, 21, 28, 35],
        [15, 22, 29, 36],
        [16, 23, 30, 37],
        [17, 24, 31, 38],
        [18, 25, 32, 39],
        [19, 26, 33, 40],
        [20, 27, 34, 41],
        // Diagonal wins
        [0, 8, 16, 24],
        [1, 9, 17, 25],
        [2, 10, 18, 26],
        [3, 11, 19, 27],
        [3, 9, 15, 21],
        [4, 10, 16, 22],
        [5, 11, 17, 23],
        [6, 12, 18, 24],
        [7, 15, 23, 31],
        [8, 16, 24, 32],
        [9, 17, 25, 33],
        [10, 18, 26, 34],
        [10, 16, 22, 28],
        [11, 17, 23, 29],
        [12, 18, 24, 30],
        [13, 19, 25, 31],
        [14, 22, 30, 38],
        [15, 23, 31, 39],
        [16, 24, 32, 40],
        [17, 25, 33, 41],
        [17, 23, 29, 35],
        [18, 24, 30, 36],
        [19, 25, 31, 37],
        [20, 26, 32, 38]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c] &&
            squares[a] === squares[d]
        ) {
            return squares[a];
        }
    }
    if (squares.every((square) => square !== null)) {
        return 'tie';
    }
    return null;
}