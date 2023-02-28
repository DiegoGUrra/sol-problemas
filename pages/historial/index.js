import Menu from "../components/menu";
import React, { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { useRouter } from "next/router";

//npm i reactstrap react react-dom

export default function Historial() {
  const user = useUser();
  const [rol, setRol] = useState(-1);
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  //variables
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    async function loadData() {
      try {
        let { data: id_rol, error } = await supabaseClient
          .from("profiles")
          .select("id_rol")
          .eq("id_usuario", user.id);
        setRol(id_rol[0].id_rol);
        if (error) throw error;
        if (rol === 4) {
          let { data: tickets } = await supabaseClient
            .from("ticket")
            .select("*")
            .eq("id_sol", user.id)
            .order("id_ticket", { ascending: true });
          setTickets(tickets);
        } else if (rol === 3 || rol === 2) {
          let { data: tickets } = await supabaseClient
            .from("ticket")
            .select("*")
            .eq("id_rec", user.id)
            .order("id_ticket", { ascending: true });
          setTickets(tickets);
        }
        console.log(tickets);
      } catch (error) {
        //alert(error.error_description || error.message);
      }
    }
    console.log(user, "usuario");
    if (user) loadData();
  });
  useEffect(() => {
    async () => {};
  }, []);
  return (
    <div>
      <Menu userRole={rol}></Menu>
      <div className="background-index p-0 m-0">
        <h1 className="text-center pt-5">Historial de solicitudes</h1>
          <div className="text-center m-5 tableFixHead table-responsive-sm overflow-y" style={{borderRadius: "5px"}}>
            <table className="table table-light table-borderless mx-auto " >
              <thead>
                <tr>
                  <th>Asunto</th>
                  <th>N# de la solicitud</th>
                  <th>Última actualización</th>
                  <th>Estado de solicitud</th>
                </tr>
              </thead>
              <tbody>
                    <tr className="table-group-divider"></tr>
                    {tickets.map((e) => {
                      return (
                        <tr> 
                          <td><a className="text-decoration-none link-primary" href={router.pathname + "/" + e.id_ticket} target="_self">{e.asunto}</a></td>
                          <td>None</td>
                          <td>None</td>
                          <td>None</td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
