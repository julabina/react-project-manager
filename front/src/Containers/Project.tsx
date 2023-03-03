import { useEffect, useState } from 'react';
import { decodeToken, isExpired } from 'react-jwt';
import { useNavigate, useParams } from 'react-router-dom';
import Collab from '../Components/Collab';
import Header from '../Components/Header';

const Project = () => {

    const navigate = useNavigate();
    const params = useParams();

    type StoredToken = {version: string, content: string};
    type Token = {version: string, content: string};
    type DecodedToken = {userId: string, token: Token};
    type ProjectInfos = {title: string, description: string, colaborators: string[], creator: string};
    type CollabsInfos = {id: string, username: string, firstname: string, lastname: string};

    const [projectInfos, setProjectInfos] = useState<ProjectInfos>({title: "", description: "", colaborators: [""], creator: ""});
    const [actualUser, setActualUser] = useState<DecodedToken>({ userId: "", token: {version: "", content: ""} });
    const [addCollabInput, setAddCollabInput] = useState<string>("");
    const [collabsInfos, setCollabsInfos] = useState<CollabsInfos[]>([]);
    const [projectId, setProjectId] = useState<string>("");

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
             
                const user: DecodedToken = {userId: decodedToken.userId, token};
              
                setActualUser(user);
                getProjectInfo(token.version, user.userId);

                if (params.id !== undefined) {
                    setProjectId(params.id);
                }
                
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

    const getProjectInfo = (token: string, userId?: string) => {
        fetch(process.env.REACT_APP_API_URL + '/api/project/getInfos/' + params.id, {
            headers: {
                "Authorization": "Bearer " + token
            },
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => {

                let collabs: string[] = [];

                if (data.data.colaborators && data.data.colaborators[0] !== "") {
                    collabs = data.data.colaborators;
                } 
                
                const newObj: ProjectInfos = {
                    title: data.data.title ,
                    description: data.data.description ,
                    colaborators: collabs ,
                    creator: data.data.creator
                };

                if (userId !== undefined && !newObj.colaborators.includes(userId) && userId !== newObj.creator) {
                    return navigate('/', { replace: true });
                }
                
                setProjectInfos(newObj);

                if (collabs.length !== 0 && collabs[0] !== "") {
                    getCollabs(token);
                }
            })
    };

    const ctrlInput = (value: string) => {
        setAddCollabInput(value);
    };

    const checkInput = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errorCont = document.querySelector('.project__creator__form__error');
        if (errorCont) {
            errorCont.innerHTML = "";
            
            if (addCollabInput === "") {
                return errorCont.innerHTML = `<p>- Le champ est requis.</p>`;
            } else if (!addCollabInput.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
                return errorCont.innerHTML = `<p>- Ajouter un email valide.</p>`;
            }

            addCollab();
        }

    };

    const addCollab = () => {

        const errorCont = document.querySelector('.project__creator__form__error');

        fetch(process.env.REACT_APP_API_URL + '/api/project/addCollab', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + actualUser.token.version,
            },
            method: 'POST',
            body: JSON.stringify({ 
                 projectId: params.id,
                 collabMail: addCollabInput
            })
        })
            .then(res => {
                if (res.status === 200) {

                    res.json()
                        .then(data => {
                            getCollabs(actualUser.token.version);
                            setAddCollabInput('');
                        })

                } else {
                    res.json()
                        .then(data => {
                            if (errorCont) {
                                errorCont.innerHTML = `<p>` + data.message + `</p>`
                            }
                        })
                }
            })

    };

    const getCollabs = (token: string) => {

        fetch(process.env.REACT_APP_API_URL + '/api/users/getCollabs/' + params.id, {
            headers: {
                "Authorization": "Bearer " + token
            },
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => {
                
                if (data.data && data.data.length !== 0) {
                    setCollabsInfos(data.data);
                }
                
            })

    };

    return (
        <>
        <Header />
        <main>
            <h1>{projectInfos.title}</h1>
            <p>{projectInfos.description}</p>
            {
                actualUser.userId === projectInfos.creator &&
                <div>
                    {
                        collabsInfos.length === 0 ? 
                            <h2>Pas encore de collaborateurs</h2>
                        :
                            <>
                            <h2>Liste des collaborateurs</h2>
                            <ul>
                                {
                                    params.id !== undefined &&
                                    collabsInfos.map(el => {
                                        return <Collab key={el.id} id={el.id} username={el.username} firstname={el.firstname} lastname={el.lastname} token={actualUser.token.version} projectId={projectId} function={getProjectInfo} />
                                    })
                                }
                            </ul>
                            </>
                    }
                    <form onSubmit={checkInput}>
                        <div className="project__creator__form__error"></div>
                        <label htmlFor="">Ajouter email collaborateur</label>
                        <input onInput={(e) => ctrlInput((e.target as HTMLInputElement).value)} value={addCollabInput} type="text" name="" id="" />
                        <input type="submit" value="Ajouter" />
                    </form>
                </div>
            }
        </main>
        </>
    );
};

export default Project;