import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface User {
  uid: string,
  email: string | null,
  displayName: string | null,
  photoURL: string | null
}

interface TaskContextType {
  tasks: Task[];
  user: User | null;
  setUser: (user: User | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);

  return (
    <TaskContext.Provider value={{ tasks, user, setUser }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}; 