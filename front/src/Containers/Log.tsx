import { sign } from 'crypto';
import React, { useState, useEffect } from 'react';
import { decodeToken, isExpired } from 'react-jwt';
import { useNavigate } from 'react-router-dom';

const Log = () => {

    const navigate = useNavigate();

    const signErrorCont = document.querySelector(".log__signin__errorCont");
    const logErrorCont = document.querySelector(".log__login__errorCont");  

    type SignInput = {username: string, firstname: string, lastname: string, mail: string, confirmMail: string, password: string, confirmPassword: string, aggree: boolean};
    type LogInput = {mail: string, password: string};
    type StoredToken = {version: string, content: string};
    type Token = {version: string, content: string};
    type DecodedToken = {userId: string, token: Token};

    const [signInput, setSignInput] = useState<SignInput>({username: "", firstname: "", lastname: "", mail: "", confirmMail: "", password: "", confirmPassword: "", aggree: false});
    const [logInput, setLogInput] = useState<LogInput>({mail: "", password: ""});
    const [isLogged, setIsLogged] = useState<boolean>(false);

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
                setIsLogged(true);
            } else {
                // DISCONNECT
                localStorage.removeItem('react_project_manager_token');
            };
        }
    },[]);

    const verifyLog = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (logErrorCont) {    
            logErrorCont.innerHTML = "";
        }
        let errors: string = "";
        
        if (logInput.mail === '' || logInput.password === '') {
            if (logErrorCont) {   
                return logErrorCont.innerHTML = `<p>- Tous les champs sont requis.</p>`;
            }
        }

        if (!logInput.mail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
            errors = `<p>- L'email n'a pas un format valide.</p>`;
        }
        if (!logInput.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) {
            errors += `<p>- Le mot de passe doit contenir minimun 1 lettre 1 chiffre 1 lettre majuscule et 8 caract??res.</p>`;
        }

        if (errors !== "") {
            if (logErrorCont) {
                return logErrorCont.innerHTML = errors;
            }
        }

        tryToLog();
    };

    const verifySign = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
          
        if (signErrorCont) {    
            signErrorCont.innerHTML = "";
        }
        let errors: string = "";
        
        if (signInput.username === '' || signInput.firstname === '' || signInput.lastname === '' || signInput.mail === '' || signInput.confirmMail === '' || signInput.password === '' || signInput.confirmPassword === '') {
            if (signErrorCont) {   
                return signErrorCont.innerHTML = `<p>- Tous les champs sont requis.</p>`;
            }
        }
        
        if (signInput.aggree === false) {
            errors = `<p>- Veuillez accepter les CGU.</p>`;
        }
        if (!signInput.mail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i) || !signInput.confirmMail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
            errors += `<p>- L'email n'a pas un format valide.</p>`;
        }
        if (!signInput.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/) || !signInput.confirmPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) {
            errors += `<p>- Le mot de passe doit contenir minimun 1 lettre 1 chiffre 1 lettre majuscule et 8 caract??res.</p>`;
        }

        if (signInput.username.length < 2 || signInput.username.length > 26) {
            errors += `<p>- Le nom d'utilisateur doit comprendre entre 2 et 25 caract??res.</p>`;
        } else if (!signInput.username.match(/^[\w ??????????????????\-]*$/i)) {
            errors += `<p>- Le nom d'utilisateur ne doit comporter que des lettres et des chiffres.</p>`;
        }
        if (signInput.firstname.length < 2 || signInput.firstname.length > 26) {
            errors += `<p>- Le pr??nom doit comprendre entre 2 et 25 caract??res.</p>`;
        } else if (!signInput.firstname.match(/^[a-zA-Z ??????????????????\-]*$/i)) {
            errors += `<p>- Le pr??nom ne doit comporter que des lettres.</p>`;
        }
        if (signInput.lastname.length < 2 || signInput.lastname.length > 26) {
            errors += `<p>- Le nom doit comprendre entre 2 et 25 caract??res.</p>`;
        } else if (!signInput.lastname.match(/^[a-zA-Z ??????????????????\-]*$/i)) {
            errors += `<p>- Le nom ne doit comporter que des lettres.</p>`;
        }
        
        if (signInput.mail !== signInput.confirmMail) {
            errors += `<p>- Le emails ne correspondent pas.</p>`;
        }
        if (signInput.password !== signInput.confirmPassword) {
            errors += `<p>- Les mots de passe ne correspondent pas.</p>`;
        }

        if (errors !== "") {
            if (signErrorCont) {
                return signErrorCont.innerHTML = errors;
            }
        }

        tryToSign();
    };

    const logControl = (action: string, value: string) => {
        if (action === 'mail') {
            const newObj: LogInput = {
                ...logInput,
                mail: value
            };
            setLogInput(newObj);
        } else if (action === 'password') {
            const newObj: LogInput = {
                ...logInput,
                password: value
            };
            setLogInput(newObj);
        }
    };
    
    const signControl = (action: string, value: string) => {
        if (action === 'mail') {
            const newObj: SignInput = {
                ...signInput,
                mail: value
            };
            setSignInput(newObj);
        } else if (action === 'password') {
            const newObj: SignInput = {
                ...signInput,
                password: value
            };
            setSignInput(newObj);
        } else if (action === 'confirmPassword') {
            const newObj: SignInput = {
                ...signInput,
                confirmPassword: value
            };
            setSignInput(newObj);
        } else if (action === 'confirmMail') {
            const newObj: SignInput = {
                ...signInput,
                confirmMail: value
            };
            setSignInput(newObj);
        } else if (action === 'username') {
            const newObj: SignInput = {
                ...signInput,
                username: value
            };
            setSignInput(newObj);
        } else if (action === 'firstname') {
            const newObj: SignInput = {
                ...signInput,
                firstname: value
            };
            setSignInput(newObj);
        } else if (action === 'lastname') {
            const newObj: SignInput = {
                ...signInput,
                lastname: value
            };
            setSignInput(newObj);
        } else if (action === 'aggree') {
            const newObj: SignInput = {
                ...signInput,
                aggree: !signInput.aggree
            };
            setSignInput(newObj);
        }
    };

    const tryToSign = () => {       
        fetch(process.env.REACT_APP_API_URL + '/api/users/sign', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ mail: signInput.mail, password: signInput.password, firstname: signInput.firstname, lastname: signInput.lastname, username: signInput.username })
        })
            .then(res => {
                if (res.status === 201) {
                    tryToLog(signInput.mail, signInput.password);
                } else {
                    res.json()
                        .then(data => {
                            if (signErrorCont) {
                                signErrorCont.innerHTML = `` + data.message + ``;
                            }
                        })
                }
            })
    };

    const tryToLog = (mail?: string, password?: string) => {

        if (mail === undefined || password === undefined) {
            mail = logInput.mail;
            password = logInput.password;
        }

        fetch(process.env.REACT_APP_API_URL + '/api/users/log', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ mail, password})
        })
            .then(res => {
                if (res.status === 200) {
                    
                    res.json()
                        .then(data => {
                            let newObj = {
                                version: data.token,
                                content: data.userId
                            };
                            localStorage.setItem('react_project_manager_token', JSON.stringify(newObj)); 
                            navigate('/', { replace: true });
                        })
                    
                } else {
                    res.json()
                        .then(data => {
                            if (logErrorCont) {   
                                logErrorCont.innerHTML = `<p>- ` + data.message + `</p>`
                            }
                        })
                }
            })   
    };

    const disconnect = () => {       
        if (localStorage.getItem('react_project_manager_token') !== null) {
            localStorage.removeItem('react_project_manager_token');
            setIsLogged(false);
        }
    };

    return (
        <>
        {isLogged ? 
            <main>
                <section>
                    <button onClick={disconnect}>Se deconnecter</button>
                </section>
            </main>
        : 
            <main className='log'>
                <section className='log__login'>
                    <h2>Se connecter</h2>
                    <div className="log__login__errorCont"></div>
                    <form className='log__login__form' onSubmit={verifyLog}>
                        <div className="log__login__form__inputCont">
                            <label htmlFor="logEmail">Email</label>
                            <input onInput={(e) => logControl('mail', (e.target as HTMLInputElement).value)} value={logInput.mail} type="email" id="logEmail" placeholder='user@gmail.com' />
                        </div>
                        <div className="log__login__form__inputCont">
                            <label htmlFor="logPassword">Mot de passe</label>
                            <input onInput={(e) => logControl('password', (e.target as HTMLInputElement).value)} value={logInput.password} type="password" id="logPassword" />
                        </div>
                        <div className="log__login__form__btnCont">
                            <input type="submit" value="Connexion" />
                        </div>
                    </form>
                </section>
                <section className='log__signin'>
                    <h2>S'inscrire</h2>
                    <div className="log__signin__errorCont"></div>
                    <form className='log__signin__form' onSubmit={verifySign}>
                        <div className="log__signin__form__inputCont">
                            <label htmlFor="signUsername">Pseudo</label>
                            <input onInput={(e) => signControl('username', (e.target as HTMLInputElement).value)} value={signInput.username} type="text" id="signUsername" placeholder='user10400' />
                        </div>
                        <div className="log__signin__form__contDuo"> 
                            <div className="log__signin__form__inputCont">
                                <label htmlFor="signfirstname">Pr??nom</label>
                                <input onInput={(e) => signControl('firstname', (e.target as HTMLInputElement).value)} value={signInput.firstname} type="text" id="signfirstname" placeholder='John' />
                            </div>
                            <div className="log__signin__form__inputCont">
                                <label htmlFor="signlastname">Nom</label>
                                <input onInput={(e) => signControl('lastname', (e.target as HTMLInputElement).value)} value={signInput.lastname} type="text" id="signlastname" placeholder='Doe' />
                            </div>
                        </div>
                        <div className="log__signin__form__contDuo"> 
                            <div className="log__signin__form__inputCont">
                                <label htmlFor="signEmail">Email</label>
                                <input onInput={(e) => signControl('mail', (e.target as HTMLInputElement).value)} value={signInput.mail} type="email" id="signEmail" placeholder='user@gmail.com' />
                            </div>
                            <div className="log__signin__form__inputCont">
                                <label htmlFor="signConfirmEmail">Confirmer email</label>
                                <input onInput={(e) => signControl('confirmMail', (e.target as HTMLInputElement).value)} value={signInput.confirmMail} type="email" id="signConfirmEmail" placeholder='user@gmail.com' />
                            </div>
                        </div>
                        <div className="log__signin__form__contDuo"> 
                            <div className="log__signin__form__inputCont">
                                <label htmlFor="signPassword">Mot de passe</label>
                                <input onInput={(e) => signControl('password', (e.target as HTMLInputElement).value)} value={signInput.password} type="password" id="signPassword" />
                            </div>
                            <div className="log__signin__form__inputCont">
                                <label htmlFor="signConfirm">Confirmer le mot de passe</label>
                                <input onInput={(e) => signControl('confirmPassword', (e.target as HTMLInputElement).value)} value={signInput.confirmPassword} type="password" id="signConfirm" />
                            </div>
                        </div>
                        <div className="log__signin__form__checkboxCont">
                            <input onInput={(e) => signControl('aggree', '')} value={signInput.aggree.toString()} type="checkbox" id="signCheck" />
                            <label htmlFor="signCheck">Je blablabla</label>
                        </div>
                        <div className="log__signin__form__btnCont">
                            <input type="submit" value="Inscription" />
                        </div>
                    </form>
                </section>
            </main>
        }
        </>
    );
};

export default Log;