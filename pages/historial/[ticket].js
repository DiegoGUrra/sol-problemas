import Menu from "../components/menu";
import React, { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { useRouter } from 'next/router';
import { supabase } from '../api/index.js';

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

export default function Ticket({ mensajes, ticket }) {
  const user = useUser();
  const [rol, setRol] = useState(-1);
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  //variables
  const [mensaje, setMensaje] = useState("");


  //para sol error
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        let { data: id_rol, error } = await supabaseClient
          .from("profiles")
          .select("id_rol")
          .eq("id_usuario", user.id);
        setRol(id_rol[0].id_rol);
        console.log(router.query.ticket, "ticket");
        if (error) throw error;
        //console.log(mensajes);
      } catch (error) {
        alert(error.error_description || error.message);
      }
    }

    if (user) loadData();
  }, [user]);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);


  const enviarMensaje = async () => {
    let { error } = await supabaseClient
      .from("mensaje")
      .insert({
        id_ticket: router.query.ticket,
        mensaje: mensaje
      });
  }
  return (
    <div>
      <Menu userRole={rol}></Menu>
      <>
        {initialRenderComplete ?
          <div className="background-index p-0 m-0">
            <div className="container py-5">

              <div className="row d-flex justify-content-center">
                <div className="col-md-8 col-lg-6 col-xl-4">

                  <div className="card" id="chat1"  style={{borderRadius: "15px"}}>
                    <div
                      className="card-header d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0">
                      <i className="fas fa-angle-left"></i>
                      <p className="mb-0 fw-bold">Mensajes de la solicitud</p>
                      <i className="fas fa-times"></i>
                    </div>
                    <div className="card-body">

                      {mensajes.map((e) => {
                        return (
                          <>
                            {e.id_usuario === user.id ?
                              <div className="d-flex flex-row justify-content-end mb-4">
                                <div className="p-3 ms-3" style={{BorderRadius: "15px", Backgroundcolor: "black" }}>
                                  <p>Yo</p>
                                  <p className="small mb-0">{"➣ " + e.mensaje}</p>
                                </div>
                                              {/*<div className="card-header">
                                            <p>
                                                <div>ID usuario: {e.id_usuario}</div> 
                                                <div>ID Mía: {user.id}</div> 
                                                <div>Fecha envio: {e.fecha.substr(0, 10)} || Hora de envío: {e.fecha.substr(11, 8) + " UTP"+e.fecha.substr(26,26)} </div>
                                            </p>
                                          </div>
                                          
                                            /*<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                              alt="avatar 1" style="width: 45px; height: 100%;">
                                            
                                          </div>*/}
                              </div>
                              : <>
                                <div className="d-flex flex-row justify-content-start mb-4">
                                  <div className="ms-3" style={{BorderRadius: "15px", BackgroundColor: "black" }}>
                                    <p>Usuario</p>
                                    <p className="small text-secondary mb-0">{"➣ " + e.mensaje}</p>
                                  </div>
                                </div>
                              </>}
                          </>

                        )
                      })
                      }
                    </div>
                  </div>
                  <br></br>
                <div className="card">
                  <div className="card-body">
                    <div className="form-outline">
                      <p className="text-center">Redactar un nuevo mensaje:</p>
                      <form className="text-center" onSubmit={enviarMensaje}>
                        <textarea className="textarea w-75" rows="4" onChange={(e) => setMensaje(e.target.value)}></textarea>
                        <div>
                          <button className="btn btn-primary" type="submit">Enviar mensaje</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                </div>
              </div>
            </div>
          </div>

          : null}
      </>
    </div>
  );
}
export async function getStaticPaths() {
  let { data: ticket } = await supabase.from('ticket').select("id_ticket");

  const paths = ticket.map((t) => ({
    params: { ticket: t.id_ticket.toString() },
  }))

  return { paths, fallback: false }
}
export async function getStaticProps({ params }) {
  //console.log(params.ticket,"id ticket");
  let { data: mensajes } = await supabase.from('mensaje').select("*").eq("id_ticket", params.ticket).order('id_ticket', { ascending: true });
  let { data: ticket } = await supabase.from('ticket').select("asunto").eq("id_ticket", params.ticket);

  return {
    props: {
      mensajes: mensajes,
      ticket: ticket[0],
    },
  };
}