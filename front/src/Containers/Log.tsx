import React from 'react';

const Log = () => {
    return (
        <>
            <main className='log'>
                <section className='log__login'>
                    <h2>Se connecter</h2>
                    <form className='log__login__form'>
                        <div className="log__login__form__inputCont">
                            <label htmlFor="logEmail">Email</label>
                            <input type="email" id="logEmail" placeholder='user@gmail.com' />
                        </div>
                        <div className="log__login__form__inputCont">
                            <label htmlFor="logPassword">Mot de passe</label>
                            <input type="password" id="logPassword" />
                        </div>
                        <p className='log__form__resetPassword'>Mot de passe oublié</p>
                        <div className="log__login__form__btnCont">
                            <button>Connexion</button>
                        </div>
                    </form>
                </section>
                <section className='log__signin'>
                    <h2>S'inscrire</h2>
                    <form className='log__signin__form'>
                        <div className="log__signin__form__inputCont">
                            <label htmlFor="signEmail">Email</label>
                            <input type="email" id="signEmail" placeholder='user@gmail.com' />
                        </div>
                        <div className="log__signin__form__inputCont">
                            <label htmlFor="signPassword">Mot de passe</label>
                            <input type="password" id="signPassword" />
                        </div>
                        <div className="log__signin__form__inputCont">
                            <label htmlFor="signConfirm">Confirmer le mot de passe</label>
                            <input type="password" id="signConfirm" />
                        </div>
                        <div className="log__signin__form__checkboxCont">
                            <input type="checkbox" id="signCheck" />
                            <label htmlFor="signCheck">Je blablabla</label>
                        </div>
                        <div className="log__signin__form__btnCont">
                            <button>Inscription</button>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
};

export default Log;