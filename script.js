// === 1) Datos en memoria ===
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// === 2) Seleccionamos elementos de la interfaz ===
const input = document.querySelector('.barra');
const addBtn = document.querySelector('.boton');
const list = document.querySelector('.lista-tareas');

// === 3) Guardar en localStorage ===
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// === 4) Dibujar todas las tareas ===
function renderTasks() {
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.lastCompletedDate === getToday();

    // Texto de la tarea
    const span = document.createElement('span');
    span.textContent = task.text;
    span.style.margin = '0 10px';

    // Racha
    const streakSpan = document.createElement('span');
    streakSpan.textContent = `🔥 Racha: ${task.streak} días`;
    streakSpan.style.marginLeft = '10px';
    streakSpan.style.fontWeight = 'bold';

    // Botón borrar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.style.marginLeft = '10px';

    // Evento para marcar/desmarcar y actualizar racha
    checkbox.addEventListener('change', () => {
      toggleComplete(index);

      // Animación al completar
      if (checkbox.checked) {
        showCompletionAnimation('🔥');
      }

      renderTasks();
    });

    // Evento borrar
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(streakSpan);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

// === 5) Función para obtener fecha actual ===
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

// === 6) Actualizar racha ===
function toggleComplete(index) {
  const today = getToday();
  let task = tasks[index];

  if (task.lastCompletedDate === today) {
    task.lastCompletedDate = null;
    task.streak = Math.max(0, task.streak - 1);
  } else {
    if (task.lastCompletedDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterStr = yesterday.toISOString().slice(0, 10);

      if (task.lastCompletedDate === yesterStr) {
        task.streak += 1;
      } else {
        task.streak = 1;
      }
    } else {
      task.streak = 1;
    }
    task.lastCompletedDate = today;
  }

  saveTasks();
}

// === 7) Agregar nueva tarea ===
function addTask() {
  const text = input.value.trim();
  if (text === '') return;

  tasks.push({
    text: text,
    streak: 0,
    lastCompletedDate: null
  });

  saveTasks();
  renderTasks();
  input.value = '';
  input.focus();
}

// === 8) Animación al completar ===
function showCompletionAnimation(emoji) {
  const anim = document.createElement('div');
  anim.textContent = emoji;
  anim.className = 'completion-animation';

  anim.style.left = `${window.innerWidth / 2}px`;
  anim.style.top = `${window.innerHeight / 2}px`;

  document.body.appendChild(anim);

  setTimeout(() => {
    anim.remove();
  }, 1000);
}

// === 9) Eventos ===
addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// === 10) Cargar tareas al iniciar ===
renderTasks();

// Pomodoro Timer
let pomodoroTime = 25 * 60; // 25 minutos en segundos
let timerInterval = null;
let isRunning = false;
let isWorkSession = true; // true = trabajo, false = descanso

const timerDisplay = document.getElementById('timer');
const startPauseBtn = document.getElementById('start-pause');
const resetBtn = document.getElementById('reset');

// Mostrar tiempo en formato MM:SS
function updateTimerDisplay() {
  let minutes = Math.floor(pomodoroTime / 60);
  let seconds = pomodoroTime % 60;
  timerDisplay.textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Iniciar o pausar
function startPauseTimer() {
  if (!isRunning) {
    timerInterval = setInterval(() => {
      if (pomodoroTime > 0) {
        pomodoroTime--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        isRunning = false;

        if (isWorkSession) {
          alert('🍅 ¡Tiempo de descanso! 5 minutos.');
          startBreak();
        } else {
          alert('✅ Descanso terminado. ¡De vuelta al trabajo!');
          startWork();
        }
      }
    }, 1000);
    startPauseBtn.textContent = '⏸ Pausar';
    isRunning = true;
  } else {
    clearInterval(timerInterval);
    startPauseBtn.textContent = '▶️ Iniciar';
    isRunning = false;
  }
}

// Reiniciar
function resetTimer() {
  clearInterval(timerInterval);
  isWorkSession = true;
  pomodoroTime = 25 * 60;
  document.body.style.backgroundColor = ''; // restaurar color
  updateTimerDisplay();
  startPauseBtn.textContent = '▶️ Iniciar';
  isRunning = false;
}

// Empezar descanso
function startBreak() {
  isWorkSession = false;
  pomodoroTime = 5 * 60; // 5 minutos de descanso
  document.body.style.backgroundColor = '#d4f4dd'; // verde claro
  updateTimerDisplay();
  startPauseTimer(); // empieza automáticamente
}

// Empezar trabajo
function startWork() {
  isWorkSession = true;
  pomodoroTime = 25 * 60;
  document.body.style.backgroundColor = ''; // fondo normal
  updateTimerDisplay();
  startPauseTimer(); // empieza automáticamente
}

// Eventos
startPauseBtn.addEventListener('click', startPauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Inicial
updateTimerDisplay();
play();



