# LIBRARY REST API

The Library Management API is a RESTful service designed to facilitate the management of library resources, including books and user accounts. This API allows administrators and authenticated users to perform various operations related to the library's inventory and user management.

## Features

- User Authentication and Authorization:
  - Register: Create a new user account.
  - Login: Authenticate users and generate session tokens.
  - Admin Access: Special endpoints restricted to administrators for managing library resources.
- Book Management:
  - Get Books: Retrieve a list of all books.
  - Get Book by ID: Fetch details of a specific book by its ID.
  - Get Books by Title: Search for books by their title.
  - Get Books by Genre: Retrieve books belonging to a specific genre.
  - Create Book: Add a new book to the library (admin access required).
  - Update Book: Modify details of an existing book (admin access required).
  - Delete Book: Remove a book from the library (admin access required).
  - Borrow and Return: Borrow and return books (authentication required).
- Resource Management:
  - Get Resources: Retrieve a list of all resources.
  - Get Resource by ID: Fetch details of a specific resource by its ID.
  - Get Resources by Type: Search for resources by their type.
  - Get Resources by Location: Retrieve resources available in a specific location.
  - Create Resource: Add a new resource to the library (admin access required).
  - Update Resource: Modify details of an existing resource (admin access required).
  - Delete Resource: Remove a resource from the library (admin access required).
  - Borrow and Return: Borrow and return resources (authentication required).

## Technologies Used

Dillinger uses a number of open source projects to work properly:

- Node.js : Server-side JavaScript runtime.
- Express.js : Web framework for building RESTful APIs.
- MongoDB : NoSQL database for storing user and library resource data.
- Mongoose : ODM (Object Data Modeling) library for MongoDB and Node.js.
- express-validator : Middleware for validating request data.
- dotenv : Module to load environment variables from a .env file.
- Vercel : Hosting platform for deployment.

## Installation

- Clone the repository.

```sh
       git clone https://github.com/viv59/api-creation.git
```

- Install dependencies using npm install.

```sh
      npm install
```

- Configure environment variables in a .env file.
- Running the Server:

```sh
      npm run dev
```

- Endpoints:
  Refer to the [API documentation](https://documenter.getpostman.com/view/31981526/2sA3kYhKCU "Postman Documentation") for details on available endpoints, request formats, and responses.

## Contact Me

mail : viveksgaikwad24@gmail.com

## License

MIT

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[dill]: https://github.com/joemccann/dillinger
[git-repo-url]: https://github.com/joemccann/dillinger.git
[john gruber]: http://daringfireball.net
[df1]: http://daringfireball.net/projects/markdown/
[markdown-it]: https://github.com/markdown-it/markdown-it
[Ace Editor]: http://ace.ajax.org
[node.js]: http://nodejs.org
[Twitter Bootstrap]: http://twitter.github.com/bootstrap/
[jQuery]: http://jquery.com
[@tjholowaychuk]: http://twitter.com/tjholowaychuk
[express]: http://expressjs.com
[AngularJS]: http://angularjs.org
[Gulp]: http://gulpjs.com
[PlDb]: https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md
[PlGh]: https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md
[PlGd]: https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md
[PlOd]: https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md
[PlMe]: https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md
[PlGa]: https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md
