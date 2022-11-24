import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
//import {supabase} from '../api/index.js'
import { useSession, useUser,useSupabaseClient } from "@supabase/auth-helpers-react";
import swal from "sweetalert";


export default function Menu({ userRole }) {
  const supabaseClient = useSupabaseClient();
  const [roles, setRoles] = useState();
  const user=useUser();
  const logOut = async (event) => {
    event.preventDefault();
    try {
      let { event } = await supabaseClient.auth.signOut();
      location.href = "/";
      if (event) throw event;
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };
  useEffect(() => {
    async () => {
      const { data } = await supabaseClient.from("roles").select("*");
      console.log(data);
      setRoles(data);
    };
  }, []);

  const mostrarAlerta = async (e) => {
    e.preventDefault();
    swal({
      title: "Cerrar Sesión",
      text: "¿Estás seguro de querer cerrar sesión?",
      icon: "info",
      buttons: ["No", "Si"],
    }).then((respuesta) => {
      if (respuesta) {
        swal({
          text: "Sesión Cerrada Exitosamente",
          icon: "success",
          timer: "30000",
        });
        logOut(e);
        //location.href = "/";
      }
    });
  };
  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ backgroundColor: "#e3f2fd" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src={"/logo_navbar.png"}
              width="30"
              height="30"
              className=" d-inline-block align-text-top"
            ></img>
            UCM PSICI
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              {userRole === 1 ? (
                <>
                  <Link href="../">
                    <a className="nav-link active" aria-current="page" href="#">
                      Inicio
                    </a>
                  </Link>
                  <Link href="../admin-usuario">
                    <a className="nav-link" href="#">
                      Usuarios
                    </a>
                  </Link>
                  <Link href="../admin-carrera">
                    <a className="nav-link" href="#">
                      Carrera
                    </a>
                  </Link>
                </>
              ) : userRole !== 4 ? (
                <>
                  <Link href="../preguntas-frecuentes">
                    <a className="nav-link" href="#">
                      Preguntas frecuentes
                    </a>
                  </Link>
                  <Link href="../consultas">
                    <a className="nav-link" href="#">
                      Consultas
                    </a>
                  </Link>

                  {/* <Link href='../'></Link> */}
                  <Link href={"../perfil/"+user?.id}>
                    <a className="nav-link" href="#">
                      Perfil
                    </a>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="../consultas">
                    <a className="nav-link" href="#">
                      Consultas
                    </a>
                  </Link>
                  <Link href="../historial">
                    <a className="nav-link" href="#">
                      Historial
                    </a>
                  </Link>
                  <Link href="../general">
                    <a className="nav-link" href="#">
                      General
                    </a>
                  </Link>
                  <Link href={"../perfil/"+user?.id}>
                    <a className="nav-link" href="#">
                      Perfil
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="nav justify-content-end">
            <button className="btn btn-outline-dark" onClick={mostrarAlerta}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
