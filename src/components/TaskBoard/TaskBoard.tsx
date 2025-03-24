import React from 'react';
import styles from './taskBoard.module.css';
import { IconDots } from '@tabler/icons-react';
import Tooltip from '../../uiComponents/Tooltip/Tooltip';
import { Task, useTaskContext } from '../../context/TaskContext';
import { EmptyTaskList } from '../TaskList/TaskList';
import Loader from '../../uiComponents/Loader/Loader';

const TaskBoard = ({
  tasks,
  handleDeleteTask,
  setElementData,
  setIsModalOpen,
}: {
  tasks: Task[];
  handleDeleteTask: (taskId: string) => void;
  setElementData: (task: Task) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const { loading } = useTaskContext();
  const tasksByStatus = {
    TODO: tasks.filter((task) => task.status === 'TODO'),
    'IN-PROGRESS': tasks.filter((task) => task.status === 'IN-PROGRESS'),
    COMPLETED: tasks.filter((task) => task.status === 'COMPLETED'),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return styles.todoStatus;
      case 'IN-PROGRESS':
        return styles.inProgressStatus;
      case 'COMPLETED':
        return styles.completedStatus;
      default:
        return '';
    }
  };

  const renderTaskList = (status: 'TODO' | 'IN-PROGRESS' | 'COMPLETED') => {
    const statusTasks = tasksByStatus[status];

    return (
      <div className={styles.taskColumn}>
        <div className={styles.columnHeader}>
          <div className={`${styles.statusBadge} ${getStatusColor(status)}`}>{status}</div>
        </div>
        <div className={styles.taskList}>
          {statusTasks.length === 0 ? (
            <div className={styles.emptyState}>
              {`No Tasks ${
                status === 'IN-PROGRESS'
                  ? 'In Progress'
                  : status === 'COMPLETED'
                    ? 'Completed'
                    : 'in To-Do'
              }`}
            </div>
          ) : statusTasks.length > 0 ? (
            statusTasks.map((task) => (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <h3 className={styles.taskTitle}>{task.name}</h3>
                  <Tooltip
                    options={['Edit', 'Delete']}
                    onSelect={(option) => {
                      if (option === 'Delete' && task.id) {
                        handleDeleteTask(task.id);
                      }
                      if (option === 'Edit') {
                        setElementData(task);
                        setIsModalOpen(true);
                      }
                    }}
                    innerClassName={{ tooltipContent: styles.menuTooltipContent }}
                  >
                    <button className={styles.menuButton}>
                      <IconDots size={20} />
                    </button>
                  </Tooltip>
                </div>
                <div className={styles.taskFooter}>
                  <span className={styles.category}>{task.category}</span>
                  <span className={styles.dueDate}>{task['due_date']}</span>
                </div>
              </div>
            ))
          ) : (
            <EmptyTaskList status={status} />
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.taskBoard}>
      {renderTaskList('TODO')}
      {renderTaskList('IN-PROGRESS')}
      {renderTaskList('COMPLETED')}
    </div>
  );
};

export default TaskBoard;
