import { useEffect, useState } from 'react';
import { decodeToken, isExpired } from 'react-jwt';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';

const Home = () => {

    const navigate = useNavigate();

    type StoredToken = {version: string, content: string};
    type Token = {version: string, content: string};
    type DecodedToken = {userId: string, token: Token};
    type UserInfo = {id: string, username: string};

    const [userInfo, setUserInfo] = useState<UserInfo>({id: "", username: ""});
    const [projects, setProjects] = useState<string[]>([]);

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
              
                getUserHomeInfos(decodedToken.userId, token.version);
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

    const getUserHomeInfos = (id: string, token: string) => {

        fetch(process.env.REACT_APP_API_URL + '/api/users/getHomeUserInfo/' + id, {
            headers: {
                "Authorization": "Bearer " + token
            },
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => {
                const newObj: UserInfo = {
                    id: data.data.id,
                    username: data.data.username,
                }

                if (data.data.projects !== "") {
                    
                }

                setUserInfo(newObj);
            })
    };

    return (
        <>
        <Header />
        <main>
            <h1>page d'accueil de {userInfo.username}</h1>
            <h2>Mes projets</h2>
            <a href="#">Nouveau projet</a>
            {
                projects?.length > 0 ?
                projects.map(el => {
                    return el;
                })
                : 
                <h3>Aucun projets.</h3>
            }
        </main>
        </>
    );
};

export default Home;