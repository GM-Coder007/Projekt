import { useContext } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";

function Header(props) {
    return (
        <header>
            <h1>{props.title}</h1>
            <nav>
                <ul>
                    <li><Link to='/'>Domov</Link></li>
                    <UserContext.Consumer>
                        {context => (
                            context.user ?
                                <>
                                    <li><Link to='/ustvariVoznjo'>Ustvari vožnjo</Link></li>
                                    <li><Link to='/logout'>Odjava</Link></li>
                                </>
                            :
                                <>
                                    <li><Link to='/login'>Prijava</Link></li>
                                    <li><Link to='/register'>Registracija</Link></li>
                                </>

                        )}
                    </UserContext.Consumer>
                </ul>
            </nav>
        </header >
    );
}

export default Header;