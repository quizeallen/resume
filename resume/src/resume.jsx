import { useEffect } from "react"

function Resume() {
    useEffect(() => {
        const elements = document.querySelectorAll("main, footer");

        setTimeout(() => {
            elements.forEach(el => {
                el.style.opacity = "1";
            });
            document.body.style.overflow = "auto";
        }, 3000);

        // Handle scroll event to detect when h3 comes into view
        const handleScroll = () => {
            const header = document.querySelector(".resume header");
            const firstH3 = document.querySelector("main h3");

            if (firstH3 && header) {
                const h3Rect = firstH3.getBoundingClientRect();
                // Add class when h3 is in the upper portion of the viewport (when you've scrolled to it)
                if (h3Rect.top < 200) {
                    header.classList.add("scroll-to-h3");
                } else {
                    header.classList.remove("scroll-to-h3");
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Call once on mount to set initial state
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="resume-container">
            <div className="resume">
                <header>
                    <h1>Mar'Quize Allen</h1>
                    <h2>Full-Stack Web Developer</h2>
                </header>

                <main>
                    <h3>About Me</h3>
                    <p>
                        I’m a new full-stack developer who builds everything from responsive interfaces to full backend systems. My work includes <span>styling</span>, <span id="animation">animation</span>, API development, database design, and complete project architectures. Throughout this website, each skill I mention is styled in a way that reflects how I use it—clean layout for HTML, dynamic motion for JavaScript, and modern component-based structure for React.
                    </p>
                    <p>
                        You’ve already seen my <span className="a">animation work</span> in the welcome section of the site, where I combine smooth transitions with responsive UI behavior. You’ll also notice my backend experience in the login system. The authentication flow is powered by Node.js, Express, and a connected SQL database, and it’s built to keep the experience simple and reliable. If you log in using the same username you registered with, the system recognizes you and lets you right back in.
                    </p>
                    <p>
                        I also work with Azure, handle secure connections, design tables, and write clean SQL queries for storing user accounts, submitted data, and client information. My projects consistently focus on real-world functionality, scalability, and straightforward user experience.
                    </p>
                    <p>
                        Whether it’s building a fast front-end interface, crafting reusable components, designing a backend API, or connecting everything to a database, I aim to deliver efficient and modern solutions every time.
                    </p>
                    <h3>Downloads (PDF)</h3>
                    <ul>
                        <li>
                            <a href="/downloads/Marquize_Allen_Resume.pdf" download="Marquize_Allen_Resume.pdf">
                                Resume
                            </a>
                        </li>
                        <li>
                            <a href="/downloads/Marquize_Allen_Cover_Letter.pdf" download="Marquize_Allen_Cover_Letter.pdf">
                                Cover Letter
                            </a>
                        </li>
                        <li>
                            <a href="/downloads/Mimo_App_Certificate.pdf" download="Mimo_App_Certificate.pdf">
                                Mimo App Certificate
                            </a>
                        </li>
                        <li>
                            <a href="/downloads/CIW-Internet-Business-Associate.pdf" download="CIW-Internet-Business-Associate.pdf">
                                CIW Internet Business Associate Certificate
                            </a>
                        </li>
                        <li>
                            <a href="/downloads/CIW-Network-Technology-Associate.pdf" download="CIW-Network-Technology-Associate.pdf">
                                CIW Network Technology Associate Certificate
                            </a>
                        </li>
                        <li>
                            <a href="/downloads/CIW-Site-Development-Associate.pdf" download="CIW-Site-Development-Associate.pdf">
                                CIW Site Development Associate Certificate
                            </a>
                        </li>
                        <li>
                            <a href="/downloads/CIW-Web-Foundations-Associate.pdf" download="CIW-Web-Foundations-Associate.pdf">
                                CIW Web Foundations Associate Certificate
                            </a>
                        </li>
                    </ul>
                    <h3>Skills</h3>
                    <ul>
                        <li>HTML</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                        <li>React</li>
                        <li>Node.js</li>
                        <li>Express</li>
                        <li>SQL</li>
                        <li>Azure</li>
                    </ul>
                    <h3>Contact Me</h3>
                    <ul>
                        <li><a href="mailto:quizeallen@outlook.com">Email: quizeallen@outlook.com</a></li>
                        <li><a href="tel:+13188405539">Phone: (318) 840-5539</a></li>
                        <li><a href="https://www.linkedin.com/in/mar-quize-allen-9802b4385" target="blank">LinkedIn: Mar'Quize Allen</a></li>
                        <li><a href="https://github.com/quizeallen/" target="blank">GitHub: quizeallen</a></li>
                    </ul>
                </main>
                <footer>
                    <small>© 2025 Mar'Quize Allen</small>
                </footer>
            </div>
        </div>
    );
}
export default Resume;