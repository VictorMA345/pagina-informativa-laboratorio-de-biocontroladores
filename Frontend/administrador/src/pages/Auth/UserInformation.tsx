import { getMiembro,getRol,getProyecto,updateMiembro } from '../../services';
import { ReactNode, useEffect,useState } from 'react';
import { Miembro,Rol,Proyecto } from '../../Models';
import { LoadingSpinner,LoadingModal,NotificationToast } from '../../components';
import { Dropdown,Form } from 'react-bootstrap';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn
  } from 'mdb-react-ui-kit';
  import './UserInformation.css'
import { useAuthContext } from '../../hooks/useAuthHook';
export const UserInformation = () => {
    const [currentUser,setCurrentUser] = useState<any | undefined>(undefined);
    const [currentRole,setCurrentRole] = useState<Rol | undefined>(undefined);
    const [currentProjects,setCurrentProjects] = useState<Proyecto[] | undefined>(undefined);
    const [showResume, setShowResume] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newAreaEspecializacion, setNewAreaEspecializacion] = useState<string>(''); 
    const [newPassword, setNewPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [passwordMatchError, setPasswordMatchError] = useState(false); 
    const [originalUser, setOriginalUser] = useState<Miembro | undefined>(undefined);
    const [newProfilePicture, setNewProfilePicture] = useState<Blob | MediaSource | string>(''); 
    const [newCurriculum, setNewCurriculum] = useState<Blob | MediaSource | string>(''); 

    const [isLoadingModal,setisLoadingModal] = useState<boolean>(false)
    const { state } = useAuthContext();


    const [toast,setToast] = useState<boolean>(false)
    const [toastType,setToastType] = useState<string>("");
    const [toastStateMsg,setToastStateMsg] = useState<string>("")
    const [resultMsg,setResultMsg] = useState("");
    const LoadingModalContent = () => {
        if (isLoadingModal === true) {
          return <LoadingModal 
                    show={isLoadingModal} 
                    headerLabel="Editando Usuario"
                    bodyLabel=" Editando ...."
                />;
        }
      };
    const openResumeInNewTab = () => {
        if (currentUser?.curriculumDocumento) {
          window.open(currentUser.curriculumDocumento, '_blank');
        }
      };
    const toggleEditing = () => {
        setEditing(!editing);
    };
    const cancelEditing = () => {
        setCurrentUser(originalUser);
        setEditing(false);
      };
    const handleAddAreaEspecializacion = () => {
        if (newAreaEspecializacion) {
        setCurrentUser((prevUser : any) => ({
            ...prevUser,
            areaEspecializacion: [...prevUser.areaEspecializacion, newAreaEspecializacion],
        }));
        setNewAreaEspecializacion(''); 
        }
    };
    const handleChange = (e : any) => {
        const { name, value } = e.target;
        setCurrentUser({ ...currentUser, [name]: value });
      };
    const passwordsMatch = () => {
    return newPassword === confirmPassword;
    };
    const handleRemoveAreaEspecializacion = (index: number) => {
        setCurrentUser((prevUser : any) => {
          const updatedAreas = [...prevUser.areaEspecializacion];
          updatedAreas.splice(index, 1);
          return { ...prevUser, areaEspecializacion: updatedAreas };
        });
      };
      
    const handleSave = async() => {
        setisLoadingModal(true)
        if (passwordsMatch() ) {
            setEditing(false);
            setPasswordMatchError(false);
            let updatedUser ;
            if ((confirmPassword !== '' && newPassword !== '')){
                updatedUser = { ...currentUser,contrasena: newPassword }; 
            }
            else{
                updatedUser = { ...currentUser }
            }
            if (newProfilePicture) {
                updatedUser.fotoPerfil = newProfilePicture;
            }
            if (newCurriculum) {
                updatedUser.curriculumDocumento = newCurriculum;
            }
            const updatedUserData = await updateMiembro(updatedUser._id, updatedUser) || {};
            if ('error' in updatedUserData) {
                setResultMsg("Ha ocurrido un error inesperado al actualizar el usuario");
                setToastStateMsg("Error inesperado");
                setToastType("failure");
                setToast(true);
            } else {
                setCurrentUser(updatedUserData);
                setToastStateMsg("Usuario editado con éxito!");
                setResultMsg("Se han actualizado los datos de usuario");
                setToastType("success");
                setToast(true);
            }
            setOriginalUser(currentUser);
            
        } else {
            setPasswordMatchError(true); 
        }
        setisLoadingModal(false)
    };
    
    useEffect(() => {
        const fetchUser = async() =>{
            const user = await getMiembro(state.user.user_data.user_id);
            const role = await getRol(state.user.user_data.role_name)
            if (user) {
                const projectPromises = user.proyectosParticipacion.map(async (projectId : any) => {
                  const project = await getProyecto(projectId);
                  return project;
                });
        
                const projects = await Promise.all(projectPromises);
                setCurrentProjects(projects);
              }
            setOriginalUser(user)
            setCurrentUser(user)
            setCurrentRole(role)
        }       
        fetchUser();
    }, [editing])
    if(!currentUser || !currentProjects || !currentRole){
        return (
            <div className="user-information-container">
                <LoadingSpinner />
            </div>
        )
    }
    return (
        <>
        <div className="user-information-container">
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                        <MDBCardBody className="text-center">
                            {editing ? (
                                <>
                                <label
                                    htmlFor="profilePictureInput"
                                    style={{
                                    cursor: 'pointer',
                                    marginBottom: '10px',
                                    display: 'block',
                                    }}
                                >
                                    Cambiar Foto de Perfil
                                </label>
                                <input
                                    type="file"
                                    onChange=
                                    {
                                        (e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            if (file) {
                                                setNewProfilePicture(file);
                                            }}
                                    }
                                />
                                <MDBCardImage
                                    src={newProfilePicture && typeof newProfilePicture !== "string" ? URL.createObjectURL(newProfilePicture) : currentUser.fotoPerfil}
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: '150px', cursor: 'pointer' }}
                                    fluid
                                />
                                </>
                            ) : (
                                <>
                                <MDBCardImage
                                    src={currentUser.fotoPerfil}
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: '150px', cursor: 'pointer' }}
                                    fluid
                                />
                                <p className="text-muted mb-1">{currentUser.nombreCompleto}</p>
                                <p className="text-muted mb-4">{currentRole?.role_name}</p>
                                </>
                            )}
                              {editing ? (
                                <>

                                <input
                                    type="file"
                                    onChange=
                                    {
                                        (e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            if (file) {
                                                setNewCurriculum(file);
                                            }}
                                    }
                                />
                                                                <a
                                    onClick={openResumeInNewTab}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Cambiar Curriculum
                                </a>
                                <div className="download-resume-container">

                                    {!editing && <a
                                    onClick={() => setShowResume(!showResume)}
                                    style={{ cursor: 'pointer' }}
                                    >
                                    Ver Currículum
                                    {!editing && showResume ? (
                                        <i className="bx bx-up-arrow"></i>
                                    ) : (
                                        <i className="bx bx-down-arrow"></i>
                                    )}
                                    </a>}
                                </div>
                                {!editing && showResume && (
                                    <div className="resume-container">
                                    <a
                                        onClick={openResumeInNewTab}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Descargar Currículum
                                    </a>
                                    </div>
                                )}
                                </>
                            ) : (
                                <>
                                <div className="download-resume-container">
                                    <a
                                    onClick={() => setShowResume(!showResume)}
                                    style={{ cursor: 'pointer' }}
                                    >
                                    Ver Currículum{' '}
                                    {showResume ? (
                                        <i className="bx bx-up-arrow"></i>
                                    ) : (
                                        <i className="bx bx-down-arrow"></i>
                                    )}
                                    </a>
                                </div>
                                {showResume && (
                                    <div className="resume-container">
                                    <a
                                        onClick={openResumeInNewTab}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Descargar Currículum
                                    </a>
                                    </div>
                                )}
                                </>
                            )}
                            </MDBCardBody>
                            </MDBCard>
                    </MDBCol>
                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                        <MDBCardBody>
                            <MDBCardText className='user-table-row'>
                            <strong>Nombre Completo:</strong>{' '}
                            {editing ? (
                                <input
                                className='user-info-field'
                                type="text"
                                name="nombreCompleto"
                                value={currentUser.nombreCompleto}
                                onChange={handleChange}
                                />
                            ) : (
                                currentUser.nombreCompleto
                            )}
                            </MDBCardText>
                            <hr />
                            <MDBCardText className='user-table-row' >
                            <strong>Correo:</strong>{' '}
                            {editing ? (
                                <input
                                className='user-info-field'
                                type="text"
                                name="correo"
                                value={currentUser.correo}
                                onChange={handleChange}
                                />
                            ) : (
                                currentUser.correo
                            )}
                            </MDBCardText>
                            <hr />
                            <MDBCardText className='user-table-row'>
                            <strong>Número de teléfono:</strong>{' '}
                            {editing ? (
                                <input
                                className='user-info-field'
                                type="text"
                                name="telefono"
                                value={currentUser.telefono}
                                onChange={handleChange}
                                />
                            ) : (
                                currentUser.telefono
                            )}
                            </MDBCardText>
                            <hr />
                            <MDBCardText className='user-table-row'>
                            <strong>Género:</strong>{' '}
                            {editing ? (
                            <Dropdown onSelect={(eventKey) => handleChange({ target: { name: 'genero', value: eventKey } })}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                {currentUser.genero}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                <Dropdown.Item eventKey="Masculino">Masculino</Dropdown.Item>
                                <Dropdown.Item eventKey="Femenino">Femenino</Dropdown.Item>
                                <Dropdown.Item eventKey="Prefiero no decir">Prefiero no decir</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            ) : (
                                currentUser.genero
                            )}
                            </MDBCardText>
                            <hr />
                            <MDBCardText className='user-table-row'>
                            <strong>Fecha de Nacimiento</strong>{' '}
                            {editing ? (
                                <Form.Control 
                                    className="user-info-form-date" 
                                    type="date"
                                    value={ currentUser.fechaNacimiento ? currentUser.fechaNacimiento.split('T')[0] : ''     }
                                    onChange={(e) => handleChange({target: { name: 'fechaNacimiento', value: e.target.value }} )}
                                >
                                </Form.Control>
                            ) : (
                                currentUser.fechaNacimiento as ReactNode
                            )}
                            </MDBCardText>
                            <hr />
                            <MDBCardText className='user-table-row'>
                            <strong>Resumen: </strong>{' '}
                            {editing ? (
                                <textarea
                                className='user-info-field'
                                rows={7}
                                name="resumen"
                                value={currentUser.resumen}
                                onChange={(e) => handleChange({target: { name: 'resumen', value: e.target.value }})}
                                />
                            ) : (
                                currentUser.resumen
                            )}
                            </MDBCardText>
                            <hr />
                            <MDBCardText className='user-table-row'>
                                <strong>Área de especialización:</strong>{' '}
                                {editing ? (
                                    <div>
                                    {currentUser.areaEspecializacion.map((area : any, index : number) => (
                                        <div key={index} className="text-muted">
                                        {area}
                                        <button className='area-button' onClick={() => handleRemoveAreaEspecializacion(index)}>x</button>
                                        </div>
                                    ))}
                                    <input
                                        className='user-info-field'
                                        type="text"
                                        name="areaEspecializacion"
                                        value={newAreaEspecializacion}
                                        onChange={(e) => setNewAreaEspecializacion(e.target.value)}
                                    />
                                    <button onClick={handleAddAreaEspecializacion}>Agregar</button>
                                    </div>
                                ) : (
                                    currentUser.areaEspecializacion.map((area : any, index : number) => (
                                    <div key={index} className="text-muted">
                                        {area}
                                    </div>
                                    ))
                                )}
                                </MDBCardText>
                                <hr />
                               
                                <MDBCardText className="user-table-row">
                                <strong>Contraseña:</strong>{' '}
                                    {editing ? (
                                    <div>
                                        <input
                                        className='user-info-field'
                                        type="password"
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Nueva Contraseña"
                                        />
                                        <input
                                        className='user-info-field'
                                        type="password"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirmar Contraseña"
                                        />
                                        {passwordMatchError && <p className="   text-danger">Las contraseñas no coinciden.</p>}
                                    </div>
                                    ) : (
                                    '******'
                                    )}
                                </MDBCardText>
                                <hr />
                            {editing ? (
                                <MDBRow>
                                <MDBCol sm="9">
                                    <MDBBtn onClick={handleSave}  color="secondary">
                                    Guardar Cambios
                                    </MDBBtn>
                                    <MDBBtn onClick={cancelEditing} style={{"marginLeft":"5%"}} color="secondary">
                                    Cancelar
                                    </MDBBtn>
                                </MDBCol>
                                </MDBRow>
                            ) : (
                                <MDBRow>
                                <MDBCol sm="9">
                                    <MDBBtn onClick={toggleEditing} color="secondary">
                                    Editar Perfil
                                    </MDBBtn>
                                </MDBCol>
                                </MDBRow>
                            )}
                        </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        </div>
        <LoadingModalContent />
        <NotificationToast 
                open = {toast}
                setOpen = {setToast}
                headerLabel={toastStateMsg}
                label={resultMsg}
                type={toastType}
            />
        </>
    )
}
