const taskForm = document.getElementById('task-form');
const searchInput = document.getElementById('search-input');
const filterPriority = document.getElementById('filter-priority');
const filterDate = document.getElementById('filter-date');
const taskList = document.getElementById('task-list');

const tasks = []; // Array to store tasks

async function fetchTasksFromAPI() {
  try {
    const response = await fetch('https://api.example.com/tasks');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const tasks = await response.json();
    tasks.forEach(task => addTaskToList(task));
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

async function saveTaskToAPI(task) {
  try {
  
    const response = await fetch('https://api.example.com/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to save task');
    }
    const savedTask = await response.json();
    tasks.push(savedTask); // Add the saved task to the tasks array
    addTaskToList(savedTask); // Add the task to the list on the page
  } catch (error) {
    console.error('Error saving task:', error);
  }
}


async function updateTaskInAPI(task) {
  try {
    const response = await fetch(`https://api.example.com/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    const updatedTask = await response.json();
    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

async function deleteTaskFromAPI(task) {
  try {
    const response = await fetch(`https://api.example.com/tasks/${task.id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', fetchTasksFromAPI);

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const deadline = document.getElementById('deadline').value;
  const priority = document.getElementById('priority').value;

  if (title && description && deadline && priority) {
    const task = { title, description, deadline, priority };
    await saveTaskToAPI(task); // Save the task asynchronously
    taskForm.reset(); // Reset the form after adding the task
  }
});

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
async function editTask(taskItem, task) {
  const newTitle = prompt('Edit title:', task.title);
  const newDescription = prompt('Edit description:', task.description);
  const newDeadline = prompt('Edit deadline (YYYY-MM-DD):', task.deadline);
  const newPriority = prompt('Edit priority (Low, Medium, High):', task.priority);

  if (newTitle && newDescription && newDeadline && newPriority) {
    task.title = newTitle;
    task.description = newDescription;
    task.deadline = newDeadline;
    task.priority = newPriority;

    // Update task in the API
    const updatedTask = await updateTaskInAPI(task);

    // Update the task in the DOM
    taskItem.querySelector('.details').innerHTML = `
      <p><span>Title:</span> ${updatedTask.title}</p>
      <p><span>Description:</span> ${updatedTask.description}</p>
      <p><span>Deadline:</span> ${updatedTask.deadline}</p>
      <p><span>Priority:</span> ${updatedTask.priority}</p>
    `;
    taskItem.dataset.priority = updatedTask.priority;
    taskItem.dataset.deadline = updatedTask.deadline;
  }
}

// Delete a task
async function deleteTask(taskItem, task) {
  const success = await deleteTaskFromAPI(task);
  if (success) {
    taskItem.remove();
    const index = tasks.indexOf(task);
    if (index > -1) tasks.splice(index, 1); // Remove the task from the tasks array
  }
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
