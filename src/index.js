const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const username = request.headers.username;
  const existName = users.find((user) => {
    if (user.username === username) return user;
  })

  if (existName) {
    next();
  } else {
    response.status(400).json({
      error: 'username invalid'
    });
  }

}

app.post('/users', (request, response) => {

  const { name, username } = request.body;
  const existName = users.find((user) => {
    if (user.name === name) return user;
  })

  if (existName) response.status(400).json({
    error: 'Mensagem do erro'
  });

  const objUsers = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }
  users.push(objUsers)

  response.status(201).json(objUsers);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const username = request.headers.username;
  const existUserId = users.findIndex(user => user.username === username)
  response.status(201).json(users[existUserId].todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body;
  const username = request.headers.username;

  const existUserId = users.findIndex(user => user.username === username)
  const todo = {
    id: uuidv4(), // precisa ser um uuid
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  users[existUserId].todos.push(todo);
  response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {

  const todoId = request.params.id;
  const username = request.headers.username;
  const { title, deadline } = request.body;

  const existUserId = users.findIndex(user => user.username === username)
  const existTodoIndex = users[existUserId].todos.findIndex(todo => todo.id === todoId)
  if (existTodoIndex < 0) {
    response.status(404).json({
      error: 'Mensagem do erro'
    });
  }
  users[existUserId].todos[existTodoIndex].title = title;
  users[existUserId].todos[existTodoIndex].deadline = new Date(deadline);

  response.status(201).json(users[existUserId].todos[existTodoIndex]);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {

  const todoId = request.params.id;
  const username = request.headers.username;
  const { title, deadline } = request.body;

  const existUserId = users.findIndex(user => user.username === username)

  const existTodoIndex = users[existUserId].todos.findIndex(todo => todo.id === todoId)

  if (existTodoIndex < 0) {
    response.status(404).json({
      error: 'Mensagem do erro'
    });
  }
  users[existUserId].todos[existTodoIndex].done = true;

  response.status(201).json(users[existUserId].todos[existTodoIndex]);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const todoId = request.params.id;
  const username = request.headers.username;
  const { title, deadline } = request.body;

  const existUserId = users.findIndex(user => user.username === username)

  const existTodoIndex = users[existUserId].todos.findIndex(todo => todo.id === todoId)

  if (existTodoIndex < 0) {
    response.status(404).json({
      error: 'Mensagem do erro'
    });
  }

  const newUsersTodo = users[existUserId].todos.filter(todo => todo.id !== todoId)

  users[existUserId].todos = newUsersTodo;

  response.status(204).json(users[existUserId].todos);
});

module.exports = app;