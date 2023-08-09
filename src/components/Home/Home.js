import React, { useEffect, useState } from "react";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import designerIcon from "../../assets/PM.png";
import styles from "./Home.module.css";

function Home(props) {
  const navigate = useNavigate();
  const isAuthenticated = props.auth ? true : false;

  const handleNextButtonClick = () => {
    if (isAuthenticated) navigate("/account");
    else navigate("/login");
  };

  useEffect(() => {
    
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <p className={styles.heading}>Viligant Agile</p>
          <p className={styles.subHeading}>Simplify project management with our powerful and user-friendly tool.</p>
          <p className={styles.subHeading}>Stay organized, collaborate effectively, and achieve project goals efficiently.</p> 
          <p className={styles.subHeading}>Boost productivity and achieve success with our all-in-one project management solution.</p>
          <button onClick={handleNextButtonClick}>
            {isAuthenticated ? "Manage your Projects" : "Get Started"}{" "}
            <ArrowRight />{" "}
          </button>
        </div>
        <div className={styles.right}>
          <img src={designerIcon} alt="Projects" />
        </div>
      </div>
    </div>
  );
}

export default Home;
