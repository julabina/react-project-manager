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
            <section>
                <a href="/"><h1>REACT TASK MANAGER</h1></a>
                <Menu />
            </section>
        </header>
    );
};

export default Header;