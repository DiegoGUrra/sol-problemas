import Menu from "../components/menu";
import React, { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import {useRouter} from 'next/router';
import {supabase} from '../api/index.js';

//npm i reactstrap react react-dom
import {
  Table,
  Button,
  Container,
  ModalBody,
  ModalHeader,
  FormGroup,
  ModalFooter,
} from "reactstrap";

export default function Ticket({mensajes,ticket}) {
  const user = useUser();
  const [rol, setRol] = useState(-1);
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  //variables
  const [mensaje,setMensaje]= useState("");


  //para sol error
  const [initialRenderComplete,setInitialRenderComplete] = useState(false);

  useEffect(() => {
    async function loadData() {
      try{
        let { data: id_rol,error} = await supabaseClient
          .from("profiles")
          .select("id_rol")
          .eq("id_usuario", user.id);
        setRol(id_rol[0].id_rol);
        console.log(router.query.ticket,"ticket");
        if (error) throw error;
        //console.log(mensajes);
      }catch(error){
      alert(error.error_description || error.message);
      }
    }

    if (user) loadData();
  }, [user]);

  useEffect(()=>{
    setInitialRenderComplete(true);
  },[]);


  const enviarMensaje = async ()=>{
    let { error} = await supabaseClient
          .from("mensaje")
          .insert({id_ticket:router.query.ticket,
                mensaje:mensaje});
  }
  return (
    <div>
      <Menu userRole={rol}></Menu>
      <>
        {initialRenderComplete?
        <>
        
        <h1>{ticket?.asunto}</h1>
        <hr></hr>
        {mensajes.map((e)=>{return (<>
            <p>
                <div>ID usuario: {e.id_usuario}</div> 
                <div>Fecha envio: {e.fecha}</div>
            </p>
            <p>Mensaje</p>
            <p>{e?.mensaje}</p>
            <hr></hr>
            </> )})
        }</>
        :null}
        <p>Crear mensaje</p>
        <form onSubmit={enviarMensaje}>
            <textarea onChange={(e)=>setMensaje(e.target.value)}></textarea>
            <button type="submit">Enviar mensaje</button>
            
        </form>   
      </>
    </div>
  );
}
export async function getStaticPaths() {
    let {data:ticket} = await supabase.from('ticket').select("id_ticket"); 
  
    const paths = ticket.map((t) => ({
      params: { ticket: t.id_ticket.toString() },
    }))
  
    return { paths, fallback: false }
  }
export async function getStaticProps({params}) {
    //console.log(params.ticket,"id ticket");
    let {data:mensajes} = await supabase.from('mensaje').select("*").eq("id_ticket",params.ticket).order('id_ticket', { ascending: true }); 
    let {data:ticket} = await supabase.from('ticket').select("asunto").eq("id_ticket",params.ticket); 

    return {
      props: {
        mensajes: mensajes,
        ticket: ticket[0],
      },
    };
  }