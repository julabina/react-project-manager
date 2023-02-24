import { useEffect, useState } from 'react';
import { decodeToken, isExpired } from 'react-jwt';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Components/Header';

const Project = () => {

    const navigate = useNavigate();
    const params = useParams();

    type StoredToken = {version: string, content: string};
    type Token = {version: string, content: string};
    type DecodedToken = {userId: string, token: Token};
    type ProjectInfos = {title: string, description: string, colaborators: string};

    const [projectInfos, setProjectInfos] = useState<ProjectInfos>({title: "", description: "", colaborators: ""});

    useEffect(() => {

        if (localStorage.getItem('react_project_manager_token') !== null) {
            let getToken = localStorage.getItem('react_project_manager_token') || "";
            let token: StoredToken = JSON.parse(getToken);
            if (token !== null) {
                let decodedToken: DecodedToken = decodeToken(token.version) || {userId: "",token: {version: "", content: ""}};
                let isTokenExpired = isExpired(token.version);
                if (decodedToken.userId !== token.content || isTokenExpired === true) {
                    // DISCONNECT
                    localStorage.removeItem('react_project_manager_token');
                    return navigate('/connexion', { replace: true });
                };
              
                checkIfPrivileges(token.version);
                
            } else {
                // DISCONNECT
                localStorage.removeItem('react_project_manager_token');
                navigate('/connexion', { replace: true });
            };
        } else {
            // DISCONNECT
            navigate('/connexion', { replace: true });
        };   

    },[]);

    const checkIfPrivileges = (token: string) => {


        // A COMPLETER 
        // A COMPLETER 
        // A COMPLETER 
        // A COMPLETER 
        // A COMPLETER 
        // A COMPLETER 


        getProjectInfo(token);
    };

    const getProjectInfo = (token: string) => {
        fetch(process.env.REACT_APP_API_URL + '/api/project/getInfos/' + params.id, {
            headers: {
                "Authorization": "Bearer " + token
            },
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                
            })
    };

    return (
        <>
        <Header />
        <main>
            <h1>{projectInfos.title}</h1>
            <p>{projectInfos.description}</p>
        </main>
        </>
    );
};

export default Project;