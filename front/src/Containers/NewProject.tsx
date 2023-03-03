import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken, isExpired } from 'react-jwt';
import Header from "../Components/Header";

const NewProject = () => {
    const navigate = useNavigate();

    const errorCont = document.querySelector('.newProject__errorCont');

    type FormInput = {title: string, description: string};
    type StoredToken = {version: string, content: string};
    type Token = {version: string, content: string};
    type DecodedToken = {userId: string, token: Token};

    const [formInput, setFormInput] = useState<FormInput>({title: "", description: ""});
    const [userInfo, setUserInfo] = useState<DecodedToken>({userId: "", token: {version: "", content: ""}});

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
              
                const newObj: DecodedToken = {
                    userId: decodedToken.userId, 
                    token: token
                };

                setUserInfo(newObj);
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

    const ctrlInput = (action: string, value: string) => {
        if (action === "title") {
            const newObj: FormInput = {
                ...formInput,
                title: value
            };
            setFormInput(newObj);
        } else if (action === "description") {
            const newObj: FormInput = {
                ...formInput,
                description: value
            };
            setFormInput(newObj);
        }
    };

    const verifyInputs = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (errorCont) {
            errorCont.innerHTML = "";
        }
        let errors: string = "";

        if (formInput.title === "") {
            errors = `<p>- Le titre est requis.</p>`;
        } else if (formInput.title.length < 3 || formInput.title.length > 100) {
            errors += `<p>- La taille du titre doit etre comprise entre 2 et 100 caractères.</p>`;          
        } else if (!formInput.title.match(/^[\wé èà\-]*$/i)) {
            errors += `<p>- Le titre ne doit contenir que des lettres et des chiffres.</p>`;
        }
        
        if (formInput.title.length > 400) {
            errors += `<p>- La description ne doit pas dépasser 400 caractères.</p>`;          
        } else if (!formInput.description.match(/^[\wé èà\-,.]*$/im)) {
            errors += `<p>- La description ne doit contenir que des lettres et des chiffres.</p>`;
        }

        if (errors !== "") {
            if (errorCont) {
                errorCont.innerHTML = errors;
            }
        } else {
            createProject();
        }
    };

    const createProject = () => {
        
        fetch(process.env.REACT_APP_API_URL + '/api/project/create', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + userInfo.token.version,
            },
            method: 'POST',
            body: JSON.stringify({ 
                title: formInput.title, 
                description: formInput.description,
                userId: userInfo.userId, 
            })
        })
            .then(res => {
                if (res.status === 201) {
                    res.json()
                        .then(data => {
                            navigate('/project/' + data.id, { replace: true });
                        })
                } else {
                    res.json()
                        .then(data => {
                            console.log(data);
                            
                            if (errorCont) {
                                errorCont.innerHTML = `<p>- ` + data.message + `</p>`;
                            }
                        })
                }
            })
    };

    return (
        <>
        <Header />
        <main>
            <h1>Nouveau projet</h1>
            <div className="newProject__errorCont"></div>
            <form onSubmit={verifyInputs}>
                <div>
                    <label htmlFor="">Titre</label>
                    <input onInput={(e) => ctrlInput("title", (e.target as HTMLInputElement).value)} value={formInput.title} type="text" name="" id="" />
                </div>
                <div className="">
                    <label htmlFor="">Description</label>
                    <textarea onInput={(e) => ctrlInput("description", (e.target as HTMLInputElement).value)} value={formInput.description} name="" id=""></textarea>
                </div>
                <div className="">
                    <input type="submit" value="Créer" />
                </div>
            </form>
        </main>
        </>
    );
};

export default NewProject;