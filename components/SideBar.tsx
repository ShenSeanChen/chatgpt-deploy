'use client'

import { useSession, signOut } from 'next-auth/react'
import React from 'react'
import NewChat from './NewChat'
import { collection, orderBy, query } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"
import { db } from '../firebase'
import SideBarRow from './SideBarRow'
import ModelSelection from './ModelSelection'

function SideBar() {
  const { data: session } = useSession()

// sort the chats in descending orders, and the newly created chat will rank top
  const [chats, loading, error] = useCollection(
    session && 
    query(
        collection(db, "users", session.user?.email!, "chats"),
        orderBy("createdAt", "desc")
    )
  );

  // console.log("Chats Collection: ", chats?.docs.length)
  // console.log(chats?.docs.map(chat => (chat.id)))
  
  return (
    <div className={`bg-[#202123] md:min-w-[10rem] p-2 flex flex-col h-screen min-w-[5rem] overflow-y-scroll overflow-x-scroll ${chats?.docs.length === 0 && "hidden"}`}>
        <div className='flex-1 overflow-x-scroll'>
            <div className='space-y-2'>

                {/* NewChat */}
                <div className='border-gray-700 border chatRow'>
                 <NewChat/>
                </div>
                

                {/* ModelSelection */}
                <div className='hidden sm:inline'>
                  <ModelSelection />
                </div>

                {loading && (
                  <div className='animate-pulse text-center text-white'>
                    <p>Loading Chats...</p>
                  </div>
                )}

                {/* Map through the ChatRows */}
                {chats?.docs.map((chat, ind_iter) => {
                  const first_sess_url = "chat/"+chats?.docs[0]?.id
                  const second_sess_url = "chat/"+chats?.docs[1]?.id
                  const prev_url = (ind_iter>=1) ? "chat/"+chats?.docs[ind_iter-1]?.id : ""
                  // console.log("First Sess ID: ", first_sess_url)
                  // console.log("Second Sess ID: ", second_sess_url)
                  // console.log("Previous Sess ID: ", prev_url)
                  // console.log("Current Sess ID: ", chat.id)

                  return (
                    <div key={ind_iter} className='pt-1 overflow-x-scroll'>
                        <SideBarRow key={chat.id} id={chat.id} first_sess_url={first_sess_url} second_sess_url={second_sess_url} prev_url={prev_url}/>
                    </div>
                  )
                })} 
            </div>
        </div>
        
        {session && (
            <img 
                onClick={() => signOut()}
                src={session.user?.image!}
                alt="Profile Pic"
                className='shrink-0 h-12 w-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50'

            />
        )}

    </div>
  )
}

export default SideBar