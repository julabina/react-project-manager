import { useEffect, useState } from 'react';
import { decodeToken, isExpired } from 'react-jwt';
import { useNavigate, useParams } from 'react-router-dom';
import Collab from '../Components/Collab';
import Ticket from '../Components/Ticket';
import Header from '../Components/Header';

const Project = () => {

    const navigate = useNavigate();
    const params = useParams();

    const errorCont = document.querySelector('.project__creator__form__error');

    type StoredToken = {version: string, content: string};
    type Token = {version: string, content: string};
    type DecodedToken = {userId: string, token: Token};
    type ProjectInfos = {title: string, description: string, colaborators: string[], creator: string};
    type CollabsInfos = {id: string, username: string, firstname: string, lastname: string};
    type NewTaskInput = {title: string, description: string};
    type Tickets = {id: string, title: string, description: string, creator: string, creatorName: string, status: string};

    const [projectInfos, setProjectInfos] = useState<ProjectInfos>({title: "", description: "", colaborators: [""], creator: ""});
    const [actualUser, setActualUser] = useState<DecodedToken>({ userId: "", token: {version: "", content: ""} });
    const [addCollabInput, setAddCollabInput] = useState<string>("");
    const [collabsInfos, setCollabsInfos] = useState<CollabsInfos[]>([]);
    const [projectId, setProjectId] = useState<string>("");
    const [toggleTicketModal, setToggleTicketModal] = useState<boolean>(false);
    const [ticketInput, setTicketInput] = useState<NewTaskInput>({title: "", description: ""});
    const [tickets, setTickets] = useState<Tickets[]>([]);
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
            .then(res => {

                if (res.status === 200) {
                    
                    res.json()
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
                            getProjectTicket(token);
                        })
                } else if (res.status === 404) {
                    setNotFound(true);
                } else {
                    navigate('/', {replace: true});
                }

            })
    };

    const ctrlInput = (value: string) => {
        setAddCollabInput(value);
    };

    const checkInput = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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

    const ctrlTicketInput = (action: string, value: string) => {
        if (action === "title") {
            const newObj = {
                ...ticketInput,
                title: value
            };
            setTicketInput(newObj);
        } else if (action === "description") {
            const newObj = {
                ...ticketInput,
                description: value
            };
            setTicketInput(newObj);
        }
    };

    const toggleModalTicket = () => {
        setToggleTicketModal(!toggleTicketModal);
    };

    const verifyTicketForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ticketErrorCont = document.querySelector('.project__newTicket__modal__container__form__errorCont');
        
        if (ticketErrorCont) {
            ticketErrorCont.innerHTML = "";
            let error = "";
            
            if (ticketInput.title === "") {
                return ticketErrorCont.innerHTML = `<p>- Le titre est requis.</p>`;
            } else if (ticketInput.title.length < 2 || ticketInput.title.length > 25) {
                error = `<p>- Le titre doit etre compris entre 2 et 25 caractères.</p>`;
            } else if (!ticketInput.title.match(/^[\wé èà\-]*$/i)) {
                error = `<p>- le titre ne doit contenir que des lettres.</p>`;
            }
            
            if (ticketInput.description !== "") {
                
                if (ticketInput.description.length < 2 || ticketInput.description.length > 100) {
                    error += `<p>- La description doit etre comprise entre 2 et 100 caractères.</p>`;
                } else if (!ticketInput.description.match(/^[\wé èà\-]*$/i)) {
                    error += `<p>- la description ne doit contenir que des lettres.</p>`;
                }
            }
            
            if (error !== "") {
                return ticketErrorCont.innerHTML = error;
            }

            createTicket();
        }
    };

    const createTicket = () => {
        const ticketErrorCont = document.querySelector('.project__newTicket__modal__container__form__errorCont');
        if (ticketErrorCont) {
            ticketErrorCont.innerHTML = "";
        }

        fetch(process.env.REACT_APP_API_URL + '/api/ticket/create', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + actualUser.token.version,
            },
            method: 'POST',
            body: JSON.stringify({ 
                projectId: params.id,
                title: ticketInput.title,
                description: ticketInput.description,
                creator: actualUser.userId
            })
        })
            .then(res => {
                if (res.status === 201) {
                    ticketInput.title = "";
                    ticketInput.description = "";

                    toggleModalTicket();
                } else {
                    res.json()
                        .then(data => {
                            if (data.message) {
                                if (ticketErrorCont) {
                                    ticketErrorCont.innerHTML = `` + data.message + ``;
                                }
                            }
                        })
                }
            })
    };

    const getProjectTicket = (token: string) => {
        fetch(process.env.REACT_APP_API_URL + '/api/ticket/getAll/' + params.id, {
            headers : {
                "Authorization": "Bearer " + token
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.data && data.data.length > 0) {
                    let ticketsData = [];

                    for (let i = 0; i < data.data.length; i++) {


                        const newObj: Tickets = {
                            id: data.data[i].id, 
                            title: data.data[i].title, 
                            description: data.data[i].description, 
                            creator: data.data[i].creator, 
                            creatorName: data.data[i].creatorName,
                            status: data.data[i].status
                        };

                        ticketsData.push(newObj);
                    }

                    setTickets(ticketsData);
                }
            })
    };
    
    return (
        <>
        <Header />
        <main className='project'>
            {
                notFound ?
                <div className="project__notFound">
                    <h1>Aucun projet trouvé.</h1>
                </div>
                :
                <>
                <h1 className='project__title'>{projectInfos.title}</h1>
                <p className='project__description'>{projectInfos.description}</p>
                {
                    actualUser.userId === projectInfos.creator &&
                    <>
                    <section className='project__creator'>
                        {
                            collabsInfos.length === 0 ? 
                                <h2 className='project__creator__title project__creator__title--notFound'>Pas encore de collaborateurs</h2>
                            :
                                <>
                                <h2 className='project__creator__title'>Liste des collaborateurs</h2>
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
                        <form className='project__creator__form' onSubmit={checkInput}>
                            <div className="project__creator__form__error"></div>
                            <label htmlFor="addCollab">Adresse email du collaborateur</label>
                            <input className='project__creator__form__email' onInput={(e) => ctrlInput((e.target as HTMLInputElement).value)} value={addCollabInput} type="email" id="addCollab" placeholder='user@mail.com' />
                            <input className='project__creator__form__btn' type="submit" value="Ajouter collaborateur" />
                        </form>
                        <div className='project__creator__separator'></div>
                    </section>
                    </>
                }
                <section>
                    <button onClick={toggleModalTicket}>Ajouter une tache</button>
                </section>
                {/* create modal start */}
                {
                    toggleTicketModal &&
                    <div className='project__newTicket__modal'>
                        <div className='project__newTicket__modal__container'>
                            <button onClick={toggleModalTicket}>X</button>
                            <h1>Créer une tache</h1>
                            <form onSubmit={verifyTicketForm}>
                                <div className="project__newTicket__modal__container__form__errorCont"></div>
                                <div className="">
                                    <label htmlFor=""></label>
                                    <input onInput={(e) => ctrlTicketInput("title", (e.target as HTMLInputElement).value)} value={ticketInput.title} type="text" name="" id="" />
                                </div>
                                <div className="">
                                    <label htmlFor=""></label>
                                    <textarea onInput={(e) => ctrlTicketInput("description", (e.target as HTMLInputElement).value)} value={ticketInput.description} name="" id=""></textarea>
                                </div>
                                <input type="submit" value="Créer tache" />
                            </form>
                        </div>
                    </div>
                }
                {/* create modal ended */}

                <section>
                    {
                        tickets.length === 0 ?
                        <h2>Aucun ticket</h2> :
                        tickets.map(el => {
                            return <Ticket key={el.id} title={el.title} description={el.description} status={el.status} id={el.id} projectId={projectId} creatorName={el.creatorName} creator={el.creator} token={actualUser.token.version} />
                        })
                    }
                </section>
                </>
            }
        </main>
        </>
    );
};

export default Project;