import React, { useState, useEffect } from 'react';
import styles from './taskSelection.module.css';
import { Task, useTaskContext } from '../../context/TaskContext';
import { IconX } from '@tabler/icons-react';
import Tooltip from '../../uiComponents/Tooltip/Tooltip';

interface TaskSelectionProps {
  selectedTasks: Task[];
  setSelectedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onClearSelection: () => void;
}

const TaskSelection: React.FC<TaskSelectionProps> = ({
  selectedTasks,
  setSelectedTasks,
  onClearSelection,
}) => {
  const { updateTask, deleteTask } = useTaskContext();
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const handleDeleteTasks = async () => {
    try {
      for (const task of selectedTasks) {
        if (task.id) {
          await deleteTask(task.id);
        }
      }
      onClearSelection();
    } catch (error) {
      console.error('Error deleting tasks:', error);
    }
  };

  const handleStatusChange = async (status: 'TODO' | 'IN-PROGRESS' | 'COMPLETED') => {
    try {
      for (const task of selectedTasks) {
        if (task.id) {
          const timestamp = new Date().toLocaleString();
          const updatedActivity = [
            ...task.activity,
            {
              action: `Status changed to ${status}`,
              timestamp,
            },
          ];

          await updateTask(task.id, {
            ...task,
            status,
            activity: updatedActivity,
          });
        }
      }
      setIsStatusMenuOpen(false);
      onClearSelection();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(`.${styles.statusDropdown}`) &&
        !target.closest(`.${styles.statusButton}`)
      ) {
        setIsStatusMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (selectedTasks.length === 0) return null;

  return (
    <div className={styles.selectionBar}>
      <div className={styles.selectionInfo}>
        <span>{selectedTasks.length} Tasks Selected</span>
        <button onClick={onClearSelection} className={styles.clearButton}>
          <IconX size={20} />
        </button>
      </div>
      <div className={styles.actions}>
        <div className={styles.statusContainer}>
          <Tooltip
            options={['To-Do', 'In Progress', 'Completed']}
            onSelect={(option) => {
              const statusMap: Record<string, 'TODO' | 'IN-PROGRESS' | 'COMPLETED'> = {
                'To-Do': 'TODO',
                'In Progress': 'IN-PROGRESS',
                Completed: 'COMPLETED',
              };
              handleStatusChange(statusMap[option] as 'TODO' | 'IN-PROGRESS' | 'COMPLETED');
            }}
            innerClassName={{
              tooltipContent: styles.tooltipContent,
              option: styles.option,
            }}
          >
            <button className={styles.statusButton}>Status</button>
          </Tooltip>
        </div>
        <button onClick={handleDeleteTasks} className={styles.deleteButton}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskSelection;
