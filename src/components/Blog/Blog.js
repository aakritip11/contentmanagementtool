import React, { useState, useEffect } from "react";
import { blogdata } from "./blogdata";
import styles from "./Blog.module.css";
import { getAllProjects } from "../../Firebase";

function Blog(props) {
    const [blogdatastates, setBlogdataStates] = useState({});
    const [projectsLoaded, setProjectsLoaded] = useState(false);
    const [projects, setProjects] = useState([]);
    const [projectStates, setProjectStates] = useState({});
  
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

    useEffect(() => {
        fetchAllProjects();
    }, []);

    return (
        <div className={styles.container}>
            {blogdata.map((item, index) => (
                <div className={styles.project} key={item.title} data-aos="fade-left" data-aos-duration="1000">
                    <div className={styles.content}>
                        <div className={styles.image}>
                            <img src={item.image} alt="" className={styles.img} />
                        </div>
                        <div className={styles.details}>
                            <p className={styles.title}>{item.title}</p>
                            <p className={styles.author}>~{item.author}</p>
                            <p className={styles.overview}>{item.overview}</p>
                            <p className={styles.description}>
                                {blogdatastates[index] && item.description.length > 500 ? item.description : `${item.description.slice(0, 500)}`}
                                {item.description.length > 500 && (
                                    <span className={styles.readMore} onClick={() => setBlogdataStates({...blogdatastates, [index]: !blogdatastates[index]})}>
                                        {blogdatastates[index] ? "Read Less" : "....Read More"}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        {/* <div className={styles.project}> */}
          {projectsLoaded ? (
              projects.map((item, index) => (
                <div className={styles.project} key={item.pid} data-aos="fade-left" data-aos-duration="1000">
                    <div className={styles.content}>
                  <div className={styles.image}>
                    <img src={item.thumbnail || "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"} alt="Project thumbnail" className={styles.img}/>
                  </div>
                  <div className={styles.details}>
                            <p className={styles.title}>{item.title}</p>
                            <p className={styles.author}>~{item.author}</p>
                            <p className={styles.overview}>{item.overview}</p>
                            <p className={styles.description}>
                                {item.description && (projectStates[index] && item.description.length > 500 ? item.description : `${item.description.slice(0, 500)}`)}
                                {item.description && item.description.length > 500 && (
                                    <span className={styles.readMore} onClick={() => setProjectStates({...projectStates, [index]: !projectStates[index]})}>
                                    {projectStates[index] ? "Read Less" : "....Read More"}
                                    </span>
                                )}
                            </p>
                        </div>
                        </div>
                </div>
              ))
            ) : ("")
          }
        </div>
        // </div>
    );
}

export default Blog;
