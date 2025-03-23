import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  IconLayoutList,
  IconLayoutKanban,
  IconSearch,
  IconPlus,
  IconChevronDown,
  IconLogout,
} from "@tabler/icons-react";
import styles from "./dashboard.module.css";
import loginTask from "../../image/loginTask.svg";
import TaskList from "../TaskList/TaskList";

type ViewType = "list" | "board";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tabOption, setTabOption] = useState<ViewType>("list");
  const [category, setCategory] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
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
              [styles.active]: tabOption === "list",
            })}
            onClick={() => setTabOption("list")}
          >
            <IconLayoutList size={20} />
            List
          </button>
          <button
            className={clsx(styles.viewButton, {
              [styles.active]: tabOption === "board",
            })}
            onClick={() => setTabOption("board")}
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
          <div className={styles.select}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
            </select>
            <IconChevronDown size={20} className={styles.selectIcon} />
          </div>
          <div className={styles.select}>
            <select
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <IconChevronDown size={20} className={styles.selectIcon} />
          </div>
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.searchBox}>
            <IconSearch size={20} className={styles.searchIcon} />
            <input type="search" placeholder="Search"  />
          </div>
          <button className={styles.addTaskButton}>
            ADD TASK
          </button>
        </div>
      </div>
      <TaskList />

      {/* <div className={styles.taskList}>
        <div className={styles.taskSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              Todo
              <span className={styles.sectionCount}>(3)</span>
            </div>
            <button className={styles.addTaskButton}>

              ADD TASK
            </button>
          </div>
          <div className={styles.emptyState}>
            <p>No Tasks in To-Do</p>
          </div>
        </div>

        <div className={styles.taskSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              In-Progress
              <span className={styles.sectionCount}>(3)</span>
            </div>
          </div>
          <div className={styles.emptyState}>
            <p>No Tasks In Progress</p>
          </div>
        </div>

        <div className={styles.taskSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              Completed
              <span className={styles.sectionCount}>(3)</span>
            </div>
          </div>
          <div className={styles.emptyState}>
            <p>No Tasks Completed</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
