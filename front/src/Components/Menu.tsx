
const Menu = () => {
    return (
        <nav>
            <ul>
                <a href="/"><li>Accueil</li></a>
                <a href={"/user"}><li>Profil</li></a>
            </ul>   
        </nav>
    );
};

export default Menu;