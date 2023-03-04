import { useEffect, useState } from 'react';
import { decodeToken, isExpired } from 'react-jwt';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import ProjectCard from '../Components/ProjectCard';

const Home = () => {

    const navigate = useNavigate();

    type StoredToken = {version: string, content: string};
    type Token = {version: string, content: string};
    type DecodedToken = {userId: string, token: Token};
    type UserInfo = {id: string, username: string};
    type ProjectsInfos = {
        colaborators: string[],
        createdAt: string,
        creator: string,
        description: string,
        id: string,
        title: string,
        updatedAt: string
    };

    const [userInfo, setUserInfo] = useState<UserInfo>({id: "", username: ""});
    const [projects, setProjects] = useState<ProjectsInfos[]>([]);
    const [projectsFiltered, setProjectsFiltered] = useState<ProjectsInfos[]>([]);

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

                if (data.data.projects[0] !== "") {                   
                    getAllProjects(data.data.projects , token);
                }

                setUserInfo(newObj);
            })
    };

    const getAllProjects = (projectsId: string[], token: string) => {

        fetch(process.env.REACT_APP_API_URL + '/api/project/getProjects', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            method: 'POST',
            body: JSON.stringify({ 
                projectsId: projectsId 
            })
        })
            .then(res => res.json())
            .then(data => {
                
                if (data.data) {   
                    const projectsInf = data.data;
                    setProjects(projectsInf);                
                    setProjectsFiltered(projectsInf);                
                }
            })
    };

    const filterProject = (value: string) => {
        if (value === "all") {
            setProjectsFiltered(projects);
        } else if (value === "my") {
            const newArr = projects.filter(el => {
                return el.creator === userInfo.id
            });
            
            setProjectsFiltered(newArr);
        } else if (value === "other") {
            const newArr = projects.filter(el => {
                return el.creator !== userInfo.id
            });

            setProjectsFiltered(newArr);
        }
    };

    return (
        <>
        <Header />
        <main className='home'>
            <section className='home__section'>
                <h1 className='home__section__mainTitle'>projets de {userInfo.username}</h1>
                <div className="home__section__new">
                    <a className='home__section__new__link' href="/new">Nouveau projet</a>
                </div>
                <div className='home__section__selectCont'>
                    <select onChange={(e) => filterProject((e.target as HTMLSelectElement).value)}>
                        <option value="all" selected>Tous</option>
                        <option value="my">Mes projets</option>
                        <option value="other">Les autres</option>
                    </select>
                </div>
                <div className="home__section__projectsCont">
                {
                    projectsFiltered?.length > 0 ?
                    projectsFiltered.map(el => {
                        return <ProjectCard key={el.id} title={el.title} description={el.description} creator={el.creator} user={userInfo.id} id={el.id} />;
                    })
                    : 
                    <h3>Aucun projets.</h3>
                }
                </div>
            </section>
        </main>
        </>
    );
};

export default Home;