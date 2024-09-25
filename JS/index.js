// Funcion principal de la app

function popup() {
    const popupContainer = document.createElement("div");
    popupContainer.innerHTML = `
    <div id="popupContainer" class="${document.body.classList.contains('dark-mode') ? 'dark-mode' : ''}">
        <h1>Nueva Nota</h1>
        <textarea class="title-note-content" id="title-text" placeholder="Titulo"></textarea>
        <textarea class="note-content" id="note-text" placeholder="Escribe tu nota..."></textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="createNote()">Crear Nota</button>
            <button id="closeBtn" onclick="closePopup()">Cancelar</button>
        </div>
    </div>
    `;
    document.body.appendChild(popupContainer);
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    if(popupContainer) {
        popupContainer.remove();
    }
}

function createNote() {

    const popupContainer = document.getElementById('popupContainer');
    const titleText = document.getElementById('title-text').value;
    const noteText = document.getElementById('note-text').value;

    if (noteText.trim() !== '') {
        const note = { id: new Date().getTime(), text: noteText, title: titleText };

        const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
        existingNotes.push(note);

        localStorage.setItem('notes', JSON.stringify(existingNotes));

        document.getElementById('note-text').value = '';

        document.getElementById('title-text').value = '';

        popupContainer.remove();
        displayNotes();
    }


}

function displayNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
        <span class="note-title">${note.title}</span> <br> <span class="note-text">${note.text}</span>
        `;
        listItem.addEventListener('click', () => {
            // Abrimos el popup de edición con la nota seleccionada
            editNote(note.id);
        });
        notesList.appendChild(listItem);
    });
}

function editNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find(note => note.id == noteId);
    const noteText = noteToEdit ? noteToEdit.text : '';
    const editingPopup = document.createElement("div");
    editingPopup.innerHTML = `
    <div id="editing-container" data-note-id="${noteId}" class="${document.body.classList.contains('dark-mode') ? 'dark-mode' : ''}">
        <h1>Editar Nota</h1>
        <textarea class="title-note-content" id="title-text">${noteToEdit.title}</textarea>
        <textarea class="note-content" id="note-text">${noteText}</textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="updateNote()">Hecho</button>
            <button id="closeBtn" onclick="closeEditPopup()">Cancelar</button>
            <button id="delete-btn" onclick="deleteAndClosePopup(${noteId})">Eliminar</button>
        </div>
    </div>
    `;

    document.body.appendChild(editingPopup);
}
function deleteAndClosePopup(noteId) {
    deleteNote(noteId);
    closeEditPopup();
}

function closeEditPopup() {
    const editPopup = document.getElementById('editing-container');
    editPopup.remove(); // Eliminamos el popup de edición
}

function updateNote() {
    const noteText = document.getElementById('note-text').value.trim();
    const editingPopup = document.getElementById('editing-container');

    if (noteText !== '') {
        const noteId = editingPopup.getAttribute('data-note-id');
        let notes = JSON.parse(localStorage.getItem('notes')) || [];

        const updatedNotes = notes.map(note => {
            if (note.id == noteId) {
                return { id: note.id, title: document.getElementById('title-text').value.trim(), text: noteText };
            }
            return note;
        });

        localStorage.setItem('notes', JSON.stringify(updatedNotes));

        editingPopup.remove();

        displayNotes();
    }
}

function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== noteId);

    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

displayNotes();

// Dark mode 

const darkModeBtn = document.getElementById('dark-mode-btn');

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

document.addEventListener('DOMContentLoaded', () => {
  const isDarkMode = localStorage.getItem('darkMode');
  if (isDarkMode === 'true') {
    document.body.classList.add('dark-mode');
  }
});

// Menu despegable

const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const closeBtn = document.getElementById('menu-close-btn');

menuBtn.addEventListener('click', () => {

menu.classList.toggle('menu-open');
});

closeBtn.addEventListener('click', () => {
menu.classList.remove('menu-open');
});

// Configuracion

const configButton = document.getElementById('config-button');

configButton.addEventListener('click', () => {
  window.open('config.html', '_blank');
});

// Busqueda


let searchInput;

document.addEventListener('DOMContentLoaded', function() {
    searchInput = document.getElementById('search-input');
    searchInput.addEventListener('click', () => {;
    const searchInput = document.getElementById('search-input');
    const notesContainer = document.getElementById('notes-list');

    // Agregar evento keydown al elemento input
    searchInput.addEventListener('keydown', (e) => {
      // Verificar si la tecla presionada es la tecla Enter (en PC)
      if (e.key === 'Enter') {
        // Realizar la acción de búsqueda
        search();
      }
      // Verificar si la tecla presionada es la tecla de búsqueda (en dispositivos móviles)
      else if (e.key === 'Search' || e.key === 'Go') {
        // Realizar la acción de búsqueda
        search();
      }
    });

    // Función para realizar la acción de búsqueda
    function search() {
      const searchTerm = searchInput.value.trim();
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const filteredNotes = notes.filter((note) => {
        return note.title.includes(searchTerm) || note.text.includes(searchTerm);
      });

      // Renderizar las notas filtradas en el contenedor
      notesContainer.innerHTML = '';
      filteredNotes.forEach((note) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'filtered-note';
        noteElement.innerHTML = `
          <span class="note-title">${note.title}</span> <br> <span class="note-text">${note.text}</span>
        `;

        noteElement.onclick = function() {
          editNote(note.id);
        }
        notesContainer.appendChild(noteElement);
      });
    }

});

// Mensaje Welcome

const notesContainer = document.getElementById('notes-list');
const notes = JSON.parse(localStorage.getItem('notes')) || [];

if (notes.length === 0) {
  const welcomeMessage = document.createElement('div');
  welcomeMessage.className = 'welcome-message';
  welcomeMessage.innerHTML = `
    <div class="welcome-Message">
        <p>Bienvenido a KNOTES</p>
        <p>Dale click a <i class='bx bxs-message-square-add'></i> para agregar una nota</p>
    </div>
  `;
  notesContainer.appendChild(welcomeMessage);
}


// Función para eliminar el mensaje de bienvenida
function removeWelcomeMessage() {
  const welcomeMessage = document.querySelector('.welcome-message');
  if (welcomeMessage) {
    welcomeMessage.remove();
  }
}

// Función para mostrar el mensaje de bienvenida
function showWelcomeMessage() {
  const welcomeMessage = document.createElement('div');
  welcomeMessage.className = 'welcome-message';
  welcomeMessage.innerHTML = `
    <div class="welcome-Message">
        <p>Bienvenido a KNOTES</p>
        <p>Dale click a <i class='bx bxs-message-square-add'></i> para agregar una nota</p>
    </div>
  `;
  notesContainer.appendChild(welcomeMessage);
} 
});