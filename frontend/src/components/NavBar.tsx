import { Container, Navbar, Nav } from "react-bootstrap";
import { User } from "../models/user";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import NavBarrLoggedInView from "./NavBarLoggedInView";

interface NavBarProps{
    loggedInUser: User|null,
    onSignUpClicked: ()=>void,
    onLoginClicked: ()=>void,
    onLogoutSuccessful: ()=>void,
}

const NavBar = ({loggedInUser, onSignUpClicked, onLoginClicked, onLogoutSuccessful}: NavBarProps) => {
    return ( 
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
            <Container>
                <Navbar.Brand>
                    Cool Notes App
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar"/>
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        {loggedInUser
                        ? <NavBarrLoggedInView user={loggedInUser} onLogoutSuccessful={onLogoutSuccessful}/>
                        : <NavBarLoggedOutView onLoginClicked={onLoginClicked} onSignUpClicked={onSignUpClicked}/>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
     );
}

export default NavBar;
