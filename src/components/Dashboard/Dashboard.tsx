import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { debounce } from 'lodash';
import {
  IconLayoutList,
  IconLayoutKanban,
  IconSearch,
  IconChevronDown,
  IconLogout,
} from '@tabler/icons-react';
import styles from './dashboard.module.css';
import loginTask from '../../image/loginTask.svg';
import TaskList from '../TaskList/TaskList';
import TaskBoard from '../TaskBoard/TaskBoard';
import { useTaskContext, Task } from '../../context/TaskContext';
import TaskModal from '../TaskModal/TaskModal';
import list_icon from '../../image/list_icon.svg';
import board_icon from '../../image/board_icon.svg';
import { useWindowSize } from 'react-use';

type ViewType = 'list' | 'board';
type FilterType = 'TODAY' | 'UPCOMING' | 'OVERDUE' | '';

interface HeaderProps {
  user: {
    photoURL: string;
    displayName: string;
  };
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => (
  <header className={styles.header}>
    <div className={styles.logo}>
      <img src={loginTask} alt="TaskBuddy Logo" />
      <span>TaskBuddy</span>
    </div>
    <div className={styles.userProfile}>
      <div className={styles.userAvatar}>{user.displayName.charAt(0).toUpperCase()}</div>
      <span>{user.displayName}</span>
    </div>
  </header>
);

interface ViewToggleProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange, onLogout }) => (
  <div className={styles.filterSection}>
    <div className={styles.filterGroup}>
      <button
        className={clsx(styles.viewButton, { [styles.active]: view === 'list' })}
        onClick={() => onViewChange('list')}
      >
        <img src={list_icon} alt="list" />
        List
      </button>
      <button
        className={clsx(styles.viewButton, { [styles.active]: view === 'board' })}
        onClick={() => onViewChange('board')}
      >
        <img src={board_icon} alt="board" />
        Board
      </button>
    </div>
    <button className={styles.logoutButton} onClick={onLogout}>
      <IconLogout size={20} />
      Logout
    </button>
  </div>
);

interface FilterSectionProps {
  category: string;
  dueDate: FilterType;
  onCategoryChange: (value: string) => void;
  onDueDateChange: (value: FilterType) => void;
  onSearch: (value: string) => void;
  onAddTask: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  category,
  dueDate,
  onCategoryChange,
  onDueDateChange,
  onSearch,
  onAddTask,
}) => {
  const { width } = useWindowSize();
  const largeScreen = width > 768;

  return (
    <div className={styles.filterSection}>
      {!largeScreen && (
        <div className={styles.filterGroup}>
          <button className={styles.addTaskButton} onClick={onAddTask}>
            ADD TASK
          </button>
        </div>
      )}
      <div className={styles.filterGroup}>
        <div className={styles.filterGroupTitle}>Filter by : </div>
        <div className={styles.select}>
          <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
            <option value="">ALL</option>
            <option value="Work">WORK</option>
            <option value="Personal">PERSONAL</option>
          </select>
          <IconChevronDown size={20} className={styles.selectIcon} />
        </div>
        <div className={styles.select}>
          <select value={dueDate} onChange={(e) => onDueDateChange(e.target.value as FilterType)}>
            <option value="">ALL</option>
            <option value="TODAY">TODAY</option>
            <option value="UPCOMING">UPCOMING</option>
            <option value="OVERDUE">OVERDUE</option>
          </select>
          <IconChevronDown size={20} className={styles.selectIcon} />
        </div>
      </div>
      <div className={styles.filterGroup}>
        <div className={styles.searchBox}>
          <IconSearch size={20} className={styles.searchIcon} />
          <input type="search" placeholder="Search" onChange={(e) => onSearch(e.target.value)} />
        </div>
        {largeScreen && (
          <button className={styles.addTaskButton} onClick={onAddTask}>
            ADD TASK
          </button>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { tasks, deleteTask } = useTaskContext();
  const navigate = useNavigate();
  const [tabOption, setTabOption] = useState<ViewType>('list');
  const [category, setCategory] = useState<string>('');
  const [dueDate, setDueDate] = useState<FilterType>('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elementData, setElementData] = useState<Task | undefined>();
  const [data, setData] = useState<Task[]>(tasks);
  const { width } = useWindowSize();
  const largeScreen = width > 768;

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleSearch = useCallback(
    debounce((query: string) => {
      const filteredTasks = tasks.filter((task) =>
        task.name.toLowerCase().includes(query.toLowerCase())
      );
      setData(filteredTasks);
    }, 500),
    [tasks]
  );

  const handleFilter = useCallback(() => {
    const today = new Date();
    let filteredTasks = [...tasks];

    if (category) {
      filteredTasks = filteredTasks.filter((task) => task.category === category);
    }

    if (dueDate === 'TODAY') {
      filteredTasks = filteredTasks.filter((task) => {
        const taskDate = new Date(task.due_date);
        return taskDate.toDateString() === today.toDateString();
      });
    } else if (dueDate === 'UPCOMING') {
      filteredTasks = filteredTasks.filter((task) => {
        const taskDate = new Date(task.due_date);
        return taskDate > today;
      });
    } else if (dueDate === 'OVERDUE') {
      filteredTasks = filteredTasks.filter((task) => {
        const taskDate = new Date(task.due_date);
        return taskDate < today;
      });
    }

    setData(filteredTasks);
  }, [tasks, category, dueDate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  return (
    <>
      <div className={styles.container}>
        <Header user={user} onLogout={handleLogout} />
        {largeScreen && (
          <ViewToggle view={tabOption} onViewChange={setTabOption} onLogout={handleLogout} />
        )}
        <FilterSection
          category={category}
          dueDate={dueDate}
          onCategoryChange={setCategory}
          onDueDateChange={setDueDate}
          onSearch={handleSearch}
          onAddTask={() => setIsModalOpen(true)}
        />
        {tabOption === 'list' ? (
          <TaskList
            tasks={data}
            handleDeleteTask={handleDeleteTask}
            setElementData={setElementData}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          <TaskBoard
            tasks={data}
            handleDeleteTask={handleDeleteTask}
            setElementData={setElementData}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setElementData(undefined);
        }}
        taskData={elementData}
      />
    </>
  );
};

export default Dashboard;
