import { Routes,Route } from 'react-router-dom' 
import { Home,Login,SeccionEnfermedades,SeccionMiembros,
         NotFoundPage,BlockPage, SeccionControlBiologico, SeccionEstudiantes,
         SeccionColaboradores, SeccionNoticias, SeccionTesis, 
         SeccionServicios, SeccionRoles,SeccionGeneral, UserInformation } 
from './pages'
import { EnfermedadContextProvider,MiembroContextProvider,
        ColaboradorContextProvider,EstudiantesContextProvider,
        ServicioContextProvider,TesisContextProvider,ControlBiologicoContextProvider,
        ProyectoContextProvider,NoticiaContextProvider,RolContextProvider } 
from './context'
import { useAuthContext } from './hooks/useAuthHook'
import { Sidebar } from './components'
import { SeccionProyectos } from './pages/Sections/SeccionProyectos'
function MainRoutes() {
  const { state } = useAuthContext();
  if (state.user === null){
    return (
      <div className='login-page'>
        <Routes>
          <Route path="*" element={<Login />}>
          </Route>
        </Routes>
      </div>
    )
  }
  return (
    <div className='MainRoutes'>
        <div className='Pages' >
          <Sidebar /> 
            <Routes>
              <Route
                path = '/'
                element= { 
                  <Home /> 
                }
              >
              </Route>
              <Route
                path='/enfermedades'
                element= {
                  state.user.role.permissions.enfermedades 
                  ? 
                  <EnfermedadContextProvider>
                      <SeccionEnfermedades />
                  </EnfermedadContextProvider>
                  :
                  <BlockPage /> 
                }
              >    
              </Route>
              <Route
                path='/miembros'
                element= { 
                  state.user.role.permissions.miembros 
                  ? 
                  <MiembroContextProvider>
                      <SeccionMiembros 
                        currentUser_id={state.user.user_data.user_id}
                      />
                  </MiembroContextProvider> :
                  <BlockPage /> 
                }
              >    
              </Route>
              <Route
                path='/control_biologico'
                element= { 
                  state.user.role.permissions.control_biologico 
                  ? 
                    <ControlBiologicoContextProvider>
                      <SeccionControlBiologico />
                    </ControlBiologicoContextProvider>
                    :
                  <BlockPage /> }
              >
              </Route>
              <Route
                path='/estudiantes'
                element= { 
                  state.user.role.permissions.estudiantes ? 
                  <EstudiantesContextProvider>
                    <SeccionEstudiantes /> 
                  </EstudiantesContextProvider>
                  :
                  <BlockPage /> }
              >
              </Route>
              <Route
                path='/colaboradores'
                element= {
                  state.user.role.permissions.colaboradores ? 
                  <ColaboradorContextProvider>
                    <SeccionColaboradores />  
                  </ColaboradorContextProvider>
                  :
                  <BlockPage /> }
              >
              </Route>
              <Route
                path='/noticias'
                element= { 
                  state.user.role.permissions.noticias ? 
                  <NoticiaContextProvider>
                    <SeccionNoticias /> 
                  </NoticiaContextProvider>
                  : 
                  <BlockPage /> }
              >
              </Route>
              <Route
                path='/tesis'
                element= { 
                  state.user.role.permissions.tesis ? 
                  <TesisContextProvider>
                    <SeccionTesis /> 
                  </TesisContextProvider>
                  : 
                  <BlockPage /> }
              >
              </Route>
              <Route
                path='/servicios'
                element={
                  state.user.role.permissions.servicios ?
                    <ServicioContextProvider> 
                      <SeccionServicios />
                    </ServicioContextProvider>
                    :
                    <BlockPage />
                }
              >
              </Route>
              <Route
                path='/proyectos'
                element= { 
                  state.user.role.permissions.proyectos ?
                  <ProyectoContextProvider>
                    <SeccionProyectos />
                  </ProyectoContextProvider>
                   : 
                  <BlockPage />
                }
              >
              </Route>
              <Route
                path='/roles'
                element= {  
                  state.user.role.permissions.rol ? 
                  <RolContextProvider>
                    <SeccionRoles />
                  </RolContextProvider>
                   :
                  <BlockPage /> }
              >
              </Route>
              <Route
                path='/user'
                element= {  
                  <UserInformation />
                }
              >
              </Route>
              <Route
                path='/general'
                element= {  
                  <SeccionGeneral />
                }
              >
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    </div>
  )
}
export default MainRoutes