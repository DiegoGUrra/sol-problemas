import '../styles/globals.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import {useRouter} from 'next/router';
import {useState} from 'react';
import '../styles/mystyles.css';
//import '../styles/table_responsive.css';
//import '../styles/table_style.css';
import '../styles/Index_menu.css';
import '../styles/chatbox.css';




function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [supabaseClient] = useState(()=>createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}

export default MyApp
