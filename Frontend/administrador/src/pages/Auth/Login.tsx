import { FormEvent, useState } from "react";
import { LoadingSpinner } from "../../components";
import "./Login.css";
import { useLogin } from "../../hooks/useLogin";
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import logo from '../../images/logo.png';

export const Login = () => {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const { login, error, isLoading } = useLogin();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const Submit = async (e: FormEvent) => {
        e.preventDefault();
        await login(correo, contrasena);
    }

    if (isLoading) {
        return(
            <div className="loading-container">
                <LoadingSpinner/>
            </div>

        )
    }
    return (
        <div className="login">
            <Container className="login-container">
                <img className="logo-image" src={logo} alt="Logo" />
                <label>
                    Acceda a nuestra plataforma de investigación
                    en biocontroladores para descubrir soluciones
                    innovadoras y sostenibles. Ingrese con su cuenta
                    para explorar nuestras últimas investigaciones.
                </label>
            </Container>
            <form className="login-form" onSubmit={Submit}>
                <h3>
                    Inicio de sesión
                </h3>
                <Container className="form-input-container">
                    <FloatingLabel
                        controlId="floatingCorreo"
                        label="Correo Electrónico"
                        className="login-input"
                    >
                        <Form.Control
                            type="email"
                            onChange={(e) => setCorreo(e.target.value)}
                            value={correo}
                            className="login-input"
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingContraseña"
                        label="Contraseña"
                        className="login-input"
                    >
                        <Form.Control
                            type={showPassword ? "text" : "password"} // Cambia el tipo de input
                            placeholder="Contraseña"
                            onChange={(e) => setContrasena(e.target.value)}
                            value={contrasena}
                        />
                        <span className="password-icon" onClick={() => toggleShowPassword()}>
                            {showPassword ? (
                                <i className="bx bx-show"></i>
                            ) : (
                                <i className="bx bx-low-vision"></i>
                            )}
                        </span>
                    </FloatingLabel>
                    <button
                            type="button"
                            onClick={Submit}
                        >
                            Ingresar
                        </button>
                    {/* <label className="password-restoration-label">
                        ¿Olvidaste Tu Contraseña?
                    </label> */}
                    {
                        error &&
                        <div style = {{"color":"red"}}>
                            {error}
                        </div>
                    }
                </Container>
            </form>
        </div>
    )
}
