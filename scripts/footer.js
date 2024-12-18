function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";

  footer.innerHTML = `
        <div class="footer-waves">
            <div class="wave wave1"></div>
            <div class="wave wave2"></div>
            <div class="wave wave3"></div>
        </div>
        <div class="footer-content">
            <div class="footer-section">
                <div class="footer-logo">
                    <h3>✨ מלחמת הניצוצות</h3>
                    <div class="logo-sparkles">
                        <span class="sparkle">✦</span>
                        <span class="sparkle">✧</span>
                        <span class="sparkle">✦</span>
                    </div>
                </div>
                <p class="footer-description">המאבק על עתיד האנושות מתחיל כאן</p>
            </div>
            
            <div class="footer-section">
                <h3>ניווט מהיר</h3>
                <ul class="footer-nav">
                    <li><a href="index.html"><span class="nav-icon">🏠</span> דף הבית</a></li>
                    <li><a href="forces.html"><span class="nav-icon">⚔️</span>לוחמי האור</a></li>
                    <li><a href="powers.html"><span class="nav-icon">✨</span>כוחות</a></li>
                    <li><a href="contact.html"><span class="nav-icon">📧</span> צור קשר</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>הצטרפו למאבק</h3>
                <div class="footer-cta">
                    <a href="/join.html" class="cta-button">
                        <span class="cta-icon">⚡</span>
                        הצטרפו עכשיו
                    </a>
                </div>
                <div class="social-links">
                    <a href="#" class="social-link" title="פייסבוק"><span class="social-icon">📘</span></a>
                    <a href="#" class="social-link" title="טוויטר"><span class="social-icon">🐦</span></a>
                    <a href="#" class="social-link" title="אינסטגרם"><span class="social-icon">📸</span></a>
                    <a href="#" class="social-link" title="יוטיוב"><span class="social-icon">🎥</span></a>
                </div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <div class="footer-info">
                <p>כל הזכויות שמורות © ${new Date().getFullYear()} מלחמת הניצוצות</p>
                <div class="footer-links">
                    <a href="privacy.html">מדיניות פרטיות</a>
                    <span class="separator">|</span>
                    <a href="terms.html">תנאי שימוש</a>
                    <span class="separator">|</span>
                    <a href="sitemap.html">מפת האתר</a>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(footer);

  // אנימציה לניצוצות בלוגו
  const sparkles = footer.querySelectorAll(".sparkle");
  sparkles.forEach((sparkle, index) => {
    sparkle.style.animationDelay = `${index * 0.3}s`;
  });
}

document.addEventListener("DOMContentLoaded", createFooter);
