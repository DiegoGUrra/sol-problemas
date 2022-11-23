import Menu from "../components/menu";
import React, { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import {useRouter} from 'next/router';

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

export default function Historial() {
  const user = useUser();
  const [rol, setRol] = useState(-1);
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  //variables
  const [tickets,setTickets] = useState([]);
  useEffect(() => {
    async function loadData() {
      try{
        let { data: id_rol,error} = await supabaseClient
          .from("profiles")
          .select("id_rol")
          .eq("id_usuario", user.id);
        setRol(id_rol[0].id_rol);
        if (error) throw error;
        if(rol===4){
          let {data:tickets} = await supabaseClient.from('ticket').select("*").eq("id_sol",user.id).order('id_ticket', { ascending: true }); 
          setTickets(tickets);
        }
        else if(rol===3||rol===2){
          let {data:tickets} = await supabaseClient.from('ticket').select("*").eq("id_rec",user.id).order('id_ticket', { ascending: true }); 
          setTickets(tickets);
        }
        console.log(tickets);
      }catch(error){
      alert(error.error_description || error.message);
      }
    }
    console.log(user,"usuario");
    if (user) loadData();
  }, [user]);
  useEffect(()=>{
    async ()=>{
      
    }
  },[])
  return (
    <div>
      <Menu userRole={rol}></Menu>
      <>
        {tickets.map(e=> {return (<Link href={router.pathname+"/"+e.id_ticket}><p>{e.asunto}</p></Link>)})}
      </>
    </div>
  );
}
