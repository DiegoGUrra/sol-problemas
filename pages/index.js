import {useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Account from './account';
import LogIn from './login';
import Index_menu from './components/index_format.js';
import { useEffect } from 'react';



export default function Home() {
  
  /*const supabase = useSupabaseClient();*/
  const user = useUser()

  return (
    <div>
      {!user? <LogIn/>
    :<><Account user ={user}/>
      <Index_menu/>
      </>}
    </div>
  )
}
