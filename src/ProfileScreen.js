import './ProfileScreen.css';

function ProfileScreen() {
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
    </div>
  );
}

export default ProfileScreen;
