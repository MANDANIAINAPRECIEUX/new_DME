import TypeSoinManager from "../../components/Settings/TypeSoinManager";
import "./Settings.css";

function Settings() {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Paramètres</h1>
        <p>Configuration du cabinet</p>
      </div>

      <TypeSoinManager />
    </div>
  );
}

export default Settings;