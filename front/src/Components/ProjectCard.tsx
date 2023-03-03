import { useState } from "react";

type Props = {
    title: string, 
    description: string, 
    creator: string, 
    user: string, 
};

const ProjectCard = (props: Props) => {

    const [modalToggle, setModalToggle] = useState<boolean>(false);

    const toggleInfosModal = () => {
        setModalToggle(!modalToggle);
    };

    return (
        <>
        <article className="projectCard" onClick={toggleInfosModal}>
            <h2>{props.title}</h2>
            {
                props.user === props.creator && <p>VOTRE PROJET</p>
            }
        </article>
        {
            modalToggle &&
            <div className="projectCard__modal">
                <div className="projectCard__modal__container">
                    <button onClick={toggleInfosModal}>X</button>
                    <h1>{props.title}</h1>
                    <p>{props.description}</p>
                </div>
            </div>
        }
        </>
    );
};

export default ProjectCard;