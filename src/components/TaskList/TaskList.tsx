import { useCallback, useState } from 'react';
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

const HeaderComponent = ({ title, totalTaskCount }: { title: string; totalTaskCount: number }) => {
  return (
    <div>
      {title}
      <span>{`(${totalTaskCount})`}</span>
    </div>
  );
};

const ChildComponent = ({
  task,
  handleDeleteTask,
  setElementData,
  setIsModalOpen,
}: {
  task: Task;
  handleDeleteTask: (taskId: string) => void;
  setElementData: (task: Task) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const { updateTask } = useTaskContext();

  const handleStatusChange = useCallback(
    async (value: string) => {
      if (value === 'To-Do') value = 'TODO';
      else if (value === 'In Progress') value = 'IN-PROGRESS';
      else value = 'COMPLETED';

      const data = {
        name: task.name,
        due_date: task.due_date,
        status: value,
        category: task.category,
        activity: task.activity,
        userId: task.userId,
      };

      if (task.id) await updateTask(task.id, data);
    },
    [updateTask, task]
  );

  return (
    <div className={styles.taskListHeader}>
      <div className={styles.taskListHeaderTitle}>
        <input type="checkbox" />
        <IconCircleCheckFilled
          className={clsx(styles.checkIcon, styles.inProgressIcon, {
            [styles.completedIcon]: task.status === 'COMPLETED',
          })}
        />
        <span className={clsx({ [styles.completeText]: task.status === 'COMPLETED' })}>
          {task.name}
        </span>
      </div>
      <div className={styles.taskText}>{task.due_date}</div>
      <Tooltip
        options={['To-Do', 'In Progress', 'Completed']}
        onSelect={(value) => handleStatusChange(value)}
      >
        <button className={styles.statusButton}>{task.status}</button>
      </Tooltip>
      <div className={styles.taskText}>{task.category}</div>
      <Tooltip
        options={['Edit', 'Delete']}
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
    </div>
  );
};

const AddTaskComponent = () => {
  const [showInput, setShowInput] = useState(false);
  const { createTask, user } = useTaskContext();
  const defaultFormData = {
    name: '',
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
    if (option === 'status') {
      if (value === 'To-Do') {
        value = 'TODO';
      }
      if (value === 'In Progress') {
        value = 'IN-PROGRESS';
      }
      if (value === 'Completed') {
        value = 'COMPLETED';
      }
    }

    const data = {
      ...formData,
      [option]: value,
    };

    setFormData(data);
  };

  return (
    <>
      {showInput ? (
        <div className={styles.addTaskContainer}>
          <div className={styles.taskListHeader}>
            <input
              type="text"
              placeholder="Task Title"
              className={styles.addTaskInput}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
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
                onSelect={(value) => {
                  handleSelectOption(value, 'status');
                }}
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
      ) : (
        <button className={styles.addButton} onClick={() => setShowInput(true)}>
          <IconPlus className={styles.addTaskIcon} />
          Add Task
        </button>
      )}
      <Divider />
    </>
  );
};

export const EmptyTaskList = ({ status }: { status: string }) => {
  return <div className={styles.emptyTaskList}>No Tasks in {status}</div>;
};

export default function TaskList({
  tasks,
  handleDeleteTask,
  setElementData,
  setIsModalOpen,
}: {
  tasks: Task[];
  handleDeleteTask: (taskId: string) => void;
  setElementData: (task: Task) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  const { loading } = useTaskContext();
  const toDoTasks = tasks.filter((task) => task.status === 'TODO');
  const inProgressTasks = tasks.filter((task) => task.status === 'IN-PROGRESS');
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED');

  const collapseItems = [
    {
      header: <HeaderComponent title="TODO" totalTaskCount={toDoTasks.length} />,
      children: [
        <AddTaskComponent />,
        ...(toDoTasks.length === 0
          ? [<EmptyTaskList status="To-Do" />]
          : toDoTasks.map((task) => (
              <ChildComponent
                key={task.id}
                task={task}
                handleDeleteTask={handleDeleteTask}
                setElementData={setElementData}
                setIsModalOpen={setIsModalOpen}
              />
            ))),
      ],
      innerClassNames: {
        wrapper: styles.toDoPanel,
      },
      key: 'toDo',
    },
    {
      header: <HeaderComponent title="IN PROGRESS" totalTaskCount={inProgressTasks.length} />,
      children:
        inProgressTasks.length === 0
          ? [<EmptyTaskList status="In Progress" />]
          : inProgressTasks.map((task) => (
              <ChildComponent
                key={task.id}
                task={task}
                handleDeleteTask={handleDeleteTask}
                setElementData={setElementData}
                setIsModalOpen={setIsModalOpen}
              />
            )),
      key: 'inProgress',
    },
    {
      header: <HeaderComponent title="Completed" totalTaskCount={completedTasks.length} />,
      children:
        completedTasks.length === 0
          ? [<EmptyTaskList status="Completed" />]
          : completedTasks.map((task) => (
              <ChildComponent
                key={task.id}
                task={task}
                handleDeleteTask={handleDeleteTask}
                setElementData={setElementData}
                setIsModalOpen={setIsModalOpen}
              />
            )),
      innerClassNames: {
        wrapper: styles.completedPanel,
      },
      key: 'completed',
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <Divider className={styles.divider} />
      <div className={styles.taskListHeader}>
        <div>Task Name</div>
        <div>Due on</div>
        <div>Task Status</div>
        <div>Task Category</div>
      </div>
      <Collapse items={collapseItems} innerClassNames={{ container: styles.collapseContainer }} />
    </div>
  );
}
