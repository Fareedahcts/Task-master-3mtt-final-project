const taskForm = document.getElementById('task-form');
const searchInput = document.getElementById('search-input');
const filterPriority = document.getElementById('filter-priority');
const filterDate = document.getElementById('filter-date');
const taskList = document.getElementById('task-list');

const tasks = []; // Array to store tasks

// Handle task creation
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const deadline = document.getElementById('deadline').value;
  const priority = document.getElementById('priority').value;

  if (title && description && deadline && priority) {
    const task = { title, description, deadline, priority };
    tasks.push(task);
    addTaskToList(task);
    taskForm.reset();
  }
});

// Handle search
searchInput.addEventListener('input', filterTasks);

// Handle filter by priority
filterPriority.addEventListener('change', filterTasks);

// Handle filter by due date
filterDate.addEventListener('input', filterTasks);

// Add a task to the list
function addTaskToList(task) {
  const li = document.createElement('li');

  const detailsDiv = document.createElement('div');
  detailsDiv.classList.add('details');
  detailsDiv.innerHTML = `
    <p><span>Title:</span> ${task.title}</p>
    <p><span>Description:</span> ${task.description}</p>
    <p><span>Deadline:</span> ${task.deadline}</p>
    <p><span>Priority:</span> ${task.priority}</p>
  `;

  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('actions');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.classList.add('edit-btn');
  editBtn.addEventListener('click', () => editTask(li, task));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.addEventListener('click', () => deleteTask(li, task));

  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(detailsDiv);
  li.appendChild(actionsDiv);

  li.dataset.priority = task.priority;
  li.dataset.deadline = task.deadline;

  taskList.appendChild(li);
}

// Edit a task
function editTask(taskItem, task) {
  const newTitle = prompt('Edit title:', task.title);
  const newDescription = prompt('Edit description:', task.description);
  const newDeadline = prompt('Edit deadline (YYYY-MM-DD):', task.deadline);
  const newPriority = prompt('Edit priority (Low, Medium, High):', task.priority);

  if (newTitle && newDescription && newDeadline && newPriority) {
    task.title = newTitle;
    task.description = newDescription;
    task.deadline = newDeadline;
    task.priority = newPriority;

    taskItem.querySelector('.details').innerHTML = `
      <p><span>Title:</span> ${task.title}</p>
      <p><span>Description:</span> ${task.description}</p>
      <p><span>Deadline:</span> ${task.deadline}</p>
      <p><span>Priority:</span> ${task.priority}</p>
    `;

    taskItem.dataset.priority = task.priority;
    taskItem.dataset.deadline = task.deadline;
  }
}

// Delete a task
function deleteTask(taskItem, task) {
  taskItem.remove();
  const index = tasks.indexOf(task);
  if (index > -1) tasks.splice(index, 1);
}

// Filter tasks
function filterTasks() {
  const query = searchInput.value.toLowerCase();
  const selectedPriority = filterPriority.value;
  const selectedDate = filterDate.value;

  const allTasks = document.querySelectorAll('#task-list li');
  allTasks.forEach(taskItem => {
    const matchesSearch = taskItem.textContent.toLowerCase().includes(query);
    const matchesPriority =
      !selectedPriority || taskItem.dataset.priority === selectedPriority;
    const matchesDate =
      !selectedDate || taskItem.dataset.deadline === selectedDate;

    taskItem.style.display =
      matchesSearch && matchesPriority && matchesDate ? '' : 'none';
  });
}
