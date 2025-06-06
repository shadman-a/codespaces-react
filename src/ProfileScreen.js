import './ProfileScreen.css';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

function ProfileScreen({ darkMode, setDarkMode }) {
  return (
    <div className="Profile">
      <h1>Your Profile</h1>
      <p>This is a placeholder profile page.</p>
      <div className="ProfileCard">
        <div className="avatar">🙂</div>
        <div className="info">
          <div className="name">Jane Doe</div>
          <div className="email">jane@example.com</div>
        </div>
      </div>
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        <span className="icon" aria-label="Theme">
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </span>
        <span className="label">{darkMode ? 'Light' : 'Dark'}</span>
      </button>
    </div>
  );
}

export default ProfileScreen;
