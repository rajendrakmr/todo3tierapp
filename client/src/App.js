import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL; // Access the environment variable

  useEffect(() => {
    console.log("apiUrlapiUrlapiUrl", apiUrl);
    axios.get(`${apiUrl}/todos`)
      .then(res => setTodos(res.data))
      .catch(err => console.error("Error fetching todos:", err));
  }, [apiUrl]);

  const addTodo = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(`${apiUrl}/todos`, { text });
      setTodos([...todos, res.data]);
      setText('');
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const res = await axios.put(`${apiUrl}/todos/${id}`);
      setTodos(todos.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${apiUrl}/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(`${apiUrl}/todos/${id}/edit`, { text: editText });
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, text: editText } : todo
      );
      setTodos(updatedTodos);
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error("Error saving edit:", err);
    }
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
