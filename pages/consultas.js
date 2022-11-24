import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import StableSelect from "./components/StableSelect";
import { useState, useEffect } from "react";
import Account from "./account";
import Menu from "./components/menu.js";

export default function Consultas({}) {
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const [rol, setRol] = useState();
  const [carrera, setCarrera] = useState(-1);
  const [director, setDirector] = useState();
  const [secretaria, setSecretaria] = useState();
  //info ticket y mensaje
  const [asunto,setAsunto] = useState();
  const [mensaje, setMensaje] = useState();
  // encargado a enviar el correo
  const [encargadoAEnviar,setEncarcagoAEnviar] = useState();
  const encargados = ['Director','Secretaria'];
  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient
        .from("profiles")
        .select("id_rol")
        .eq("id_usuario", user.id);
      //console.log(data[0].id_rol );
      setRol(data[0].id_rol);
      //console.log(rol,"data");
      if(rol===4){
          let { data: carrera, error } = await supabaseClient
            .from("estudiantes_carrera")
            .select("id_carrera,carrera(id_director,id_secretaria)")
            .eq("id_estudiante", user.id);
          //console.log(carrera[0].carrera.id_director);
          setCarrera(carrera[0].id_carrera);
          setDirector(carrera[0].carrera.id_director);
          setSecretaria(carrera[0].carrera.id_secretaria);

          console.log({"director":director,"secretaria":secretaria});
          let { data } = await supabaseClient
          .rpc('id');
          console.log(data,"pasó");
      }
    }
    if (user) loadData();
  }, [user]);
  const crearConsulta = async () => {
    
    try {
        if(encargadoAEnviar==='Director'){
            const { data, error } = await supabaseClient
            .rpc('crear_ticket', {
            ticket:{id_rec:director,asunto:asunto}, 
            mensaje:{mensaje:mensaje}
            })
            if (error) throw error;

        }
        else{
            const { data, error } = await supabaseClient
            .rpc('crear_ticket', {
                ticket:{id_rec:secretaria,asunto:asunto}, 
                mensaje:{mensaje:mensaje}
            })
            if (error) throw error;
        } 
        //const {data,error}= await supabase.from('ticket').insert()
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };
/* 
  const handleSelectChange = ({value}) */
  return (
    <div>
      <Menu userRole={rol}></Menu>

      <>
        <div className="padding-selection">
          <h2 className="centrar-h2">Sube tu consulta</h2>
        </div>
        {/* <div className="padding-selection" id="1">
          <p>Categorias: {selectedCategoria} </p>
          <StableSelect
            defaultValue={{ label: "Selecciona una opción", value: "empty" }}
            options={categorias.map((sup) => ({
              label: sup.nombre,
              value: sup.nombre,
              id: sup.id_categoria,
            }))}
            onChange={handleSelectChange}
          />
        </div> */}
        <div className="padding-selection">
            <p>Asunto: </p>
            <input className="form-control" type='text' onChange={(e)=>setAsunto(e.target.value)}></input>
        </div>
        <div className="padding-selection">
          <p>Encargado Consulta: {encargadoAEnviar} </p>
          <StableSelect
            defaultValue={{ label: "Selecciona una opción", value: "empty" }}
            options={encargados.map((e) => ({
              label: e,
              value: e,
              id: e,
              /* id: sup.id_usuario, */
            }))}
            onChange={(e)=>{setEncarcagoAEnviar(e.value)}}
          />
        </div>
        <div className="padding-selection">
          <p>Descripción: </p>
          <form onSubmit={crearConsulta}>
            <textarea
              className="textarea"
              rows="5"
              onChange={(e) => setMensaje(e.target.value)}
            ></textarea>
            <div className="center">
              <button className="boton" type='submit'>Enviar Consulta</button>
            </div>
          </form>
          {/* {console.log({
        "mensaje":{id_rec:director,asunto:asunto}, 
        "ticket":{mensaje:mensaje}})} */}
        </div>
      </>
    </div>
  );
}
