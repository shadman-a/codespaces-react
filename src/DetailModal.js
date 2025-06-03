import { useState } from 'react';
import './DetailModal.css';

function DetailModal({ item, onClose, onSave }) {
  const [name, setName] = useState(item.name);
  const [address, setAddress] = useState(item.address || '');
  const [visited, setVisited] = useState(item.visited || false);

  const handleSave = () => {
    onSave({ name, address, visited });
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
        <div className="actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
