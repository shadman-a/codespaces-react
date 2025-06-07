import { useState } from 'react';
import './DetailModal.css';

function DetailModal({ item, onClose, onSave }) {
  const [name, setName] = useState(item.name);
  const [address, setAddress] = useState(item.address || '');
  const [visited, setVisited] = useState(item.visited || false);
  const [rating, setRating] = useState(item.rating || '');
  const [notes, setNotes] = useState(item.notes || '');

  const handleSave = () => {
    onSave({
      name,
      address,
      visited,
      rating: rating === '' ? null : Math.min(5, Math.max(1, Number(rating))),
      notes,
    });
  };

  return (
    <div className="Modal-overlay">
      <div className="Modal">
        <h3>Edit Place</h3>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Address
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={visited}
            onChange={(e) => setVisited(e.target.checked)}
          />
          Visited
        </label>
        <label>
          Rating (1-5)
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </label>
        <label>
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </label>
        <div className="actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
