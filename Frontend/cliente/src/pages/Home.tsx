import { Carrousel,MainPageMiddleContainer,MapComponent,SectionLabel } from "../components"
export const Home = () => {
  return (
    <>
    <Carrousel />
    <MainPageMiddleContainer />
    <SectionLabel 
      label = "Ubicación"
    />
    <hr/>
    <MapComponent />
    </>
  )
}
