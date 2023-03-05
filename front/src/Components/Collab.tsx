type Props = {
    id: string, 
    username: string, 
    firstname: string, 
    lastname: string,
    token: string,
    projectId: string,
    function: any
}

const Collab = (props: Props) => {

    const removeCollab = () => {
        fetch(process.env.REACT_APP_API_URL + "/api/project/removeCollab/" + props.id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + props.token
            },
            method: 'POST',
            body: JSON.stringify({ 
                projectId: props.projectId,
           })
        })
            .then(res => {
                if (res.status === 200) {
                    props.function(props.token);
                }
            })
    };

    return (
        <li className="collabInfos">
            <a href={'/user/' + props.id}><div className="collabInfos__infos">
                <h3>{props.username}</h3>
                <p>{props.lastname} {props.firstname}</p>
            </div></a>
            <div className="collabInfos__btnCont">
                <button onClick={removeCollab}>Supprimer</button>
            </div>
        </li>
    );
};

export default Collab;