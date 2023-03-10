import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';

import { db } from '../utils/firebase-config';

import WarningModal from './WarningModal';

import '../styles/ScoresTable.css';

function ScoresTable({
  level,
  scores, setScores,
  isAdmin,
}) {
  if (scores.length === 0) {
    return (
      <div className="no-scores-display">
        <p>
          <span>No high scores yet.</span>
          <Link to={`/levels/${level.id}`} state={{ level }}> Be the first!</Link>
        </p>
      </div>
    );
  }

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedScore, setSelectedScore] = useState(null);

  const deleteScore = async (e) => {
    e.preventDefault();

    await deleteDoc(doc(db, 'scores', selectedScore.id));

    setScores((prev) => prev.filter((s) => s.id !== selectedScore.id));
    setShowWarningModal(false);
  };

  return (
    <>
      <table className="scores-table" cellSpacing="0">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Time (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, i) => (
            <tr key={score.id}>
              <td>{i + 1}</td>
              <td>{score.name}</td>
              <td className="score-cell">
                <p>{score.ms / 1000}</p>
                {(isAdmin) ? (
                  <button
                    type="button"
                    className="delete-score-btn"
                    onClick={() => {
                      setSelectedScore(score);
                      setShowWarningModal(true);
                    }}
                  >
                    x
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(showWarningModal) ? (
        <WarningModal
          header="Delete score"
          message={`Are you sure you want to delete ${selectedScore.name}'s score (${selectedScore.ms / 1000} seconds)?`}
          setShow={setShowWarningModal}
          action={deleteScore}
        />
      ) : null}
    </>
  );
}

export default ScoresTable;
