import { useState } from 'react';

export default function HighScoreForm({ currentMove, onClose, onHighscoreSubmit }) {
    const [name, setName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const highscore = {
            name: name,
            moves: currentMove,
        };

        try {
            const response = await fetch('http://localhost:5050/record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(highscore),
            });

            if (response.ok) {
                console.log('Highscore submitted successfully!');
                onHighscoreSubmit(); // Notify the parent component about the highscore submission
            } else {
                console.log('Failed to submit highscore');
            }
        } catch (error) {
            console.error('Error submitting highscore:', error);
        }
    };

    return (
        <div className="modal">
            <div className={"modal-content"}>
                <h1>Congratulations! You won in {currentMove} moves!</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Enter your name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <button className={"submit-button"} type="submit">Submit</button>
                </form>
                <button className="close-button" onClick={onClose}>x</button>
            </div>
        </div>
    );
}
