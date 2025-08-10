import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <h1>微前端基座</h1>
        <Navigation />
        <div id="subapp-container" data-testid="subapp-container"></div>
      </div>
    </BrowserRouter>
  );
}

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="nav">
      <Link to="/sub-vue2" className={isActive('/sub-vue2') ? 'active' : ''}>
        Vue2 应用
      </Link>
      <Link to="/sub-vue3" className={isActive('/sub-vue3') ? 'active' : ''}>
        Vue3 应用
      </Link>
      <Link to="/sub-react" className={isActive('/sub-react') ? 'active' : ''}>
        React 应用
      </Link>
    </nav>
  );
}

export default App;
