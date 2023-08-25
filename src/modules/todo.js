export default class ToDo
{
    constructor(name, date = "No due date")
    {
        this.name = name;
        this.date = date;
    }

    setName(name)
    {
        this.name = name
    }


    setDate(date)
    {
        this.date = date
    }

    getName()
    {
        return this.name
    }

    getDate()
    {
        return this.date
    }

    getDateFormatted()
    {
        const day = this.date.split('/')[0]
        const month = this.date.split('/')[1]
        const year = this.date.split('/')[2]
    }
}