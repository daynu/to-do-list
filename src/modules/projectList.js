export default class ProjectList
{
    constructor()
    {
        this.list = []
    }

    addProject(project)
    {
        this.list.push(project)
    }

    deleteProject(projectName)
    {
        for(let i = 0; i < this.list.length; i++)
        {
            if(projectName == this.getList()[i].name)
            {
                let firstHalf = this.getList().slice(0, i)
                let secondHalf = this.getList().slice(i+1)
                let newList = firstHalf.concat(secondHalf)
                this.list = newList
            }
        }
    }

    getList()
    {
        return this.list
    }

    setList(list)
    {
        this.list = list
    }

    getStorage()
    {
        this.setList(JSON.parse(localStorage.getItem('projects')))
    }

    setStorage()
    {
        localStorage.setItem('projects', JSON.stringify(this.list))
    }
}