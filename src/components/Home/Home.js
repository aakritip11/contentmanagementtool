import React, { useEffect, useState } from "react";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import ProjectModal from "./ProjectModal/ProjectModal";
import designerIcon from "../../assets/PM.png";
import { getAllProjects, getAllProjectsForUser } from "../../Firebase";
import styles from "./Home.module.css";

function Home(props) {
  const navigate = useNavigate();
  const isAuthenticated = props.auth ? true : false;

  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});

  const handleNextButtonClick = () => {
    if (isAuthenticated) navigate("/account");
    else navigate("/login");
  };

  const fetchAllProjects = async () => {
    const result = await getAllProjects();
    setProjectsLoaded(true);
    if (!result) {
      return;
    }

    const tempProjects = [];
    result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }));

    setProjects(tempProjects);
  };

  const handleProjectCardClick = (project) => {
    setShowProjectModal(true);
    setProjectDetails(project);
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return (
    <div className={styles.container}>
      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          details={projectDetails}
        />
      )}
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

      {/* <div className={styles.body}>
        {isAuthenticated ? <p className={styles.title}>Your Projects</p> : <p className={styles.title}></p>}
        <div className={styles.projects}>
          {isAuthenticated && projectsLoaded ? (
            projects.length > 0 ? (
              projects.map((item) => (
                <div
                  className={styles.project}
                  key={item.pid}
                  onClick={() => handleProjectCardClick(item)}
                >
                  <div className={styles.image}>
                    <img
                      src={
                        item.thumbnail ||
                        "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"
                      }
                      alt="Project thumbnail"
                    />
                  </div>
                  <p className={styles.title}>{item.title}</p>
                </div>
              ))
            ) : (
              <p className={styles.title1}>No projects found</p>
            )
          ) : (
            <p className={styles.title1}>"You will be able to see all your projects once you are Logged In"</p>
          )}
        </div>
      </div> */}
    </div>
  );
}

export default Home;