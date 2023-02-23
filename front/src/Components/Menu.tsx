type Props = {
    id: string
}

const Menu = (props: Props) => {
    return (
        <nav>
            <ul>
                <a href="/"><li>Accueil</li></a>
                <a href={"/profil=" + props.id}><li>Profil</li></a>
            </ul>   
        </nav>
    );
};

export default Menu;