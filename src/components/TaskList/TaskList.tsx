import { useState } from 'react';
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

const HeaderComponent = ({ title, totalTaskCount }: { title: string; totalTaskCount: number }) => {
  return (
    <div>
      {title}
      <span>{`(${totalTaskCount})`}</span>
    </div>
  );
};

const ChildComponent = ({
  title,
  dueDate,
  status,
  category,
}: {
  title: string;
  dueDate: string;
  status: string;
  category: string;
}) => {
  return (
    <div className={styles.taskListHeader}>
      <div className={styles.taskListHeaderTitle}>
        <input type="checkbox" />
        <IconCircleCheckFilled
          className={clsx(styles.checkIcon, styles.inProgressIcon, {
            [styles.completedIcon]: status === 'Completed',
          })}
        />
        {title}
      </div>
      <div className={styles.taskText}>{dueDate}</div>
      <Tooltip options={['To-Do', 'In Progress', 'Completed']}>
        <button className={styles.statusButton}>{status}</button>
      </Tooltip>
      <div className={styles.taskText}>{category}</div>
      <Tooltip
        options={['Edit', 'Delete']}
        className={styles.menuButton}
        innerClassName={{ tooltipContent: styles.menuTooltipContent }}
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

  return (
    <>
      {showInput ? (
        <div className={styles.addTaskContainer}>
          <div className={styles.taskListHeader}>
            <input type="text" placeholder="Task Title" className={styles.addTaskInput} />
            <button className={styles.addDateButton}>
              <IconCalendar className={styles.addDateIcon} />
              Add Date
            </button>
            <Tooltip options={['To-Do', 'In Progress', 'Completed']}>
              <button className={styles.addCategoryButton}>
                <IconPlus className={styles.addCategoryIcon} />
              </button>
            </Tooltip>
            <Tooltip options={['Work', 'Personal', 'Other']}>
              <button className={styles.addCategoryButton}>
                <IconPlus className={styles.addCategoryIcon} />
              </button>
            </Tooltip>
          </div>
          <div className={styles.addTaskListFooter}>
            <button className={styles.addTaskButton}>
              Add
              <IconCornerDownLeft className={styles.addTaskIcon} />
            </button>
            <button className={styles.cancelButton} onClick={() => setShowInput(false)}>
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

export default function TaskList() {
  const collapseItems = [
    {
      header: <HeaderComponent title="TODO" totalTaskCount={10} />,
      children: [
        <AddTaskComponent />,
        <ChildComponent title="Task 1" dueDate="2021-01-01" status="To-Do" category="Work" />,
      ],
      innerClassNames: {
        wrapper: styles.toDoPanel,
      },
      key: 'toDo',
    },
    {
      header: <HeaderComponent title="IN PROGRESS" totalTaskCount={10} />,
      children: (
        <ChildComponent title="Task 2" dueDate="2021-01-01" status="In Progress" category="Work" />
      ),
      innerClassNames: {
        wrapper: styles.inProgressPanel,
      },
      key: 'inProgress',
    },
    {
      header: <HeaderComponent title="Completed" totalTaskCount={10} />,
      children: (
        <ChildComponent title="Task 3" dueDate="2021-01-01" status="Completed" category="Work" />
      ),
      innerClassNames: {
        wrapper: styles.completedPanel,
      },
      key: 'completed',
    },
  ];

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
