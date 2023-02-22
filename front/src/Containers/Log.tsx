import React, { useState } from 'react';

const Log = () => {

    type SignInput = {username: string, firstname: string, lastname: string, mail: string, confirmMail: string, password: string, confirmPassword: string, aggree: boolean};
    type LogInput = {mail: string, password: string};

    const [signInput, setSignInput] = useState<SignInput>({username: "", firstname: "", lastname: "", mail: "", confirmMail: "", password: "", confirmPassword: "", aggree: false});
    const [logInput, setLogInput] = useState<LogInput>({mail: "", password: ""});

    const verifyLog = () => {

    };

    const verifySign = () => {

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

    return (
        <>
            <main className='log'>
                <section className='log__login'>
                    <h2>Se connecter</h2>
                    <form className='log__login__form'>
                        <div className="log__login__form__inputCont">
                            <label htmlFor="logEmail">Email</label>
                            <input onInput={(e) => logControl('mail', (e.target as HTMLInputElement).value)} value={logInput.mail} type="email" id="logEmail" placeholder='user@gmail.com' />
                        </div>
                        <div className="log__login__form__inputCont">
                            <label htmlFor="logPassword">Mot de passe</label>
                            <input onInput={(e) => logControl('password', (e.target as HTMLInputElement).value)} value={logInput.password} type="password" id="logPassword" />
                        </div>
                        <p className='log__form__resetPassword'>Mot de passe oublié</p>
                        <div className="log__login__form__btnCont">
                            <button onClick={verifyLog}>Connexion</button>
                        </div>
                    </form>
                </section>
                <section className='log__signin'>
                    <h2>S'inscrire</h2>
                    <form className='log__signin__form'>
                        <div className="log__signin__form__inputCont">
                            <label htmlFor="signUsername">Pseudo</label>
                            <input onInput={(e) => signControl('username', (e.target as HTMLInputElement).value)} value={signInput.username} type="text" id="signUsername" placeholder='user10400' />
                        </div>
                        <div className="log__signin__form__inputCont">
                            <label htmlFor="signfirstname">Prénom</label>
                            <input onInput={(e) => signControl('firstname', (e.target as HTMLInputElement).value)} value={signInput.firstname} type="text" id="signfirstname" placeholder='John' />
                        </div>
                        <div className="log__signin__form__inputCont">
                            <label htmlFor="signlastname">Nom</label>
                            <input onInput={(e) => signControl('lastname', (e.target as HTMLInputElement).value)} value={signInput.lastname} type="text" id="signlastname" placeholder='Doe' />
                        </div>
                        <div className="log__signin__form__inputCont">
                            <label htmlFor="signEmail">Email</label>
                            <input onInput={(e) => signControl('mail', (e.target as HTMLInputElement).value)} value={signInput.mail} type="email" id="signEmail" placeholder='user@gmail.com' />
                        </div>
                        <div className="log__signin__form__inputCont">
                            <label htmlFor="signConfirmEmail">Confirmer email</label>
                            <input onInput={(e) => signControl('confirmMail', (e.target as HTMLInputElement).value)} value={signInput.confirmMail} type="email" id="signConfirmEmail" placeholder='user@gmail.com' />
                        </div>
                        <div className="log__signin__form__inputCont">
                            <label htmlFor="signPassword">Mot de passe</label>
                            <input onInput={(e) => signControl('password', (e.target as HTMLInputElement).value)} value={signInput.password} type="password" id="signPassword" />
                        </div>
                        <div className="log__signin__form__inputCont">
                            <label htmlFor="signConfirm">Confirmer le mot de passe</label>
                            <input onInput={(e) => signControl('confirmPassword', (e.target as HTMLInputElement).value)} value={signInput.confirmPassword} type="password" id="signConfirm" />
                        </div>
                        <div className="log__signin__form__checkboxCont">
                            <input onInput={(e) => signControl('aggree', '')} value={signInput.aggree.toString()} type="checkbox" id="signCheck" />
                            <label htmlFor="signCheck">Je blablabla</label>
                        </div>
                        <div className="log__signin__form__btnCont">
                            <button onClick={verifySign}>Inscription</button>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
};

export default Log;