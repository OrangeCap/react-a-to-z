export default function taskReducers(tasks, action) {
  switch (action.type) {
    case "add": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case "remove": {
      return tasks.filter((task) => task.id !== action.id);
    }
    case "edit": {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case "default": {
      throw Error("Unknown action: " + action.type);
    }
  }
}
