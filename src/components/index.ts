// This file exports components used in the application, allowing for modular development.

// Example of a simple component
export const Header = () => {
    const header = document.createElement('header');
    header.innerHTML = '<h1>Welcome to Modern Web Project</h1>';
    return header;
};

export const Footer = () => {
    const footer = document.createElement('footer');
    footer.innerHTML = '<p>&copy; 2023 Modern Web Project</p>';
    return footer;
};

// Exporting components for use in other parts of the application
export { Header, Footer };