import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import loginGoogle from "../../image/loginGoogle.svg";
import loginTask from "../../image/loginTask.svg";
import loginCircles from "../../image/loginCircles.svg";
import loginTaskPage from "../../image/logingTaskPage.svg";
import styles from './login.module.css';
import { useTaskContext } from '../../context/TaskContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useTaskContext();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData)
      navigate('/home');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <img src={loginTask} alt="TaskBuddy Logo" />
            <span>TaskBuddy</span>
          </div>
          <p className={styles.subtitle}>Streamline your workflow and track progress effortlessly</p>
          <p className={styles.subtitle}>with our all-in-one task management app.</p>
        </div>
        <button onClick={handleGoogleLogin} className={styles.googleButton}>
          <img src={loginGoogle} alt="Google Logo" />
          Continue with Google
        </button>
      </div>
      <div className={styles.previewSection}>
        <img 
          src={loginCircles} 
          alt="Task Management Preview" 
          className={styles.previewCirclesImage}
        />
        <img 
          src={loginTaskPage} 
          alt="Task Management Preview" 
          className={styles.previewTaskImage}
        />
      </div>
    </div>
  );
};

export default Login; 