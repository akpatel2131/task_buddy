import React, { useCallback, useState } from 'react';
import Collapse from '../../uiComponents/Collapse/Collapse';
import Divider from '../../uiComponents/Divider/Divider';
import styles from './taskList.module.css';
import {
  IconCalendar,
  IconCircleCheckFilled,
  IconCornerDownLeft,
  IconDots,
  IconPlus,
} from '@tabler/icons-react';
import Tooltip from '../../uiComponents/Tooltip/Tooltip';
import clsx from 'clsx';
import { Task, useTaskContext } from '../../context/TaskContext';
import Calender from '../../uiComponents/DatePicker/Calender';
import Loader from '../../uiComponents/Loader/Loader';
import TaskSelection from '../TaskSelection/TaskSelection';
import delete_icon from '../../image/delete_icon.svg';
import edit_icon from '../../image/edit_icon.svg';
import { useWindowSize } from 'react-use';

interface HeaderProps {
  title: string;
  totalTaskCount: number;
}

const HeaderComponent: React.FC<HeaderProps> = ({ title, totalTaskCount }) => (
  <div className={styles.headerContainer}>
    <span>{title}</span>
    <span>{`(${totalTaskCount})`}</span>
  </div>
);

interface TaskItemProps {
  task: Task;
  handleDeleteTask: (taskId: string) => void;
  setElementData: (task: Task) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedTasks: Task[];
  setSelectedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isSelectionMode: boolean;
}

export const actionOptions = [
  {
    title: 'Edit',
    image: edit_icon,
    className: styles.editIcon,
  },
  {
    title: 'Delete',
    image: delete_icon,
    className: styles.deleteIcon,
  },
];

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  handleDeleteTask,
  setElementData,
  setIsModalOpen,
  selectedTasks,
  setSelectedTasks,
}) => {
  const { updateTask } = useTaskContext();
  const isSelected = selectedTasks.some((selectedTask) => selectedTask.id === task.id);
  const { width } = useWindowSize();
  const largeScreen = width > 768;

  const toggleTaskSelection = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isSelected) {
      setSelectedTasks(selectedTasks.filter((selectedTask) => selectedTask.id !== task.id));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const handleStatusChange = useCallback(
    async (value: string) => {
      const statusMap: Record<string, 'TODO' | 'IN-PROGRESS' | 'COMPLETED'> = {
        'To-Do': 'TODO',
        'In Progress': 'IN-PROGRESS',
        Completed: 'COMPLETED',
      };

      const data = {
        ...task,
        status: statusMap[value] || (value as 'TODO' | 'IN-PROGRESS' | 'COMPLETED'),
      };

      if (task.id) await updateTask(task.id, data);
    },
    [updateTask, task]
  );

  return (
    <button
      className={clsx(styles.taskListHeader, styles.taskListHeaderButton, {
        [styles.selected]: isSelected,
      })}
      onClick={(event) => {
        event.stopPropagation();
        setElementData(task);
        setIsModalOpen(true);
      }}
    >
      <div className={styles.taskListHeaderTitle}>
        <input
          type="checkbox"
          onClick={(e) => toggleTaskSelection(e)}
          checked={selectedTasks.some((selectedTask) => selectedTask.id === task.id)}
        />
        <IconCircleCheckFilled
          className={clsx(styles.checkIcon, styles.inProgressIcon, {
            [styles.completedIcon]: task.status === 'COMPLETED',
          })}
        />
        <span className={clsx({ [styles.completeText]: task.status === 'COMPLETED' })}>
          {task.name}
        </span>
      </div>
      {largeScreen && (
        <>
          <div className={styles.taskText}>{task.due_date}</div>
          <Tooltip
            options={['To-Do', 'In Progress', 'Completed']}
            onSelect={handleStatusChange}
            innerClassName={{ trigger: styles.trigger }}
          >
            <button className={styles.statusButton}>{task.status}</button>
          </Tooltip>
          <div className={styles.taskText}>{task.category}</div>
          <Tooltip
            options={actionOptions}
            className={styles.menuButton}
            innerClassName={{ tooltipContent: styles.menuTooltipContent }}
            onSelect={(option) => {
              if (option === 'Delete' && task.id) {
                handleDeleteTask(task.id);
              }
              if (option === 'Edit') {
                setElementData(task);
                setIsModalOpen(true);
              }
            }}
          >
            <button>
              <IconDots stroke={1.5} />
            </button>
          </Tooltip>
        </>
      )}
    </button>
  );
};

