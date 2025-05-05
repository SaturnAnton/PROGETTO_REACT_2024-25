import './Navbar.css';

const NavbarElements = [
    { label: 'CARICA', href: "/" },
    { label: 'ANALIZZA', href: "/analizza" },
    { label: 'TREND', href: "/trending" },
];

function Navbar() {
    return (
        <nav>
            <ul className="navbar-list">
                {NavbarElements.map((element, index) => (
                    <li key={index}>
                        <a href={element.href}>{element.label}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;
