import React from "react"
import { Carrousel,MainPageMiddleContainer,MapComponent,SectionLabel } from "../components"
import { ControlBiologico,Enfermedad,Noticia } from "../Models"
interface HomeProps {
  setItem : React.Dispatch<React.SetStateAction<ControlBiologico | Enfermedad | Noticia | undefined>>;
  generalInfo : any;
}
export const Home: React.FC<HomeProps> = ({setItem,generalInfo}) => {
  return (
    <>
    <MainPageMiddleContainer 
      setItem = {setItem as React.Dispatch<React.SetStateAction<Noticia | undefined>>}
      generalInfo = {generalInfo}
    />
    <hr />
    <Carrousel 
      setItem={setItem as React.Dispatch<React.SetStateAction<ControlBiologico | Enfermedad | undefined>>}
    />
    <SectionLabel 
      label = "Ubicación"
    />
    <hr/>
    <MapComponent />
    </>
  )
}
