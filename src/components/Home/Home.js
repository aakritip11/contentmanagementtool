import React, { useEffect, useState } from "react";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Blog from "../Blog/Blog";
import AOS from "aos"; 
import "aos/dist/aos.css";

function Home(props) {
  const navigate = useNavigate();
  const isAuthenticated = props.auth ? true : false;
  
  const handleNextButtonClick = () => {
    if (isAuthenticated) navigate("/account");
    else navigate("/login");
  };

  useEffect(() => {
    AOS.init(); 
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <p className={styles.heading} data-aos="fade-right" data-aos-duration="1000">Vibrant Agora</p>
          <p className={styles.subHeading} data-aos="fade-down" data-aos-duration="1000">
            {/* Simplify content management with our powerful and user-friendly tool.  */}
            {/* Our innovative platform empowers you to effortlessly create, edit, and organize your content. 
            Collaborate with your team, streamline your workflow, and bring your ideas to life with ease.
            Whether you're a seasoned professional or just getting started, our tool is designed to meet your content management needs.
            Unlock a world of possibilities with features like intuitive drag-and-drop editing, real-time collaboration, and seamless integration with popular content formats.
            From blog posts to multimedia presentations, our tool adapts to your creative process, helping you deliver impactful content every time.
            Say goodbye to clunky interfaces and complex workflows. Our content management solution is built for efficiency, so you can focus on what truly matters: crafting engaging content that captivates your audience.
            Join the ranks of content creators who trust our tool to elevate their work and achieve their goals. Experience content management reimagined and get started today! */}
          </p>
        </div>
        
      <div className={styles.start}>
        <div className={styles.down}>
          <button onClick={handleNextButtonClick}>
            {isAuthenticated ? "Manage your Blogs" : "Get Started"}{" "}
            <ArrowRight />{" "}
          </button>
        </div>
      </div>
      </div>
      <div className={styles.blogtitleWrapper}>
          <p className={styles.blogtitle} data-aos="fade-right" data-aos-duration="1000">Featured Blogs</p>
        </div>
      <Blog /> 
    </div>
  );
}

export default Home;
