import express from "express";

export default (router: express.Router) => {
  router.get("/", (req, res) => {
    res.send(`
      <h1>Welcome to the Library API</h1>
      <p>This API allows you to manage library resources, including books and user accounts.</p>
      <h2>Available Endpoints</h2>
      <ul>
        <li><strong>GET /randombook</strong> - Retrieve a random book</li>
        <li><strong>GET /books</strong> - Retrieve a list of all books.</li>
        <li><strong>GET /books/:id</strong> - Retrieve a book by its ID.</li>
        <li><strong>GET /books/title/:title</strong> - Retrieve a book by its title.</li>
        <li><strong>GET /books/genre/:genre</strong> - Retrieve a list of books by genre.</li>
        <li><strong>GET /resources</strong> - Retrieve a list of all resources.</li>
        <li><strong>GET /randomresource</strong> - Retrieve a random resource.</li>
        <li><strong>GET /resources/:id</strong> - Retrieve a resource by its ID.</li>
        <li><strong>GET /resources/type/:type</strong> - Retrieve a list of resources by type.</li>
        <li><strong>GET /resources/location/:location</strong> - Retrieve a list of resources by location.</li>
        <li><strong>GET /users</strong> - Retrieve a list of all users (admin access required).</li>
        <li><strong>POST /auth/register</strong> - Register a new user.</li>
        <li><strong>POST /auth/login</strong> - Log in with email and password.</li>
        <li><strong>POST /createbook</strong> - Create a book (admin access required).</li>
        <li><strong>POST /createresource</strong> - Create a resource (admin access required).</li>
        <li><strong>PATCH /books/:id</strong> - Update book information (admin access required).</li>
        <li><strong>PATCH /resources/:id</strong> - Update resource information (admin access required).</li>
        <li><strong>DELETE /books/:id</strong> - Delete a book (admin access required).</li>
        <li><strong>DELETE /resources/:id</strong> - Delete a resource (admin access required).</li>
        <li><strong>POST /books/borrow/:id</strong> - Borrow a book (authentication required).</li>
        <li><strong>POST /books/return/:id</strong> - Return a borrowed book (authentication required).</li>
        <li><strong>POST /resources/borrow/:id</strong> - Borrow a resource (authentication required).</li>
        <li><strong>POST /resources/return/:id</strong> - Return a borrowed resource (authentication required).</li>
      </ul>
      <p>For more information, please refer to the <a href="https://documenter.getpostman.com/view/31981526/2sA3kYhKCU">API Documentation</a>. Contact: <a href="mailto:viveksgaikwad@gmail.com">mail</a></p>
    `);
  });
};
