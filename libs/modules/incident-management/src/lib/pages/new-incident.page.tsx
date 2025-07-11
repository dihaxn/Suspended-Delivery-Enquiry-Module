import { useAuthContext } from '@cookers/auth';
import { Link } from 'react-router-dom';

export function NewIncidentPage() {
  const { handleLogout } = useAuthContext();

  return (
    <div>
      {/* <Filter /> */}
      <ul>
        <li>
          <Link to="/operations/incident-management/">List</Link>
        </li>
        <li>
          <Link to="/operations/incident-management/new">New</Link>
        </li>
        <li>
          <Link to="/operations/incident-management/123">123</Link>
        </li>
        <li>
          <Link to="/operations/incident-management/456">456</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
      <div>New Incident</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
