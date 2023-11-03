import './MainRoutes.css'
import { useEffect, useState } from 'react'
import { Routes,Route } from 'react-router-dom' 
import { UpperNavbar,LowerNavbar,Footer} from './components'  
import { ControlBiologico,Enfermedad,Noticia } from './Models'
import { Home,EnfermedadPage, ControlBiologicoPage,NoticiasPage,
         TesisPage,ProyectosPage,ServiciosPage,MiembrosPage,EstudiantesPage,
         InvestigadoresPage } from './pages/'
import {ServicioContextProvider,EnfermedadContextProvider,ControlBiologicoContextProvider
        ,TesisContextProvider,ColaboradorContextProvider,ProyectoContextProvider,
        NoticiaContextProvider,MiembroContextProvider,EstudianteContextProvider
        } from './Context'
import { getGeneralInfo,increaseView } from './services'

const MainRoutes = () => {
  const [info,setInfo] = useState(undefined);
  const [selectedItem, setselectedItem] = useState<Noticia | ControlBiologico | Enfermedad | undefined>(undefined)
  const [ignore,setIgnore] = useState(false);
  useEffect(() => {
    getGeneralInfo().then(
      res =>{
        if (!ignore) setInfo(res);
    })
    if(!ignore) increaseView();
    return () => { setIgnore(true) }
  }, []);
  
  return (
    <>
      <UpperNavbar />
      <LowerNavbar />
      <Routes>
        <Route path='/' element= {<Home 
          setItem = {setselectedItem}
          generalInfo = {info && info[0]}
        />}>
        </Route>
        <Route
          path='/fitopatogenos/*'
          element= {
            <EnfermedadContextProvider>
              <EnfermedadPage
                defaultItem = {selectedItem as Enfermedad | undefined}
              />
            </EnfermedadContextProvider>
          }
        >
        </Route>
        <Route path='/control_biologico/*'
        element = {
          <ControlBiologicoContextProvider>
            <ControlBiologicoPage 
              defaultItem = {selectedItem as ControlBiologico | undefined}
            />
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
          <NoticiasPage 
            defaultItem = {selectedItem as Noticia | undefined}
          />
        </NoticiaContextProvider>
        }>

        </Route>
        <Route path='/asistentes/*'
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
      <Footer
        generalInfo = {info && info[0]}
      />

    </>
  )
}
export default MainRoutes