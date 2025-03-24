import React from 'react';
import styles from './taskBoard.module.css';
import { IconDots } from '@tabler/icons-react';
import Tooltip from '../../uiComponents/Tooltip/Tooltip';
import { Task, useTaskContext } from '../../context/TaskContext';
import Loader from '../../uiComponents/Loader/Loader';

type TaskStatus = 'TODO' | 'IN-PROGRESS' | 'COMPLETED';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit }) => (
  <div className={styles.taskCard}>
    <div className={styles.taskHeader}>
      <h3 className={styles.taskTitle}>{task.name}</h3>
      <Tooltip
        options={['Edit', 'Delete']}
        onSelect={(option) => {
          if (option === 'Delete' && task.id) {
            onDelete(task.id);
          }
          if (option === 'Edit') {
            onEdit(task);
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
      <span className={styles.dueDate}>{task.due_date}</span>
    </div>
  </div>
);

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks, onDelete, onEdit }) => {
  const getStatusColor = (status: TaskStatus) => {
    const statusColors: Record<TaskStatus, string> = {
      TODO: styles.todoStatus,
      'IN-PROGRESS': styles.inProgressStatus,
      COMPLETED: styles.completedStatus,
    };
    return statusColors[status];
  };

  const getStatusLabel = (status: TaskStatus) => {
    const statusLabels: Record<TaskStatus, string> = {
      TODO: 'To-Do',
      'IN-PROGRESS': 'In Progress',
      COMPLETED: 'Completed',
    };
    return statusLabels[status];
  };

  return (
    <div className={styles.taskColumn}>
      <div className={styles.columnHeader}>
        <div className={`${styles.statusBadge} ${getStatusColor(status)}`}>{status}</div>
      </div>
      <div className={styles.taskList}>
        {tasks.length === 0 ? (
          <div className={styles.emptyState}>{`No Tasks ${getStatusLabel(status)}`}</div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} onEdit={onEdit} />
          ))
        )}
      </div>
    </div>
  );
};

interface TaskBoardProps {
  tasks: Task[];
  handleDeleteTask: (taskId: string) => void;
  setElementData: (task: Task) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  handleDeleteTask,
  setElementData,
  setIsModalOpen,
}) => {
  const { loading } = useTaskContext();

  const tasksByStatus = {
    TODO: tasks.filter((task) => task.status === 'TODO'),
    'IN-PROGRESS': tasks.filter((task) => task.status === 'IN-PROGRESS'),
    COMPLETED: tasks.filter((task) => task.status === 'COMPLETED'),
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.taskBoard}>
      <TaskColumn
        status="TODO"
        tasks={tasksByStatus.TODO}
        onDelete={handleDeleteTask}
        onEdit={(task) => {
          setElementData(task);
          setIsModalOpen(true);
        }}
      />
      <TaskColumn
        status="IN-PROGRESS"
        tasks={tasksByStatus['IN-PROGRESS']}
        onDelete={handleDeleteTask}
        onEdit={(task) => {
          setElementData(task);
          setIsModalOpen(true);
        }}
      />
      <TaskColumn
        status="COMPLETED"
        tasks={tasksByStatus.COMPLETED}
        onDelete={handleDeleteTask}
        onEdit={(task) => {
          setElementData(task);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
};

export default TaskBoard;
