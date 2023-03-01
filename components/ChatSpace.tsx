'use client';

import { collection, orderBy, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import PastMessage from './PastMessage';

type Props = {
    chatId: string;
}

function ChatSpace({chatId}: Props) {

  const { data: session } = useSession();
  const [messages] =  useCollection(
    session &&
    query(
      collection(db, "users", session?.user?.email!, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    )
  );
  

  console.log('ChatSpace Messages: ', messages)
  console.log('ChatSpace Message Mapped: ', messages?.docs.map(message => (message.id)))

  return (
    <div className='flex-1 border-gray-700 overflow-y-scroll'>
      
        {messages?.docs.map(message => (
          <div>
            <PastMessage key={message.id} message={message.data()} />
          </div>
          
        ))}
    </div>
  )
}

export default ChatSpace