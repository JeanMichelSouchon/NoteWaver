
// -- CONFIG BACKEND
const BASE_URL = 'http://localhost:3000'; // Adaptez selon votre backend
// DOM elements
const addNoteForm = document.getElementById('add-note-form');
const noteInput = document.getElementById('note-input');
const notesList = document.getElementById('notes-list');

// -- Raccourcis pour les éléments HTML
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



/**********************************************
 * Navigation : fonctions pour afficher/cacher
 **********************************************/
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
  renderNotes();
  showSection(sectionNotes);
}

/**********************************************
 * Gestion du token et de l'auth
 **********************************************/
function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function clearToken() {
  localStorage.removeItem('token');
}

async function loginRequest(identifier, password) {
  // On détermine si "identifier" est un email ou un username
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  const body = isEmail
    ? { email: identifier, password }
    : { username: identifier, password };

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Erreur de connexion');
  }
  return await response.json(); // { token: ... }
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
  return await response.json(); // { id, username, email, ... } ou ce que renvoie votre backend
}

/**********************************************
 * Gestion de l'UI : events / logique
 **********************************************/

// --- Boutons sur la home
document.getElementById('btn-login').addEventListener('click', goLogin);
document.getElementById('btn-signup').addEventListener('click', goSignup);

// --- Boutons "Retour"
document.getElementById('login-back').addEventListener('click', goHome);
document.getElementById('signup-back').addEventListener('click', goHome);

// --- Bouton "Connexion"
document.getElementById('login-submit').addEventListener('click', async () => {
  loginMsgEl.innerHTML = '';
  loginMsgEl.className = '';

  const identifier = loginIdentifierEl.value.trim();
  const password   = loginPasswordEl.value.trim();

  if (!identifier || !password) {
    showMessage(loginMsgEl, 'Veuillez remplir tous les champs.', true);
    return;
  }

  try {
    const data = await loginRequest(identifier, password);
    // data devrait contenir { token: '...' }
    setToken(data.token);
    showMessage(loginMsgEl, 'Connexion réussie !', false);
    // On passe à la section notes
    goNotes();
  } catch (err) {
    showMessage(loginMsgEl, err.message, true);
  }
});

// --- Bouton "Inscription"
document.getElementById('signup-submit').addEventListener('click', async () => {
  signupMsgEl.innerHTML = '';
  signupMsgEl.className = '';

  const username = signupUsernameEl.value.trim();
  const email    = signupEmailEl.value.trim();
  const password = signupPasswordEl.value.trim();

  if (!username || !email || !password) {
    showMessage(signupMsgEl, 'Veuillez remplir tous les champs.', true);
    return;
  }

  try {
    await signupRequest(username, email, password);
    showMessage(signupMsgEl, 'Inscription réussie ! Vous pouvez vous connecter.', false);
    // On peut éventuellement renvoyer automatiquement sur la section login
    // setTimeout(goLogin, 2000);
  } catch (err) {
    showMessage(signupMsgEl, err.message, true);
  }
});

// --- Bouton "Déconnexion"
document.getElementById('logout-btn').addEventListener('click', () => {
  clearToken();
  goHome();
});

// Function to fetch and display notes
async function fetchNotes() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const notes = await response.json();
    displayNotes(notes); // Fonction pour afficher les notes
  } else {
    console.error('Erreur lors de la récupération des notes.');
  }
}

// Function to display notes in the UI
function displayNotes(notes) {
  notesList.innerHTML = ''; // Clear the list
  if (notes.length === 0) {
      notesList.innerHTML = '<li>No notes available.</li>';
      return;
  }

  notes.forEach((note) => {
      const listItem = document.createElement('li');
      listItem.textContent = note.content; // Assuming `note.content` contains the text
      notesList.appendChild(listItem);
  });
}

// Function to add a new note
async function addNote(content) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/notes/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (response.ok) {
    const newNote = await response.json();
    fetchNotes(); // Recharge les notes après ajout
  } else {
    console.error('Erreur lors de l\'ajout de la note.');
  }
}

// Event listener for note submission
addNoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const noteContent = noteInput.value.trim();
  if (noteContent) {
      addNote(noteContent);
  } else {
      alert('Note content cannot be empty.');
  }
});


document.addEventListener('DOMContentLoaded', fetchNotes);

/**********************************************
 * Initialisation : on vérifie s'il existe un token
 **********************************************/
(function init() {
  const token = getToken();
  if (token) {
    // On suppose que l’utilisateur est déjà connecté
    // On affiche directement la section notes
    goNotes();
  } else {
    // Sinon on reste sur la home
    goHome();
  }
})();
