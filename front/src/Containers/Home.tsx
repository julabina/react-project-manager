import React, { useEffect } from 'react';
import { decodeToken, isExpired } from 'react-jwt';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    type StoredToken = {version: string, content: string};
    type Token = {version: string, content: string};
    type DecodedToken = {userId: string, token: Token};

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
                /* const newUserObj = {
                    token: token.version,
                    id: decodedToken.userId,
                }; */
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

    return (
        <div>
            
        </div>
    );
};

export default Home;