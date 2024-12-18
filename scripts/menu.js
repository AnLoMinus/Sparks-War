// יצירת סגנון CSS עבור התפריט
const menuStyle = document.createElement("style");
menuStyle.textContent = `
    .nav-menu {
        background: linear-gradient(45deg, #1a1a1a, #2c2c2c);
        padding: 1rem;
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        gap: 2rem;
    }

    .nav-item {
        position: relative;
    }

    .nav-link {
        color: #fff;
        text-decoration: none;
        font-size: 1.1rem;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .nav-link:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }

    .nav-link.active {
        background: rgba(255, 255, 255, 0.2);
    }

    /* תפריט המבורגר למובייל */
    .menu-toggle {
        display: none;
        font-size: 1.5rem;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .menu-toggle {
            display: block;
        }

        .nav-list {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #1a1a1a;
            padding: 1rem;
        }

        .nav-list.active {
            display: flex;
        }
    }
`;

document.head.appendChild(menuStyle);

// יצירת התפריט
const createMenu = () => {
  const menuItems = [
    { text: "דף הבית", icon: "🏠", href: "index.html" },
    { text: "עונות", icon: "📺", href: "seasons.html" },
    { text: "שחקנים", icon: "👥", href: "players.html" },
    { text: "פרקים", icon: "📖", href: "chapters.html" },
    { text: "כוחות", icon: "⚔️", href: "powers.html" },
    { text: "לוחמי האור", icon: "✨", href: "forces.html" },
    { text: "גלריה", icon: "🖼️", href: "gallery.html" },
    { text: "צור קשר", icon: "📧", href: "contact.html" },
  ];

  const nav = document.createElement("nav");
  nav.className = "nav-menu";

  // כפתור המבורגר למובייל
  const menuToggle = document.createElement("button");
  menuToggle.className = "menu-toggle";
  menuToggle.innerHTML = "☰";
  menuToggle.setAttribute("aria-label", "תפריט");

  const ul = document.createElement("ul");
  ul.className = "nav-list";

  menuItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "nav-item";

    const a = document.createElement("a");
    a.className = "nav-link";
    a.href = item.href;
    a.innerHTML = `${item.icon} ${item.text}`;

    if (window.location.pathname.endsWith(item.href)) {
      a.classList.add("active");
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(menuToggle);
  nav.appendChild(ul);

  // הוספת אירוע לחיצה לתפריט המבורגר
  menuToggle.addEventListener("click", () => {
    ul.classList.toggle("active");
  });

  // הוספת התפריט לראש העמוד
  const header = document.querySelector(".header");
  header.parentNode.insertBefore(nav, header);
};

// הפעלת התפריט כשהדף נטען
document.addEventListener("DOMContentLoaded", createMenu);
