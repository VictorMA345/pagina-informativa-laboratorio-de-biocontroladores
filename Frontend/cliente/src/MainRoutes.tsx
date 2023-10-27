import './MainRoutes.css'
import { Routes,Route } from 'react-router-dom' 
import { UpperNavbar,LowerNavbar,Footer} from './components'
import { Home,EnfermedadPage, ControlBiologicoPage,NoticiasPage,
         TesisPage,ProyectosPage,ServiciosPage,MiembrosPage,EstudiantesPage,
         InvestigadoresPage } from './pages/'
import {ServicioContextProvider,EnfermedadContextProvider,ControlBiologicoContextProvider} from './Context'
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
        <Route path='/tesis'
          element = {<TesisPage />}>
        </Route>  
        <Route path='/servicios/*'
        element = {
          <ServicioContextProvider>
            <ServiciosPage />
          </ServicioContextProvider>
          }>
        </Route>


        <Route path='/proyectos'
        element = {<ProyectosPage />}>

        </Route>
        <Route path='/noticias'
        element = {<NoticiasPage />}>

        </Route>
        <Route path='/miembros'
        element = {<MiembrosPage />}>

        </Route>
        <Route path='/investigadores'
        element = {<InvestigadoresPage />}>

        </Route>
        <Route path='/estudiantes'
        element = {<EstudiantesPage />}>

        </Route>
      </Routes>
      <Footer/>
    </>
  )
}
export default MainRoutes