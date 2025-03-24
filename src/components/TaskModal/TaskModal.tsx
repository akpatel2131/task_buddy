import React, { useState, useEffect } from 'react';
import styles from './taskModal.module.css';
import { useTaskContext, Task } from '../../context/TaskContext';
import DatePicker from '../../uiComponents/DatePicker/Calender';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskData?: Task;
}

export type TaskFormData = {
  name: string;
  due_date: string;
  status: string;
  category: string;
  activity: [];
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskData }) => {
  const { createTask, updateTask } = useTaskContext();
  const [formData, setFormData] = useState<Task>({
    name: '',
    due_date: '',
    status: 'TODO',
    category: 'Work',
    activity: [],
    userId: '',
  });

  useEffect(() => {
    if (taskData) {
      setFormData({
        name: taskData.name,
        due_date: taskData.due_date,
        status: taskData.status,
        category: taskData.category,
        activity: taskData.activity,
        userId: taskData.userId,
      });
    }
  }, [taskData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (taskData?.id) {
        await updateTask(taskData.id, {
          name: formData.name,
          due_date: formData.due_date,
          status: formData.status,
          category: formData.category,
          activity: formData.activity,
          userId: formData.userId,
        });
      } else {
        await createTask(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving taskData:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{taskData ? 'Edit Task' : 'Create New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Task Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="due_date">Due Date</label>
            <DatePicker
              selectedDate={formData.due_date}
              onChange={(date) => setFormData((prev) => ({ ...prev, due_date: date }))}
              minDate={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as 'TODO' | 'IN-PROGRESS' | 'COMPLETED',
                }))
              }
            >
              <option value="TODO">To Do</option>
              <option value="IN-PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value as 'Work' | 'Personal',
                }))
              }
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {taskData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
