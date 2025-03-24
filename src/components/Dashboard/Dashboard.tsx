import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { debounce } from 'lodash';
import {
  IconLayoutList,
  IconLayoutKanban,
  IconSearch,
  IconPlus,
  IconChevronDown,
  IconLogout,
} from '@tabler/icons-react';
import styles from './dashboard.module.css';
import loginTask from '../../image/loginTask.svg';
import TaskList from '../TaskList/TaskList';
import TaskBoard from '../TaskBoard/TaskBoard';
import { useTaskContext, Task } from '../../context/TaskContext';
import TaskModal from '../TaskModal/TaskModal';

type ViewType = 'list' | 'board';

const Dashboard: React.FC = () => {
  const { tasks, deleteTask } = useTaskContext();
  const navigate = useNavigate();
  const [tabOption, setTabOption] = useState<ViewType>('list');
  const [category, setCategory] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elementData, setElementData] = useState<Task | undefined>();
  const [data, setData] = useState<Task[]>(tasks);

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleSearch = debounce((query: string) => {
    const filteredTasks = tasks.filter((task) =>
      task.name.toLowerCase().includes(query.toLowerCase())
    );
    setData(filteredTasks);
  }, 500);

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
        <header className={styles.header}>
          <div className={styles.logo}>
            <img src={loginTask} alt="TaskBuddy Logo" />
            <span>TaskBuddy</span>
          </div>
          <div className={styles.userProfile}>
            <img src={user.photoURL} alt={user.displayName} />
            <span>{user.displayName}</span>
          </div>
        </header>

        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <button
              className={clsx(styles.viewButton, {
                [styles.active]: tabOption === 'list',
              })}
              onClick={() => setTabOption('list')}
            >
              <IconLayoutList size={20} />
              List
            </button>
            <button
              className={clsx(styles.viewButton, {
                [styles.active]: tabOption === 'board',
              })}
              onClick={() => setTabOption('board')}
            >
              <IconLayoutKanban size={20} />
              Board
            </button>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <IconLogout size={20} />
            Logout
          </button>
        </div>
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Filter by : </div>
            <div className={styles.select}>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">ALL</option>
                <option value="Work">WORK</option>
                <option value="Personal">PERSONAL</option>
              </select>
              <IconChevronDown size={20} className={styles.selectIcon} />
            </div>
            <div className={styles.select}>
              <select value={dueDate} onChange={(e) => setDueDate(e.target.value)}>
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
              <input
                type="search"
                placeholder="Search"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <button className={styles.addTaskButton} onClick={() => setIsModalOpen(true)}>
              ADD TASK
            </button>
          </div>
        </div>
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
