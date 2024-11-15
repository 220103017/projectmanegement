import React, { useState, useEffect } from 'react';
import Header from './components/header';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import SearchSection from './components/SearchSection';
import ChatView from './components/ChatView';
import SearchHistory from './components/SearchHistory';
import Recommendations from './components/Recommendations';
import Notes from './components/Notes';
import './style.css';

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [authPageOpen, setAuthPageOpen] = useState(false);
  const [authType, setAuthType] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem('chats'));
    if (storedChats) {
      setChats(storedChats);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const handleSearch = (query) => {
    if (query.trim() === '') return;
    const userMessage = { text: query, sender: 'user' };
    const aiMessage = { text: `AI Response to: ${query}`, sender: 'ai' };

    setAiResponse(aiMessage.text);

    if (selectedChat !== null) {
      const updatedChats = chats.map((chat, index) => {
        if (index === selectedChat) {
          return { ...chat, messages: [...chat.messages, userMessage, aiMessage] };
        }
        return chat;
      });
      setChats(updatedChats);
    } else {
      const newChat = { title: query.substring(0, 15), messages: [userMessage, aiMessage] };
      setChats([newChat, ...chats]);
      setSelectedChat(0);
    }
  };

  const handleAuthPageOpen = (type) => {
    setAuthType(type);
    setAuthPageOpen(true);
  };

  const handleAuthPageClose = () => {
    setAuthPageOpen(false);
  };

  const handleAuthSuccess = () => {
    setAuthPageOpen(false);
    setAuthType(null);
  };

  const createNewChat = () => {
    const newChat = { title: '', messages: [] };
    setChats([newChat, ...chats]);
    setSelectedChat(0);
  };

  const handleChatSelect = (index) => {
    setSelectedChat(index);
  };

  const handleDeleteChat = (index) => {
    const updatedChats = chats.filter((_, i) => i !== index);
    setChats(updatedChats);
    if (selectedChat === index) {
      setSelectedChat(null);
    }
  };

  const handleAddNote = (note) => {
    setNotes([note, ...notes]);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  useEffect(() => {
    if (selectedChat !== null && chats[selectedChat]?.messages.length > 0 && chats[selectedChat].title === '') {
      const firstMessage = chats[selectedChat].messages[0].text;
      const updatedChats = chats.map((chat, index) => {
        if (index === selectedChat) {
          return { ...chat, title: firstMessage.substring(0, 15) };
        }
        return chat;
      });
      setChats(updatedChats);
    }
  }, [selectedChat, chats]);

  return (
    <div className="app-container">
      <Header onAuthPageOpen={handleAuthPageOpen} />

      {authPageOpen ? (
        authType === 'signIn' ? (
          <SignInPage onClose={handleAuthPageClose} onAuthSuccess={handleAuthSuccess} />
        ) : (
          <SignUpPage onClose={handleAuthPageClose} onAuthSuccess={handleAuthSuccess} />
        )
      ) : (
        <div className="main-content-container">
          <div className="left-section">
            <SearchHistory
              history={chats}
              onNewChat={createNewChat}
              onChatSelect={handleChatSelect}
              onDeleteChat={handleDeleteChat}
            />
            <Notes notes={notes} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} />
          </div>

          <div className="center-section">
            <SearchSection onSearch={handleSearch} aiResponse={aiResponse} />
            {selectedChat !== null ? (
              <ChatView chat={chats[selectedChat]} />
            ) : (
              <p className="no-chat-selected">Select or start a new chat to begin!</p>
            )}
          </div>

          <div className="right-section">
            <Recommendations />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
