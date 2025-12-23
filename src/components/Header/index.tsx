import { ThemeSelector } from '../ThemeSelector';
import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          <span className="brick-emoji">🧱</span>
          Brick Manager
        </h1>
        <p className="header-subtitle">Manage your favorite brick numbers with style!</p>
        <div className="header-theme">
          <ThemeSelector />
        </div>
      </div>
    </header>
  );
}
