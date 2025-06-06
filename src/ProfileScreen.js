import { MdDarkMode, MdLightMode } from 'react-icons/md';
import './ProfileScreen.css';

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
        aria-label="Toggle Theme"
      >
        {darkMode ? <MdLightMode /> : <MdDarkMode />}
        <span className="label">{darkMode ? 'Light' : 'Dark'} Mode</span>
      </button>
    </div>
  );
}

export default ProfileScreen;
