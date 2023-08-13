import React, { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { Camera, LogOut, Edit2, Trash } from "react-feather";
import { Link, Navigate } from "react-router-dom";
import InputControl from "../InputControl/InputControl";
import Spinner from "../Spinner/Spinner";
import ProjectForm from "./ProjectForm/ProjectForm";
import { auth, uploadImage, updateUserDatabase, getAllProjectsForUser, deleteProject } from "../../Firebase";
import styles from "./Account.module.css";
import pimg from "../../assets/pimg.png";
import { ExternalLink } from "react-feather/dist";
import AOS from "aos";
import "aos/dist/aos.css";

function Account(props) {
  const userDetails = props.userDetails;
  const isAuthenticated = props.auth;
  const imagePicker = useRef();

  const [progress, setProgress] = useState(0);
  const [profileImageUploadStarted, setProfileImageUploadStarted] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(
    userDetails.profileImage ||
      "https://th.bing.com/th/id/OIP.S_q99pD0qjlxGZ7lmcSVlAAAAA?pid=ImgDet&rs=1"
  );

  const [userProfileValues, setUserProfileValues] = useState({
    name: userDetails.name || "",
    email: userDetails.email || "",
    designation: userDetails.designation || "",
    phone: userDetails.phone || "",
    linkedin: userDetails.linkedin || "",
  });
  
  const [showSaveDetailsButton, setShowSaveDetailsButton] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectStates, setProjectStates] = useState({});
  const [isEditProjectModal, setIsEditProjectModal] = useState(false);
  const [editProject, setEditProject] = useState({});

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleCameraClick = () => {
    imagePicker.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setProfileImageUploadStarted(true);
    uploadImage(
      file,
      (progress) => {
        setProgress(progress);
      },
      (url) => {
        setProfileImageUrl(url);
        updateProfileImageToDatabase(url);
        setProfileImageUploadStarted(false);
        setProgress(0);
      },
      (err) => {
        console.error("Error->", err);
        setProfileImageUploadStarted(true);
      }
    );
  };

  const updateProfileImageToDatabase = (url) => {
    updateUserDatabase(
      { ...userProfileValues, profileImage: url },
      userDetails.uid
    );
  };

  const handleInputChange = (event, property) => {
    setShowSaveDetailsButton(true);

    setUserProfileValues((prev) => ({
      ...prev,
      [property]: event.target.value,
    }));
  };

  const saveDetailsToDatabase = async () => {
    if (!userProfileValues.name) {
      setErrorMessage("Name required");
      return;
    }

    setSaveButtonDisabled(true);
    await updateUserDatabase({ ...userProfileValues }, userDetails.uid);
    setSaveButtonDisabled(false);
    setShowSaveDetailsButton(false);
  };

  const fetchAllProjects = async () => {
    const result = await getAllProjectsForUser(userDetails.uid);
    if (!result) {
      setProjectsLoaded(true);
      return;
    }
    setProjectsLoaded(true);

    let tempProjects = [];
    result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }));
    setProjects(tempProjects);
  };

  const handleEditClick = (project) => {
    setIsEditProjectModal(true);
    setEditProject(project);
    setShowProjectForm(true);
  };

  const handleDeletion = async (pid) => {
    await deleteProject(pid);
    fetchAllProjects();
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  useEffect(() => {
    AOS.init();
  }, []);


  return isAuthenticated ? (
    <div className={styles.container}>
      {showProjectForm && (
        <ProjectForm
          onSubmission={fetchAllProjects}
          onClose={() => setShowProjectForm(false)}
          uid={userDetails.uid}
          name={userDetails.name}
          isEdit={isEditProjectModal}
          default={isEditProjectModal ? editProject : undefined} 
        />
      )}
      <div className={styles.header}>
        <p className={styles.heading} data-aos="fade-left" data-aos-duration="1000">
          <img src = {pimg}/> <span>{userProfileValues.name}</span>
        </p>
        <p className={styles.heading}>
          <span className={styles.toptext} data-aos="fade-up" data-aos-duration="1000">Vibrant Agora</span>
        </p>
        
        <div className={styles.logout} onClick={handleLogout} data-aos="fade-right" data-aos-duration="1000">
          <LogOut /> Logout
        </div>
      </div>
      <input
        ref={imagePicker}
        type="file"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <div className={styles.section}>
        <div className={styles.title} data-aos="fade-right" data-aos-duration="1000">Your profile</div>
        <div className={styles.profile}>
          <div className={styles.left}>
            <div className={styles.image} data-aos="fade-left" data-aos-duration="1000">
              <img src={profileImageUrl} alt="Profile image" />
              <div className={styles.camera} onClick={handleCameraClick}>
                <Camera />
              </div>
            </div>
            {profileImageUploadStarted ? (
              <p className={styles.progress}>
                {progress == 100
                  ? "Getting image url..."
                  : `${progress.toFixed(2)}% uploaded`}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className={styles.right} data-aos="fade-right" data-aos-duration="1000">
          <div className={styles.row}>
          <InputControl
                label="Name"
                placeholder="Enter your Name"
                value={userProfileValues.name}
                onChange={(event) => handleInputChange(event, "name")}
            />  
            <InputControl
                label="Designation"
                placeholder="eg. Full stack developer"
                value={userProfileValues.designation}
                onChange={(event) => handleInputChange(event, "designation")}
              />
              </div>
            
            <div className={styles.row}>
              <InputControl
                label="Email"
                placeholder="Enter your email"
                value={userProfileValues.email}
                onChange={(event) => handleInputChange(event, "email")}
              />
              <InputControl
                label="Phone"
                placeholder="Enter your phone number"
                value={userProfileValues.phone}
                onChange={(event) => handleInputChange(event, "phone")}
              />
              
            </div>
            <div className={styles.footer}>
              <p className={styles.error}>{errorMessage}</p>
              {showSaveDetailsButton && (
                <button
                  disabled={saveButtonDisabled}
                  className={styles.button}
                  onClick={saveDetailsToDatabase}
                >
                  Save Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className={styles.section}>
        <div className={styles.projectsHeader}>
          <div className={styles.title} data-aos="fade-right" data-aos-duration="1000">Your Blogs</div>
          <button className={styles.button} onClick={() => setShowProjectForm(true)} data-aos="fade-up" data-aos-duration="1000">
            Add Blog
          </button>
        </div>

        <div className={styles.projects}>
          {projectsLoaded ? (
            projects.length > 0 ? (
              projects.map((item, index) => (
                <div className={styles.project} key={item.title + index}>
                  <div className={styles.content}>
                  <p className={styles.image}><img
                src={
                  item?.thumbnail ||
                  "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"
                }
                alt="Project thumbnail"
              /></p>
                <div className={styles.details} data-aos="fade-left" data-aos-duration="1000">
                  <p className={styles.title}>{item.title}</p>
                  <p className={styles.author}>~{item.author}</p>
                  <p className={styles.overview}>{item.overview}</p>
                  <p className={styles.description}>{projectStates[index] && item.description.length > 500
                          ? item.description
                          : `${item.description.slice(0, 500)}`}
                        {item.description.length > 500 && (
                          <span
                            className={styles.readMore}
                            onClick={() =>
                              setProjectStates({
                                ...projectStates,
                                [index]: !projectStates[index]
                              })
                            }
                          >
                            {projectStates[index] ? "Read Less" : "....Read More"}
                          </span>
                        )}</p>
                </div>
                </div>
                <div className={styles.icons}>
                  <div className={styles.links}>
                    <Edit2 onClick={() => handleEditClick(item)} />
                    <Trash onClick={() => handleDeletion(item.pid)} />
                    {item.link && (
                      <Link target="_blank" to={`//${item.link}`}>
                        <ExternalLink />
                      </Link>
                    )}
                  </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No blogs found</p>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
}

export default Account;