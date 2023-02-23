import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decodeToken, isExpired } from 'react-jwt';
import Header from "../Components/Header";

const Profil = () => {
    const params = useParams();
    const navigate = useNavigate();

    type StoredToken = {version: string, content: string};
    type Token = {version: string, content: string};
    type DecodedToken = {userId: string, token: Token};
    type UserInfo = {id: string, username: string, firstname: string, lastname: string};

    const [userInfo, setUserInfo] = useState<UserInfo>({id: "", username: "", firstname: "", lastname: ""});
    const [notFound, setNotFound] = useState<boolean>(false);

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
              
                getUserInfos(decodedToken.userId, token.version);
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

    const getUserInfos = (id: string, token: string) => {
        let userId: string;

        if (params.id === undefined) {
            userId = id;
        } else {
            userId = params.id;
        }

        fetch(process.env.REACT_APP_API_URL + '/api/users/getUserInfo/' + userId, {
            headers: {
                "Authorization": "Bearer " + token
            },
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => {
                if (data.data === undefined) {
                    return setNotFound(true);
                }
                
                const newObj: UserInfo = {
                    id: data.data.id,
                    username: data.data.username,
                    firstname: data.data.firstname,
                    lastname: data.data.lastname,
                }

                setUserInfo(newObj);
            })
    };

    return (
        <>
        <Header />
        <main>
            {
                notFound ?
                <h1>Aucun utilisateur trouvé.</h1>
                :
                <>
                <h1>profil de {userInfo.username}</h1>

                <p>Prenom: {userInfo.firstname}</p>
                <p>Nom: {userInfo.lastname}</p>
                </>
            }
        </main>
        </>
    );
};

export default Profil;