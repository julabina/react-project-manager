import { useState } from "react";

type Props = {id: string, projectId: string, title: string, description: string, creator: string, creatorName: string, status: string, token: string};

const Ticket = (props: Props) => {

    const [status, setStatus] = useState<string>(props.status);
    const [toggleModalShowTicket, setToggleShowTicketModal] = useState<boolean>(false);

    const changeStatus = (value: string) => {
        
        fetch(process.env.REACT_APP_API_URL + "/api/ticket/changeStatus/" + props.id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + props.token,
            },
            method: 'POST',
            body: JSON.stringify({ 
                 status: value
            })
        })
            .then(res => {
                if (res.status === 201) {
                    setStatus(value);
                }
            })
    };

    const toggleShowModal = () => {
        setToggleShowTicketModal(!toggleModalShowTicket);
    };

    return (
        <>
        <article className="ticket">
            <div className="">
                <p>{props.creatorName}</p>
                <select name="" id="" value={status} onChange={(e) => changeStatus((e.target as HTMLSelectElement).value)}>
                    <option value="pending">Attente</option>
                    <option value="start">En cour</option>
                    <option value="end">Terminée</option>
                </select>
            </div>
            <div onClick={toggleShowModal}>
                <h2>{props.title}</h2>
                <p>{props.description}</p>
            </div>
        </article>
        {
            toggleModalShowTicket &&
            <div className="ticket__modal">
                <div className="ticket__modal__container">
                    <button onClick={toggleShowModal}>X</button>
                    <h1>{props.title}</h1>
                </div>
            </div>
        }
        </>
    );
};

export default Ticket;