import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL; // Access the environment variable

  useEffect(() => {
    console.log("apiUrlapiUrlapiUrl",apiUrl)
    fetch(`${apiUrl}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data));
  }, [apiUrl]);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch(`${apiUrl}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setText('');
  };

  const toggleTodo = async (id) => {
    const res = await fetch(`${apiUrl}/todos/${id}`, { method: 'PUT' });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === id ? updated : t));
  };

  const deleteTodo = async (id) => {
    await fetch(`${apiUrl}/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t.id !== id));
  };

  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    await fetch(`${apiUrl}/todos/${id}/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText })
    });
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, text: editText } : todo
    );
    setTodos(updatedTodos);
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="app-container">
      <div className="todo-card">
        <h1>📝 My Todo List</h1>
        <div className="input-section">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a new task"
          />
          <button onClick={addTodo}>Add</button>
        </div>
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>
              {editingId === todo.id ? (
                <input
                  className="edit-input"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(todo.id);
                  }}
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => toggleTodo(todo.id)}
                  className={todo.done ? 'done' : ''}
                >
                  {todo.text}
                </span>
              )}
              <div className="action-buttons">
                {editingId === todo.id ? (
                  <button className="save-btn" onClick={() => saveEdit(todo.id)}>💾</button>
                ) : (
                  <button className="edit-btn" onClick={() => startEdit(todo.id, todo.text)}>✏️</button>
                )}
                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
