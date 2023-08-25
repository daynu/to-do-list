
export default class Project
{
    constructor(name)
    {
        this.name = name;
        this.tasks = [];
    }

    addTask(task)
    {
        this.tasks.push(task)
    }

    deleteTask(taskName)
    {
        for(let i = 0; i < this.tasks.length; i++)
        {
            if(taskName == this.tasks[i].name)
            {
                let firstHalf = this.tasks.slice(0, i)
                let secondHalf = this.tasks.slice(i+1)
                let newTasks = firstHalf.concat(secondHalf)
                this.tasks = newTasks
            }
        }
    }

    getTasks()
    {
        return this.tasks
    }

    setTasks(tasks)
    {
        this.tasks = tasks
    }

    getName()
    {
        return this.name
    }

    setName(name)
    {
        this.name = name;
    }
}