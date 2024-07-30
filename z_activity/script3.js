const apiUrl = "https://jsonplaceholder.typicode.com/todos";

const getTodos = () => {
  fetch(apiUrl + "?_limit=5")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((todo) => addTodoToDOM(todo));
    });
};

const addTodoToDOM = (todo) => {
  const div = document.createElement("div");
  div.className = 'todo-item';
  div.innerHTML = `<span class="todo-text">${todo.title}</span>`;
  div.setAttribute("data-id", todo.id);

  if (todo.completed) {
    div.classList.add("done");
  }

  // Add click event for toggling
  div.addEventListener('click', () => toggleTodo(div));

  // Add double click event for deletion
  div.addEventListener('dblclick', () => deleteTodo(todo.id));

  document.getElementById("todo-list").appendChild(div);
};

const createTodo = (e) => {
  e.preventDefault();
  const newTodo = {
    title: e.target.firstElementChild.value,
    completed: false,
  };
  fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(newTodo),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => addTodoToDOM(data));
  
  e.target.firstElementChild.value = ''; // Clear input field 
};

const toggleTodo = (todoElement) => {
  todoElement.classList.toggle('done');
  const id = todoElement.getAttribute('data-id');
  const completed = todoElement.classList.contains('done');

  fetch(`${apiUrl}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed: completed }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .catch(error => console.error('Error updating todo:', error));
};

const deleteTodo = (id) => {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (res.ok) {
        document.querySelector(`[data-id="${id}"]`).remove();
      }
    })
    .catch(error => console.error('Error deleting todo:', error));
};

const init = () => {
  document.addEventListener("DOMContentLoaded", getTodos);
  document.querySelector("#todo-form").addEventListener("submit", createTodo);
};

init();

