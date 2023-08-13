import React, { useState } from "react";
import { blogdata } from "./blogdata";
import styles from "./Blog.module.css";

function Blog() {
    const [blogdatastates, setBlogdataStates] = useState({});

    return (
        <div className={styles.container}>
            {blogdata.map((item, index) => (
                <div className={styles.project} key={item.title}>
                    <div className={styles.content}>
                        <div className={styles.image}>
                            <img src={item.image} alt="" className={styles.img} />
                        </div>
                        <div className={styles.details}>
                            <p className={styles.title}>{item.title}</p>
                            <p className={styles.author}>~{item.author}</p>
                            <p className={styles.overview}>{item.overview}</p>
                            <p className={styles.description}>
                                {blogdatastates[index] && item.description.length > 500
                                    ? item.description
                                    : `${item.description.slice(0, 500)}`}
                                {item.description.length > 500 && (
                                    <span
                                        className={styles.readMore}
                                        onClick={() =>
                                            setBlogdataStates({
                                                ...blogdatastates,
                                                [index]: !blogdatastates[index]
                                            })
                                        }
                                    >
                                        {blogdatastates[index] ? "Read Less" : "....Read More"}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Blog;
