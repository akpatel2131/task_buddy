import React, { useState } from 'react';
import styles from './App.module.css';
import { TaskProvider, useTaskContext } from './context/TaskContext';

const TaskList: React.FC = () => {
  const { tasks, toggleTask, deleteTask } = useTaskContext();

  return (
    <div className={styles.taskList}>
      <h2 className={styles.subtitle}>टास्क लिस्ट</h2>
      {tasks.map((task) => (
        <div key={task.id} className={styles.taskItem}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title}
          </span>
          <button onClick={() => deleteTask(task.id)}>डिलीट</button>
        </div>
      ))}
    </div>
  );
};

const AddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const { addTask } = useTaskContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask(title);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addTaskForm}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="नया टास्क जोड़ें..."
      />
      <button type="submit">जोड़ें</button>
    </form>
  );
};

const App: React.FC = () => {
  return (
    <TaskProvider>
      <div className={styles.app}>
        <header className={styles.appHeader}>
          <h1 className={styles.title}>टास्क मैनेजर</h1>
          <AddTask />
          <TaskList />
        </header>
      </div>
    </TaskProvider>
  );
};

export default App; 