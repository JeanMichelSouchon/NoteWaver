document.addEventListener('DOMContentLoaded', () => {
  // Fonction pour afficher un message (succès ou erreur)
  function showMessage(element, message, isError = false) {
    element.innerHTML = message;
    element.className = isError ? 'error' : 'success';
  }
  const BASE_URL = 'http://localhost:3000'; 

  // Raccourcis pour les éléments HTML
  const sectionHome   = document.getElementById('section-home');
  const sectionLogin  = document.getElementById('section-login');
  const sectionSignup = document.getElementById('section-signup');
  const sectionNotes  = document.getElementById('section-notes');

  const loginMsgEl    = document.getElementById('login-message');
  const signupMsgEl   = document.getElementById('signup-message');
  const notesMsgEl    = document.getElementById('notes-message');

  const loginIdentifierEl = document.getElementById('login-identifier');
  const loginPasswordEl   = document.getElementById('login-password');
  const signupUsernameEl  = document.getElementById('signup-username');
  const signupEmailEl     = document.getElementById('signup-email');
  const signupPasswordEl  = document.getElementById('signup-password');

  const noteInputEl  = document.getElementById('note-input');
  const notesListEl  = document.getElementById('notes-list');

  // --- Affichage des sections
  function showSection(section) {
    sectionHome.classList.add('hidden');
    sectionLogin.classList.add('hidden');
    sectionSignup.classList.add('hidden');
    sectionNotes.classList.add('hidden');

    section.classList.remove('hidden');
  }

  function goHome() {
    showSection(sectionHome);
  }

  function goLogin() {
    // Réinitialiser les champs
    loginMsgEl.innerHTML = '';
    loginIdentifierEl.value = '';
    loginPasswordEl.value = '';
    showSection(sectionLogin);
  }

  function goSignup() {
    // Réinitialiser les champs
    signupMsgEl.innerHTML = '';
    signupUsernameEl.value = '';
    signupEmailEl.value = '';
    signupPasswordEl.value = '';
    showSection(sectionSignup);
  }

  function goNotes() {
    // Réinitialiser la zone de saisie
    noteInputEl.value = '';
    notesMsgEl.innerHTML = '';
    fetchNotes(); // Affiche les notes à chaque fois
    showSection(sectionNotes);
  }

  // --- Gestion du token
  function getToken() {
    return localStorage.getItem('token');
  }

  function setToken(token) {
    localStorage.setItem('token', token);
  }

  function clearToken() {
    localStorage.removeItem('token');
  }

  // --- Fonctions de requêtes pour login/signup
  async function loginRequest(identifier, password) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const body = isEmail ? { email: identifier, password } : { username: identifier, password };

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Erreur de connexion');
    }

    return await response.json();
  }

  async function signupRequest(username, email, password) {
    const body = { username, email, password };

    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Erreur d\'inscription');
    }

    return await response.json();
  }

  // --- Gestion de l'UI : événements et logique
  document.getElementById('btn-login').addEventListener('click', goLogin);
  document.getElementById('btn-signup').addEventListener('click', goSignup);

  document.getElementById('login-back').addEventListener('click', goHome);
  document.getElementById('signup-back').addEventListener('click', goHome);

  document.getElementById('login-submit').addEventListener('click', async () => {
    loginMsgEl.innerHTML = '';
    loginMsgEl.className = '';

    const identifier = loginIdentifierEl.value.trim();
    const password = loginPasswordEl.value.trim();

    if (!identifier || !password) {
      showMessage(loginMsgEl, 'Veuillez remplir tous les champs.', true);
      return;
    }

    try {
      const data = await loginRequest(identifier, password);
      setToken(data.token);
      showMessage(loginMsgEl, 'Connexion réussie !', false);
      goNotes();
    } catch (err) {
      showMessage(loginMsgEl, err.message, true);
    }
  });

  document.getElementById('signup-submit').addEventListener('click', async () => {
    signupMsgEl.innerHTML = '';
    signupMsgEl.className = '';

    const username = signupUsernameEl.value.trim();
    const email = signupEmailEl.value.trim();
    const password = signupPasswordEl.value.trim();

    if (!username || !email || !password) {
      showMessage(signupMsgEl, 'Veuillez remplir tous les champs.', true);
      return;
    }

    try {
      await signupRequest(username, email, password);
      showMessage(signupMsgEl, 'Inscription réussie ! Vous pouvez vous connecter.', false);
    } catch (err) {
      showMessage(signupMsgEl, err.message, true);
    }
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearToken();
    goHome();
  });

  async function fetchNotes() {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notes/notes-fetch`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const notes = await response.json();
      displayNotes(notes);
    } else {
      console.error('Erreur lors de la récupération des notes.');
    }
  }

  function displayNotes(notes) {
    notesListEl.innerHTML = ''; // Clear the list
    if (notes.length === 0) {
      notesListEl.innerHTML = '<li>No notes available.</li>';
      return;
    }

    notes.forEach((note) => {
      const listItem = document.createElement('li');
      listItem.textContent = note.content;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', () => {
        deleteNote(note.id);
      });

      listItem.appendChild(deleteButton);
      notesListEl.appendChild(listItem);
    });
  }

  async function addNote(content) {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notes/notes-add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      const newNote = await response.json();
      fetchNotes();
    } else {
      console.error('Erreur lors de l\'ajout de la note.');
    }
  }

  async function deleteNote(noteId) {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notes/delete/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (response.ok) {
      fetchNotes(); // Rafraîchit la liste après suppression
    } else {
      console.error('Erreur lors de la suppression de la note.');
    }
  }

  document.getElementById('note-add').addEventListener('click', () => {
    const noteContent = noteInputEl.value.trim();
    if (noteContent) {
      console.log('test add');
      addNote(noteContent);
      console.log('fin test add');

      noteInputEl.value = ''; // Réinitialiser le champ après ajout
    } else {
      alert('Le contenu de la note ne peut pas être vide.');
    }
  });
  


  (function init() {
    const token = getToken();
    if (token) {
      goNotes();
    } else {
      goHome();
    }
  })();
});
