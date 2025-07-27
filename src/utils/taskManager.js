class TaskManager {
  createTaskFromText(text, dueDate = null) {
    return {
      id: Date.now(),
      text: text,
      completed: false,
      due: dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
  }

  addTaskToWindow(windowId, task) {
    const savedWindows = localStorage.getItem('smartchat_windows');
    let windows = savedWindows ? JSON.parse(savedWindows) : [];
    
    const tasksWindow = windows.find(w => w.id === 'tasks');
    if (tasksWindow) {
      if (!tasksWindow.tasks) tasksWindow.tasks = [];
      tasksWindow.tasks.push(task);
      localStorage.setItem('smartchat_windows', JSON.stringify(windows));
      return true;
    }
    
    return false;
  }
}

export default new TaskManager();