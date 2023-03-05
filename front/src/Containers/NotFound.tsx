import { useNavigate } from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate('/', {replace : true});
    };

    return (
        <main className="notFound">
            <h1>404 Not found</h1>
            <button onClick={goHome}>Retour</button>
        </main>
    );
};

export default NotFound;