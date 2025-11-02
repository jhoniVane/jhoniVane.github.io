const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const searchInput = document.createElement('input');
const main = document.querySelector('main');

// Modal de confirmación
const modalHtml = `
    <div id="delete-modal" class="modal">
        <div class="modal-content">
            <p>¿Estás seguro de que deseas eliminar esta tarea?</p>
            <div class="modal-actions">
                <button id="modal-confirm-delete" class="action-btn delete">Eliminar</button>
                <button id="modal-cancel-delete" class="action-btn">Cancelar</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHtml);

const deleteModal = document.getElementById('delete-modal');
const modalConfirmBtn = document.getElementById('modal-confirm-delete');
const modalCancelBtn = document.getElementById('modal-cancel-delete');

let todoToDeleteIndex = -1; 
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = ''; 

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Inicialización del campo de búsqueda
searchInput.type = 'text';
searchInput.id = 'search-input';
searchInput.placeholder = 'Buscar tarea...';
searchInput.autocomplete = 'off';
searchInput.className = 'hidden'; 

if (main.querySelector('#todo-form')) {
    main.querySelector('#todo-form').insertAdjacentElement('afterend', searchInput);
}


function renderTodos() {
    // Mostrar/Ocultar el campo de búsqueda
    if (todos.length > 10) {
        searchInput.classList.remove('hidden');
    } else {
        searchInput.classList.add('hidden');
        currentFilter = '';
        searchInput.value = '';
    }

    todoList.innerHTML = '';
    const filteredTodos = todos.filter(todo => 
        todo.text.toLowerCase().includes(currentFilter.toLowerCase())
    );

    filteredTodos.forEach((todo, idx) => {
        // Encontrar el índice original para las operaciones 
        const originalIndex = todos.findIndex(t => t === todo); 

        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        input.className = 'todo-text';
        input.setAttribute('readonly', true);

        li.appendChild(input);

        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        // Edit/Save button
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Editar';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'action-btn save';
        saveBtn.innerHTML = '💾';
        saveBtn.title = 'Guardar';
        saveBtn.style.display = 'none';

        // Complete button
        const completeBtn = document.createElement('button');
        completeBtn.className = 'action-btn complete';
        completeBtn.innerHTML = '✔️';
        completeBtn.title = todo.completed ? 'Desmarcar' : 'Completar';

        // Delete button
        const deleteBtn = document.createElement('button');
        // Agregar clase 'disabled-delete' si no está completada
        deleteBtn.className = 'action-btn delete' + (!todo.completed ? ' disabled-delete' : '');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = !todo.completed ? 'Completa la tarea para eliminar' : 'Eliminar';

        // Edit functionality
        editBtn.onclick = () => {
            input.removeAttribute('readonly');
            input.focus();
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
        };

        // Save functionality
        saveBtn.onclick = () => {
            input.setAttribute('readonly', true);
            todos[originalIndex].text = input.value.trim();
            saveTodos();
            renderTodos();
        };

        // Complete functionality
        completeBtn.onclick = () => {
            todos[originalIndex].completed = !todos[originalIndex].completed;
            saveTodos();
            renderTodos();
        };

        // Delete functionality (Abre el modal)
        deleteBtn.onclick = () => {
            if (!todos[originalIndex].completed) {
                return; 
            }
            todoToDeleteIndex = originalIndex; 
            deleteModal.style.display = 'block';
        };

        actions.appendChild(editBtn);
        actions.appendChild(saveBtn);
        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(actions);
        todoList.appendChild(li);
    });
}

// Lógica de Agregar Tarea
todoForm.onsubmit = (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
};

// Lógica del Modal de Eliminación
modalConfirmBtn.onclick = () => {
    if (todoToDeleteIndex !== -1) {
        todos.splice(todoToDeleteIndex, 1);
        saveTodos();
        renderTodos();
        todoToDeleteIndex = -1;
        deleteModal.style.display = 'none';
    }
};

modalCancelBtn.onclick = () => {
    deleteModal.style.display = 'none';
    todoToDeleteIndex = -1;
};

// Cerrar modal al hacer clic fuera de él
window.onclick = (event) => {
    if (event.target === deleteModal) {
        deleteModal.style.display = 'none';
        todoToDeleteIndex = -1;
    }
};

// Lógica del Filtro de Búsqueda
searchInput.oninput = (e) => {
    currentFilter = e.target.value.trim();
    renderTodos();
};

renderTodos();


const body = document.body;
const lightBtn = document.getElementById('light-mode');
const darkBtn = document.getElementById('dark-mode');
const neonBtn = document.getElementById('neon-mode');
// botón de Spiderman
const spidermanBtn = document.createElement('button');
spidermanBtn.id = 'spiderman-mode';
spidermanBtn.title = 'Modo Spiderman';
spidermanBtn.innerHTML = '🕷️';
document.querySelector('.mode-switcher').appendChild(spidermanBtn);


function setMode(mode) {
    body.classList.remove('dark-mode', 'neon-mode', 'spiderman-mode');
    if (mode === 'dark') body.classList.add('dark-mode');
    if (mode === 'neon') body.classList.add('neon-mode');
    if (mode === 'spiderman') body.classList.add('spiderman-mode');
    localStorage.setItem('color-mode', mode);
}

// Eventos de los botones 
if (lightBtn && darkBtn && neonBtn && spidermanBtn) {
    lightBtn.onclick = () => setMode('light');
    darkBtn.onclick = () => setMode('dark');
    neonBtn.onclick = () => setMode('neon');
    spidermanBtn.onclick = () => setMode('spiderman');
}

// Al cargar, aplicar el modo guardado
const savedMode = localStorage.getItem('color-mode');
if (savedMode === 'dark' || savedMode === 'neon' || savedMode === 'spiderman') {
    setMode(savedMode);
}