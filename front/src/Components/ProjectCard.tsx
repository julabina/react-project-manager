import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
    title: string, 
    description: string, 
    creator: string, 
    user: string, 
    id: string
};

const ProjectCard = (props: Props) => {

    const navigate = useNavigate();

    const [modalToggle, setModalToggle] = useState<boolean>(false);

    const toggleInfosModal = () => {
        setModalToggle(!modalToggle);
    };

    const goToProject = () => {
        navigate('/project/' + props.id, { replace: true });
    };

    return (
        <>
        <article className="projectCard" onClick={toggleInfosModal}>
            <h2 className="projectCard__title">{props.title}</h2>
            {
                props.user === props.creator && <div className="projectCard__my"></div>
            }
        </article>
        {
            modalToggle &&
            <div className="projectCard__modal">
                <div className="projectCard__modal__container">
                    <button className="projectCard__modal__container__closeBtn" onClick={toggleInfosModal}>X</button>
                    <h1>{props.title}</h1>
                    <p>{props.description}</p>
                    <div>
                        <button className="projectCard__modal__container__openBtn" onClick={goToProject}>Ouvrir le projet</button>
                    </div>
                </div>
            </div>
        }
        </>
    );
};

export default ProjectCard;