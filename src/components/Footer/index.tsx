import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          <a 
            href="https://github.com/tiogars/noob-bricks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            🔗 GitHub Repository
          </a>
          {' • '}
          <a 
            href="https://github.com/tiogars/noob-bricks/issues" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            🐛 Report an Issue
          </a>
        </p>
      </div>
    </footer>
  );
}