const AddTaskForm: React.FC = () => {
  const [showInput, setShowInput] = useState(false);
  const { createTask, user } = useTaskContext();
  const defaultFormData = {
    name: '',
    description: '',
    due_date: '',
    status: '',
    category: '',
    activity: [],
    userId: user?.uid || '',
  };

  const [formData, setFormData] = useState<Task>(defaultFormData);

  const handleAddTask = () => {
    createTask(formData);
    setShowInput(false);
    setFormData(defaultFormData);
  };

  const handleSelectOption = (value: string, option: string) => {
    const statusMap: Record<string, string> = {
      'To-Do': 'TODO',
      'In Progress': 'IN-PROGRESS',
      Completed: 'COMPLETED',
    };

    setFormData((prev) => ({
      ...prev,
      [option]: option === 'status' ? statusMap[value] || value : value,
    }));
  };

  if (!showInput) {
    return (
      <button className={styles.addButton} onClick={() => setShowInput(true)}>
        <IconPlus className={styles.addTaskIcon} />
        Add Task
      </button>
    );
  }

  return (
    <div className={styles.addTaskContainer}>
      <div className={styles.taskListHeader}>
        <input
          type="text"
          placeholder="Task Title"
          className={styles.addTaskInput}
          onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
        />
        <Calender
          selectedDate={formData.due_date}
          onChange={(date) => handleSelectOption(date, 'due_date')}
          minDate={new Date().toISOString().split('T')[0]}
        >
          <button className={styles.addDateButton}>
            <IconCalendar className={styles.addDateIcon} />
            Add Date
          </button>
        </Calender>
        {formData.status ? (
          <div className={styles.formDataValue}>{formData.status}</div>
        ) : (
          <Tooltip
            options={['To-Do', 'In Progress', 'Completed']}
            onSelect={(value) => handleSelectOption(value, 'status')}
          >
            <button className={styles.addCategoryButton}>
              <IconPlus className={styles.addCategoryIcon} />
            </button>
          </Tooltip>
        )}
        {formData.category ? (
          <div className={styles.formDataValue}>{formData.category}</div>
        ) : (
          <Tooltip
            options={['Work', 'Personal', 'Other']}
            onSelect={(value) => handleSelectOption(value, 'category')}
          >
            <button className={styles.addCategoryButton}>
              <IconPlus className={styles.addCategoryIcon} />
            </button>
          </Tooltip>
        )}
      </div>
      <div className={styles.addTaskListFooter}>
        <button className={styles.addTaskButton} onClick={handleAddTask}>
          Add
          <IconCornerDownLeft className={styles.addTaskIcon} />
        </button>
        <button
          className={styles.cancelButton}
          onClick={() => {
            setShowInput(false);
            setFormData(defaultFormData);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const EmptyTaskList: React.FC<{ status: string }> = ({ status }) => (
  <div className={styles.emptyTaskList}>No Tasks in {status}</div>
);

interface TaskListProps {
  tasks: Task[];
  handleDeleteTask: (taskId: string) => void;
  setElementData: (task: Task) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  handleDeleteTask,
  setElementData,
  setIsModalOpen,
}) => {
  const { loading } = useTaskContext();
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const isSelectionMode = selectedTasks.length > 0;
  const { width } = useWindowSize();
  const largeScreen = width > 768;

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  const toDoTasks = tasks.filter((task) => task.status === 'TODO');
  const inProgressTasks = tasks.filter((task) => task.status === 'IN-PROGRESS');
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED');

  const renderTaskItems = (taskList: Task[]) =>
    taskList.length === 0
      ? [
          <EmptyTaskList
            key="empty"
            status={
              taskList === toDoTasks
                ? 'To-Do'
                : taskList === inProgressTasks
                  ? 'In Progress'
                  : 'Completed'
            }
          />,
        ]
      : taskList.map((task, index) => (
          <React.Fragment key={task.id || index}>
            <TaskItem
              task={task}
              handleDeleteTask={handleDeleteTask}
              setElementData={setElementData}
              setIsModalOpen={setIsModalOpen}
              selectedTasks={selectedTasks}
              setSelectedTasks={setSelectedTasks}
              isSelectionMode={isSelectionMode}
            />
            {taskList.length > index + 1 && <Divider />}
          </React.Fragment>
        ));

  const collapseItems = [
    {
      header: <HeaderComponent title="Todo" totalTaskCount={toDoTasks.length} />,
      children: [<AddTaskForm key="add-task" />, <Divider />, ...renderTaskItems(toDoTasks)],
      innerClassNames: { wrapper: styles.toDoPanel },
      key: 'toDo',
    },
    {
      header: <HeaderComponent title="In-progress" totalTaskCount={inProgressTasks.length} />,
      children: renderTaskItems(inProgressTasks),
      innerClassNames: { wrapper: styles.inProgressPanel },
      key: 'inProgress',
    },
    {
      header: <HeaderComponent title="Completed" totalTaskCount={completedTasks.length} />,
      children: renderTaskItems(completedTasks),
      innerClassNames: { wrapper: styles.completedPanel },
      key: 'completed',
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      {largeScreen && (
        <>
          <Divider className={styles.divider} />
          <div className={styles.taskListHeader}>
            <div>Task Name</div>
            <div>Due on</div>
            <div>Task Status</div>
            <div>Task Category</div>
          </div>
        </>
      )}
      <Collapse items={collapseItems} innerClassNames={{ container: styles.collapseContainer }} />
      <TaskSelection
        selectedTasks={selectedTasks}
        setSelectedTasks={setSelectedTasks}
        onClearSelection={clearSelection}
      />
    </div>
  );
};

export default TaskList;
