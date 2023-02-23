import { useEffect, useState } from 'react';
import Menu from './Menu';

const Header = () => {
    
    const [id, setId] = useState<string>(""); 
    
    useEffect(() => {
        let getToken = localStorage.getItem('react_project_manager_token') || "";
        let token = JSON.parse(getToken);

        setId(token.content);
    },[])

    return (
        <header className='header'>
            <h1>TITRE</h1>
            <Menu id={id} />
        </header>
    );
};

export default Header;