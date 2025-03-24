import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useEffectOnce } from 'react-use';

interface Activity {
  created_date: string;
  name: string;
  activity_text: string;
}

export interface Task {
  id?: string;
  name: string;
  due_date: string;
  status: string;
  category: string;
  activity: Activity[];
  userId: string;
}

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface TaskContextType {
  tasks: Task[];
  user: User | null;
  setUser: (user: User | null) => void;
  createTask: (task: Omit<Task, 'id' | 'userId'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffectOnce(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  });

  // Fetch tasks when user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'userId'>) => {
    if (!user) return;

    setLoading(true);
    try {
      const newTask = {
        ...taskData,
        userId: user.uid,
        activity: [
          {
            created_date: new Date().toISOString(),
            name: user.displayName || 'Unknown',
            activity_text: 'Task created',
          },
        ],
      };

      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      setTasks((prev) => [...prev, { ...newTask, id: docRef.id }]);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) return;

    setLoading(true);
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const updatedActivity = {
        created_date: new Date().toISOString(),
        name: user.displayName || 'Unknown',
        activity_text: 'Task updated',
      };

      await updateDoc(taskRef, {
        ...updates,
        activity: [...(tasks.find((t) => t.id === taskId)?.activity || []), updatedActivity],
      });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...updates,
                activity: [...task.activity, updatedActivity],
              }
            : task
        )
      );
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        user,
        setUser,
        createTask,
        updateTask,
        deleteTask,
        loading,
        error,
      }}
    >
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
