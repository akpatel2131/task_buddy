import React, { useState, useEffect } from 'react';
import styles from './taskModal.module.css';
import { useTaskContext, Task } from '../../context/TaskContext';
import Calender from '../../uiComponents/DatePicker/Calender';
import FileUpload from '../../uiComponents/FileUpload/FileUpload';
import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconList,
  IconListNumbers,
  IconX,
} from '@tabler/icons-react';
import Divider from '../../uiComponents/Divider/Divider';
import { format } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskData?: Task;
}

export type TaskFormData = {
  name: string;
  description: string;
  due_date: string;
  status: string;
  category: string;
  activity: Array<{
    action: string;
    timestamp: string;
  }>;
  attachments?: File[];
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskData }) => {
  const { createTask, updateTask, user } = useTaskContext();
  const defaultFormData: Task = {
    name: '',
    description: '',
    due_date: '',
    status: 'TODO',
    category: 'Work',
    activity: [],
    userId: user?.uid || '',
    attachments: [],
  };
  const [formData, setFormData] = useState<Task>(defaultFormData);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    if (taskData) {
      setFormData({
        name: taskData.name,
        description: taskData.description || '',
        due_date: taskData.due_date,
        status: taskData.status,
        category: taskData.category,
        activity: taskData.activity,
        userId: taskData.userId,
        attachments: taskData.attachments,
      });
      setCharacterCount(taskData.description?.length || 0);
    } else {
      setFormData(defaultFormData);
    }
  }, [taskData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      const timestamp = new Date().toLocaleString();
      const updatedActivity = [
        ...formData.activity,
        {
          action: taskData ? 'Task updated' : 'Task created',
          timestamp,
        },
      ];

      const updatedFormData = {
        ...formData,
        activity: updatedActivity,
      };

      if (taskData?.id) {
        await updateTask(taskData.id, updatedFormData);
      } else {
        await createTask(updatedFormData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 300) {
      setFormData((prev) => ({ ...prev, description: text }));
      setCharacterCount(text.length);
    }
  };

  const handleFormatText = (command: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.description.substring(start, end);

    let newText = formData.description;
    let formattedText = '';

    switch (command) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'bullet':
        formattedText = selectedText
          .split('\n')
          .map((line) => `• ${line}`)
          .join('\n');
        break;
      case 'number':
        formattedText = selectedText
          .split('\n')
          .map((line, i) => `${i + 1}. ${line}`)
          .join('\n');
        break;
    }

    newText =
      formData.description.substring(0, start) +
      formattedText +
      formData.description.substring(end);
    setFormData((prev) => ({ ...prev, description: newText }));
  };

  const handleFilesChange = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      attachments: files,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{!taskData && 'Create Task'}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <IconX size={20} />
          </button>
        </div>
        <form className={styles.formContainer}>
          <div className={styles.detailsContainer}>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Task title"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                className={styles.titleInput}
              />
            </div>

            <div className={styles.formGroup}>
              <textarea
                placeholder="Spend 30 minutes on cardio and strength training exercises to stay active and healthy."
                value={formData.description}
                onChange={handleDescriptionChange}
                className={styles.descriptionInput}
                aria-expanded={false}
              />
              <div className={styles.textEditorToolbar}>
                <button type="button" onClick={() => handleFormatText('bold')}>
                  <IconBold size={20} />
                </button>
                <button type="button" onClick={() => handleFormatText('italic')}>
                  <IconItalic size={20} />
                </button>
                <button type="button" onClick={() => handleFormatText('strikethrough')}>
                  <IconStrikethrough size={20} />
                </button>
                <div className={styles.divider} />
                <button type="button" onClick={() => handleFormatText('bullet')}>
                  <IconList size={20} />
                </button>
                <button type="button" onClick={() => handleFormatText('number')}>
                  <IconListNumbers size={20} />
                </button>
                <div className={styles.characterCount}>{characterCount}/300 characters</div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Task Category*</label>
                <div className={styles.categoryButtons}>
                  <button
                    type="button"
                    className={`${styles.categoryButton} ${formData.category === 'Work' ? styles.active : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, category: 'Work' }))}
                  >
                    Work
                  </button>
                  <button
                    type="button"
                    className={`${styles.categoryButton} ${formData.category === 'Personal' ? styles.active : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, category: 'Personal' }))}
                  >
                    Personal
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Due on*</label>
                <Calender
                  selectedDate={formData.due_date}
                  onChange={(date) => setFormData((prev) => ({ ...prev, due_date: date }))}
                  minDate={new Date().toISOString().split('T')[0]}
                >
                  <input type="date" className={styles.dateInput} value={formData.due_date} />
                </Calender>
              </div>

              <div className={styles.formGroup}>
                <label>Task Status*</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as 'TODO' | 'IN-PROGRESS' | 'COMPLETED',
                    }))
                  }
                  className={styles.statusSelect}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN-PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
            <FileUpload files={formData.attachments || []} onFilesChange={handleFilesChange} />
          </div>

          {taskData && (
            <>
              <Divider vertical />
              <div className={styles.activitySection}>
                <h3 className={styles.activityTitle}>Activity</h3>
                <Divider className={styles.activityDivider} />
                <div className={styles.activityList}>
                  {formData.activity.map((activity, index) => (
                    <div key={index} className={styles.activityItem}>
                      <span>{activity.action}</span>
                      <span className={styles.timestamp}>{activity.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </form>
        <div className={styles.buttonGroup}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            CANCEL
          </button>
          <button type="submit" className={styles.submitButton} onClick={handleSubmit}>
            {taskData ? 'UPDATE' : 'CREATE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
