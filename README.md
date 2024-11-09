### Getting the project running

For this project, you will have to run a backend server, that serves a basic HTTP API.
And a second server, that will server your frontend files (HTML page and linked documents).

#### Prerequesites

The backend and frontend servers are coded with NodeJS. You need to have a working
installation of NodeJS on your machine. Normally if you followed the first assignment,
that is already the case.

#### Running the backend

1. Go to the `backend/` directory. 
2. The first time, you need to install the project dependencies

    ```
    npm install
    ```

    No need to run this command again after that.

3. Start the server with

    ```
    npm run start
    ```

4. By default the backend server runs on port 3014, you can access it at http://localhost:3014

#### Starting the frontend server

1. Go to the `frontend/` directory. 
2. The first time, you need to install the project dependencies

    ```
    npm install
    ```

    No need to run this command again after that.

3. Start the server with

    ```
    npm run start
    ```

4. By default the frontend server runs on port 8000, you can access it at http://localhost:8000.
   The project frontend page is at http://localhost:8000/chatroom/index.html


### Server API Specifiation

If you are using VS Code, "Thunder Client" is an excellent plugin that helps you easily
test a server API by hand-crafting HTTP requests.

Another tool is Postman, but it requires to make an account by them.

You can also use the command line tool `curl`, although it's not as user friendly.

#### `GET /chat`

Get the whole content of the chatroom. The response is a JSON object that looks like this :

```json
[{
    "author": "admin",
    "message": "Welcome to our chat"
}, {
    "author": "Bérénice",
    "message": "Que le jour recommence ..."
}, ...]
```

#### `POST /message`

Send a message to the chat. The request body must contain a JSON object
of the following format : 

```json
{
    "author": "Antiochus",
    "message": "Puisse le ciel verser..."
}
```

The fields must not be empty. If an invalid request is sent, the server
will respond with a `400` status code.

In case of success, the server will respond with the content of the chat
in JSON format (same format than a request to `GET /chat`)

#### `GET /censorMessage?message=Message content`

This this a censoring service provided by the server. You can send it a message,
and it will check it and return a censored version if it detects obscene words
such as "Lyon", "PSG", "English" or "England". This is a Stéphanois and French 
chatroom after all.

The message you want to censor must be sent with the query parameter `message`.

> **Note:** In javascript, you will not manually build the URL with the query
> parameter after the `?` sign. There are available functions in JS to make that for you.

The server will respond with the following JSON object :

```json
{
    "originalMessage": "The English are a lovely people", 
    "censoredMessage": "The *** are a lovely people"
}
```

#### `DELETE /chat`

Making a request to this endpoint resets the content of the chatroom. 
 
The server replies with a JSON object representing the content of the chatroom
after it has been cleared (same format than `GET /chat`)
