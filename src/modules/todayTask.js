export default class TodayTask
{
    constructor(name, projectName, date = "No due date")
    {
        this.name = name
        this.projectName = projectName
        this.date = date
    }

}