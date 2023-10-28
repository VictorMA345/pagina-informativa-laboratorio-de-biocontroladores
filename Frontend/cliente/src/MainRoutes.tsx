import './MainRoutes.css'
import { Routes,Route } from 'react-router-dom' 
import { UpperNavbar,LowerNavbar,Footer} from './components'
import { Home,EnfermedadPage, ControlBiologicoPage,NoticiasPage,
         TesisPage,ProyectosPage,ServiciosPage,MiembrosPage,EstudiantesPage,
         InvestigadoresPage } from './pages/'
import {ServicioContextProvider,EnfermedadContextProvider,ControlBiologicoContextProvider
        ,TesisContextProvider,ColaboradorContextProvider,ProyectoContextProvider,
        NoticiaContextProvider,MiembroContextProvider,EstudianteContextProvider
        } from './Context'
const MainRoutes = () => {
  return (
    <>
      <UpperNavbar />
      <LowerNavbar />
      <Routes>
        <Route path='/' element= {<Home />}>
        </Route>
        <Route
          path='/enfermedades/*'
          element= {
            <EnfermedadContextProvider>
              <EnfermedadPage/>
            </EnfermedadContextProvider>
          }
        >
        </Route>
        <Route path='/control_biologico/*'
        element = {
          <ControlBiologicoContextProvider>
            <ControlBiologicoPage />
          </ControlBiologicoContextProvider>
          }>

        </Route>
        <Route path='/tesis/*'
          element = {
            <TesisContextProvider>
              <TesisPage />
            </TesisContextProvider>
          }>
        </Route>  
        <Route path='/servicios/*'
        element = {
          <ServicioContextProvider>
            <ServiciosPage />
          </ServicioContextProvider>
          }>
        </Route>
        <Route path='/proyectos/*'
        element = {
        <ProyectoContextProvider>
          <ProyectosPage />
        </ProyectoContextProvider>
        }>
        </Route>
        <Route path='/noticias/*'
        element = {
        <NoticiaContextProvider>
          <NoticiasPage />
        </NoticiaContextProvider>
        }>

        </Route>
        <Route path='/miembros/*'
        element = {
        <MiembroContextProvider>
          <MiembrosPage />
        </MiembroContextProvider>
        }>

        </Route>
        <Route path='/investigadores/*'
        element = {
          <ColaboradorContextProvider>
            <InvestigadoresPage />
          </ColaboradorContextProvider>
          }>
        </Route>
        <Route path='/estudiantes/*'
        element = {
          <EstudianteContextProvider>
            <EstudiantesPage />
          </EstudianteContextProvider>
        }>
        </Route>
      </Routes>
      <Footer/>
    </>
  )
}
export default MainRoutes