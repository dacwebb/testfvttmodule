class ToDoList{
    /**
    * A single ToDo in our list of Todos.
    * @typedef {Object} ToDo
    * @property {string} id - A unique ID to identify this todo.
    * @property {string} label - The text of the todo.
    * @property {boolean} isDone - Marks whether the todo is done.
    * @property {string} userId - The user who owns this todo.
    */
       static ID = 'todo-list';
   
       static FLAGS = {
           TODOS: 'todos'
       }
       static TEMPLATES = {
           TODOLIST: `modules/${this.ID}/templates/todo-list.hbs`
       }
   }
Hooks.on('renderPlayerList', (playerList, html) => {
    // find the element which has our logged in user's id
  const loggedInUserListItem = html.find(`[data-user-id="${game.userId}"]`)
  
  // insert a button at the end of this element
  loggedInUserListItem.append(
    "<button type='button' class='todo-list-icon-button'><i class='fas fa-tasks'></i></button>"
  );
});
class ToDoListData {
    // all todos for all users
    static get allToDos() {
        const allToDos = game.users.reduce((accumulator, user) => {
            const userTodos = this.getToDosForUser(user.id);
        
                return {
                    ...accumulator,
                    ...userTodos
                }
            }, {});
        
            return allToDos;
    }
  
    // get all todos for a given user
    static getToDosForUser(userId) {
        return game.users.get(userId)?.getFlag(ToDoList.ID, ToDoList.FLAGS.TODOS);
    }
  
    // create a new todo for a given user
    static createToDo(userId, toDoData) {
        //generate random ID for new ToDo
        const newToDo = {
            isDone: false,
            ...toDoData,
            id: foundry.utils.randomID(16),
            userId
        }
        // construct update to insert new ToDos
        const newToDos = {
            [newToDo.id]: newToDo
        }
        // update the database with the new ToDos
        return game.users.get(userId)?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, newToDos);
    }
  
    // update a specific todo by id with the provided updateData
    static updateToDo(toDoId, updateData) {
        const relevantToDo = this.allToDos[toDoId];
        // construct the update to send
        const update = {
            [toDoId]: updateData
        }
    
        // update the database with the updated ToDo list
        return game.users.get(relevantToDo.userId)?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, update);
    }
    // update one or many ToDos for a user
    static updateUserToDos(userId, updateData) {
        return game.users.get(userId)?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, updateData);
    }
    /* usage:
    *ToDoListData.updateUserToDos('acfkPFqSPy01uJ3p', {
    *"gogdv4qvgydcr7sh": { isDone: true },
    *"yndgcuoq147g37nz": { isDone: true },
    *});
    */
    
    // delete a specific todo by id
    static deleteToDo(toDoId) {
        const relevantToDo = this.allToDos[toDoId];

        // Foundry specific syntax required to delete a key from a persisted object in the database
        const keyDeletion = {
        [`-=${toDoId}`]: null
        }

        // update the database with the updated ToDo list
        return game.users.get(relevantToDo.userId)?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, keyDeletion);
    }
}
Hooks.once('init', async function() {
    console.log('testfvttmodule | Hello World of FVTT (v3)!');

});

Hooks.once('ready', async function() {
    console.log(`testfvttmodule | Mod is ready!`);
});
