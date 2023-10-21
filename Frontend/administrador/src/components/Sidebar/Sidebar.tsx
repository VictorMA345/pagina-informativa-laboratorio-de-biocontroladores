import { useState,useEffect } from "react"
import { getMiembro } from "../../services"
import { Link } from "react-router-dom"
import "./Sidebar.css"
import { useLogout } from "../../hooks/useLogOut"
import { useAuthContext } from '../../hooks/useAuthHook'
import { LoadingSpinner } from ".."
export const Sidebar = () => {
    // context  
    const { logout } = useLogout();
    const { state } = useAuthContext();
    // States
    const [Sidebar,setSidebar] = useState<Boolean>(false)
    const [activeLink,setActiveLink] = useState<String>("")
    const [currentUser, setCurrentUser] = useState<any>(undefined);
    // Functions
    const handleSidebar = () =>{
        setSidebar(!Sidebar)
    }
    const handleActiveLink = (activeLink :String) =>{
        setActiveLink(activeLink);
    }
    const handleLogOut = () =>{
        logout();
    }
    useEffect(() => {
        const fetchUser = async() =>{
            const user = await getMiembro(state.user.user_data.user_id);
            setCurrentUser(user);
        }
        fetchUser();
    }, [])
    if (!currentUser){
        return(
            <div>
                <LoadingSpinner />
            </div>
        )
    }
    return (
    <div className="sidebar-container">
        <header className="header" id="header">
            <div className="header_toggle"> 
                {!Sidebar ? (
                    <i className='bx bx-menu' id="header-toggle" onClick={handleSidebar}></i>
                ) : (
                    <i className='bx bx-x' id="header-toggle" style={{"marginLeft":"9vw"}} onClick={handleSidebar}></i>
                )}
            </div>
            <div className="header_img"> 
            </div>
            <Link to="/user">
                <div className="profile-container">
                    <div className="profile-label-container">
                        <h6>
                            {state.user.user_data.correo}
                        </h6>
                        <p>
                            {state.user.role.role_name}
                        </p>
                    </div>

                </div>
            </Link>

        </header>
        
        <div className={`l-navbar ${Sidebar ? "show": "" }`} id="nav-bar">
            <nav className="nav">
                <div> 
                    <Link to = "/" className="link-react">
                        <a className="nav_logo"> 
                            <i className='bx bx-home'>

                            </i> 
                            <span className="nav_logo-name">
                                Inicio
                            </span> 
                        </a>
                    </Link>
                    <div >
                        <Link to = "/miembros" className="link-react">
                            <a
                                className={`nav_link ${activeLink === "Miembros" ? "active":""}`}
                                onClick={() => handleActiveLink("Miembros")}
                            > 
                                <i className='bx bx-group nav_icon' >
                                </i> 
                                <span className="nav_name">
                                    Miembros
                                </span> 
                            </a> 
                        </Link>

                        <Link to="/estudiantes" className="link-react">
                            <a
                                className={`nav_link ${activeLink === "Estudiantes" ? "active":""}`} 
                                onClick={() => handleActiveLink("Estudiantes")}
                            > 
                                <i className='bx bx-user nav_icon' >
                                </i> 
                                <span className="nav_name"> 
                                    Estudiantes
                                </span> 
                            </a> 
                        </Link>
                        <Link to= "/tesis" className="link-react">
                            <a 
                                className={`nav_link ${activeLink === "Tesis" ? "active":""}`} 
                                onClick={() => handleActiveLink("Tesis")}
                            > 
                                <i className='bx bx-book nav_icon' >
                                </i> 
                                <span className="nav_name">
                                    Tesis
                                </span> 
                            </a> 
                        </Link>
                        <Link to = "proyectos" className="link-react">
                            <a 
                                className={`nav_link ${activeLink === "Proyectos" ? "active":""}`}
                                onClick={() => handleActiveLink("Proyectos")}
                            > 
                                <i className='bx bx-clipboard nav_icon' >
                                </i> 
                                <span className="nav_name">
                                    Proyectos
                                </span> 
                            </a> 
                        </Link>
                        <Link to = "/enfermedades" className="link-react">
                            <a 
                                className={`nav_link ${activeLink === "Enfermedades" ? "active":""}`}
                                onClick={() => handleActiveLink("Enfermedades")}
                            > 
                                <i className='bx bxs-virus nav_icon' >
                                </i> 
                                <span className="nav_name">
                                    Enfermedades
                                </span> 
                            </a> 
                        </Link>
                        <Link to = "/control_biologico" className="link-react">
                            <a 
                                className={`nav_link ${activeLink === "Control Biológico" ? "active":""}`}
                                onClick={() => handleActiveLink("Control Biológico")}
                            > 
                                <i className='bx bx-bug nav_icon' >
                                </i> 
                                <span className="nav_name">
                                    Control Biológico
                                </span> 
                            </a>
                        </Link>
                        <Link to = "/roles" className="link-react">
                            <a 
                                className={`nav_link ${activeLink === "Roles" ? "active":""}`}
                                onClick={() => handleActiveLink("Roles")}
                            > 
                                <i className='bx bx-id-card nav_icon' >
                                </i> 
                                <span className="nav_name">
                                    Roles
                                </span> 
                            </a> 
                        </Link>
                        <Link to= "/noticias" className="link-react">     
                            <a 
                                className={`nav_link ${activeLink === "Noticias" ? "active":""}`} 
                                onClick={() => handleActiveLink("Noticias")}
                            > 
                                <i className='bx bx-news nav_icon' >
                                </i> 
                                <span className="nav_name">
                                    Noticias
                                </span> 
                            </a> 
                        </Link>
                        <Link to = "/servicios" className="link-react">
                            <a 
                                className={`nav_link ${activeLink === "Servicios" ? "active":""}`}
                                onClick={() => handleActiveLink("Servicios")}
                            > 
                                <i className='bx bx-briefcase-alt-2 nav_icon' >
                                </i> 
                                <span className="nav_name">
                                    Servicios
                                </span> 
                            </a>  
                        </Link>
                        <Link to = "/colaboradores" className="link-react">
                            <a
                                className={`nav_link ${activeLink === "Colaboradores" ? "active":""}`}
                                onClick={() => handleActiveLink("Colaboradores")}
                            > 
                                <i className='bx bx-user-pin nav_icon' >
                                </i> 
                                <span className="nav_name">
                                    Colaboradores
                                </span> 
                            </a> 
                        </Link>
                </div>
                </div> 
                <Link to = "/" className="link-react">
                    <a 
                        className={`nav_link ${activeLink === "Cerrar Sesión" ? "active":""}`}
                        onClick={() => {handleLogOut();handleActiveLink("Cerrar Sesión")}}
                    > 
                        <i className='bx bx-log-out nav_icon' >
                        </i> 
                        <span className="nav_name">
                            Cerrar Sesión
                        </span> 
                    </a>
                </Link>
            </nav>
        </div>
    </div>
  )
}
