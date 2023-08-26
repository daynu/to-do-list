import { compareAsc, format, parseISO } from 'date-fns'

import ToDo from "./modules/todo";
import Project from "./modules/project";
import ProjectList from "./modules/projectList";
import TodayTask from './modules/todayTask';


let inboxButton = document.getElementById('inboxButton')
let display = document.getElementById('display')
let projectsSidebar = document.getElementById('projectsSidebar')
let sidebarButtons = document.querySelectorAll('.sidebarButton')
let inbox = new Project('Inbox')
let addProject = document.getElementById('addProject')
let addProjectContainer = document.getElementById('addProjectContainer')
let addProjectOpen = document.getElementById('addProjectOpen')
let cancelAddProject = document.getElementById('cancelAddProject')
let newProjectName = document.getElementById('newProjectName')
let projects = document.querySelectorAll('.projectSidebar')
let projectList = new ProjectList();
projectList.addProject(inbox)
let addTaskOpen = document.getElementById('addTaskOpen')
let addTaskContainer = document.getElementById('addTaskContainer')
let cancelAddTask = document.getElementById('cancelAddTask')
let addTask = document.getElementById('addTask')
let newTaskName = document.getElementById('newTaskName')
let taskContainer;
let checkboxes = document.querySelectorAll('.checkbox')
let dates = document.querySelectorAll('.taskDate')
let projectTitle = document.getElementById('projectTitle')
let todayButton = document.getElementById('todayButton')
let deleteProjectButtons = document.querySelectorAll('.deleteProject')
let upcomingButton = document.getElementById('upcomingButton')


function toggleActive(type)
{   
    type.forEach((button) => 
    {
        button.addEventListener('click', () =>
        {
            type.forEach((button) =>
            {
                button.classList.remove('pressed')
            })
            button.classList.add('pressed')
        })
    })
}

function checkEmptyTask()
{
    if(newTaskName.value) return true
    else return false
}

function renderProjectsSidebar()
{
    projectsSidebar.innerHTML = '';
    for(let i = 1; i < projectList.getList().length; i++)
    {
        projectsSidebar.innerHTML +=`<div id = ${projectList.getList()[i].name} class = projectSidebar>` + projectList.getList()[i].name + '<button class = "deleteProject hidden">X</button>' + '</div>';
        projects = document.querySelectorAll('.projectSidebar')
    }
    deleteProjectButtons = document.querySelectorAll('.deleteProject')
    deleteProjectButtonsToggle()
    deleteProjectButtonsWork()
}


function addTaskButton()
{
    addTask.addEventListener('click', () =>
    {
        if(checkEmptyTask())
        {
            let taskName = newTaskName.value;

            let projectName = document.getElementById('projectTitle').innerText;

            if(checkNewTask(taskName, getProject(projectName)))
            {
                for(let i = 0; i < projectList.getList().length; i++)
                {
                
                    if(projectName == projectList.getList()[i].name)
                    {
                        let newTask = new ToDo(taskName)
                        projectList.getList()[i].tasks.push(newTask)
                        projectList.setStorage()
                        taskContainer = document.getElementById('taskContainer')
                        displayTasks(projectList.getList()[i])
                        deleteTask(projectList.getList()[i])
                        addDateOpen()
                    }
            }
            closeAddTask();
            }

            
        } 


    })
}

function cancelAddTaskButton()
{
    cancelAddTask.addEventListener('click', () =>
    {
        closeAddTask()
    })
}


function displayProject(projectName)
{   
    let project = getProject(projectName)
    console.log('func')
    display.innerHTML = '';
    display.innerHTML += '<h2 id = "projectTitle">' + project.name + "</h2>" + "<div id = 'taskContainer'></div>"
    taskContainer = document.getElementById('taskContainer')
    displayTasks(project)
    display.innerHTML +='<div class="hidden" id = "addTaskContainer">' + 
    addTaskContainer.innerHTML + '</div>' + '<button id = "addTaskOpen">Add task</button><br>';
    addTaskOpen = document.getElementById('addTaskOpen')
    checkboxes = document.querySelectorAll('.checkbox')
    dates = document.querySelectorAll('.taskDate')
    addTaskContainer = document.getElementById('addTaskContainer')
    cancelAddTask = document.getElementById('cancelAddTask')
    addTask = document.getElementById('addTask')
    newTaskName = document.getElementById('newTaskName')
    
    addDateOpen()
    addTaskOpenContainer()
    addTaskButton()
    cancelAddTaskButton()
    deleteTask(project)            
}


function displayTasks(project)
{   
    console.log('display')
    taskContainer.innerHTML = ''
    project.tasks.forEach((task) =>
    {
        taskContainer.innerHTML += '<div class = "taskCell">' + `<div class = "nameAndCheck"><input class = "checkbox" type = "checkbox" id = "${task.name}">
        <p class = "taskName">` + task.name + '</p></div><div class = "taskDateContainer">' + `<p id = "${task.name}Date" class = "taskDate">` + task.date + '</p></div>'
        
    })

    checkboxes = document.querySelectorAll('.checkbox')
    deleteTask(project)
}

function getProject(name)
{
    for(let i = 0; i < projectList.getList().length; i++)
    {
        if(name == projectList.getList()[i].name)
        {
            return projectList.getList()[i];
        }
    }
}

function checkNewProjectName(name)
{
    for(let i = 0; i < projectList.getList().length; i++)
    {
        if(projectList.getList()[i].name == name)
        {
            alert("A project with this name already exists")
            return false
        }
    }
    return true
}

function displayTodayUpcoming(name)
{
    display.innerHTML = '';
    display.innerHTML += "<h2 id = 'projectTitle'>"+name+"</h2><div id = 'taskContainer'></div>"
    taskContainer = document.getElementById('taskContainer')
    let tasks;
    if(name == "Today") tasks = getTodayTasks()
    else tasks = getUpcomingTasks()
    tasks.getTasks().forEach((task) =>
    {
        taskContainer.innerHTML += '<div class = "taskCell">' + `<div class = "nameAndCheck"><input class = "checkbox" type = "checkbox" id = "${task.name}-${task.projectName}">
        <p class = "taskName">` + task.name + `(${task.projectName})` + '</p></div><div class = "taskDateContainer">' + `<p id = "${task.name}Date-${task.projectName}" class = "taskDate">` + task.date + '</p></div>'
    })

    dates = document.querySelectorAll('.taskDate')
    checkboxes = document.querySelectorAll('.checkbox')
    addDateOpen()
    deleteTaskTodayUpcoming(name)

}

function deleteTaskTodayUpcoming(name)
{
    checkboxes.forEach((checkbox) =>
    {
        checkbox.addEventListener('change', () =>
        {
            let taskNameAndProject = checkbox.id
            let taskName = taskNameAndProject.split('-')[0]
            console.log(taskName)
            let taskProjectName = taskNameAndProject.split('-')[1]
            let taskProject = getProject(taskProjectName)
            let newProject = new Project(taskProjectName)
            newProject.setTasks(taskProject.tasks)
            newProject.deleteTask(taskName)
            console.log(newProject)
            replaceProject(newProject)
            displayTodayUpcoming(name)
        })
    })
}

function changeTaskDateTodayUpcoming(name)
{
    let dateInput = document.querySelector('.dateInput')
    dateInput.addEventListener('change', () =>
        {
            let date = new Date(dateInput.value)
            if((date instanceof Date && !isNaN(date.valueOf())))
            {
                console.log(dateInput.id)
                let taskName = dateInput.id.split('-')[0].slice(0, -4)
                console.log(taskName)
                let projectName = dateInput.id.split('-')[1]
                console.log(projectName)
                addDate(getProject(projectName), taskName, dateInput.value)
                displayTodayUpcoming(name)
             }
       
        })
}


function getUpcomingTasks()
{
    let upcoming = new Project('Upcoming')
    projectList.getList().forEach((project) =>
    {
        project.tasks.forEach((task) =>
        {   
            let newTask = new TodayTask(task.name, project.name, task.date)
            upcoming.addTask(newTask)
        })
    })
    upcoming.sortTasks()
    return upcoming

}


function deleteTask(project)
{
    checkboxes.forEach((checkbox) =>
    {
        checkbox.addEventListener('click', () =>
        {   
            let newProject = new Project(project.name)
            newProject.setTasks(project.tasks)
            let taskName = checkbox.id
            newProject.deleteTask(taskName)
            project.tasks = newProject.getTasks()
            replaceProject(project)
            displayProject(project.name)
        })
    })
}


function replaceProject(newProject)
{
    projectList.getList().forEach((project) =>
    {
        if(project.name == newProject.name)
        {
            project.tasks = newProject.tasks
            projectList.setStorage()
            displayTasks(project)
            console.log(project)
        }
    })
    
}

function addNewProject(name)
{
    let newProject
    if(checkNewProjectName(name))
    {
        newProject = new Project(name)
        projectList.addProject(newProject)
        projectList.setStorage()
        projectList.getStorage()
        renderProjectsSidebar()
    }

}

function addDateOpen()
{
    dates = document.querySelectorAll('.taskDate')
    dates.forEach((date) =>
    {
        date.addEventListener('click', () =>
        {
            console.log('dateClick')
            let input = document.createElement('input')
            input.classList.add('dateInput')
            input.id = date.id;
            input.type = 'date'
            date.parentNode.replaceChild(input, date)
            projectTitle = document.getElementById('projectTitle')
            if(projectTitle.innerText == "Today" || projectTitle.innerText == "Upcoming")
            {
                changeTaskDateTodayUpcoming(projectTitle.innerText)
            }
            getDateInput(getProject(projectTitle.innerText))
        })
    }

    )
}


function checkNewTask(taskName, project)
{
    for (let i = 0; i < project.tasks.length; i++)
    {
        if(project.tasks[i].name == taskName)
        {
            alert("A task with this name already exists!")
            return false
        }
    }
    return true
}

function getDateInput(project)
{
    let dateInput = document.querySelector('.dateInput')
    dateInput.addEventListener('change', () =>
    {
        let date = new Date(dateInput.value)
        let taskName = dateInput.id;
        taskName = taskName.slice(0, -4)
        if((date instanceof Date && !isNaN(date.valueOf())))
        {
            addDate(project, taskName, dateInput.value)
            displayProject(project.name)
            console.log(project)
        }

    })
}

function addDate(project, taskName, date)
{
    project.tasks.forEach((task) =>
    {
        if(task.name == taskName)
        {
            task.date = date
            replaceProject(project)
        }
    })
}



function getTodayTasks()
{
    let today = new Date().toJSON().slice(0, 10);
    let todaysTasks = new Project('today')

    for(let i = 0; i < projectList.getList().length; i++)
    {
        let curProject = projectList.getList()[i]
        for(let y = 0; y < curProject.tasks.length; y++)
            if(curProject.tasks[y].date == today)
            {
                let todayTask = new TodayTask(curProject.tasks[y].name, curProject.name, curProject.tasks[y].date)
                todaysTasks.addTask(todayTask)
            }
        }

        return todaysTasks
    }
    


function closeAddTask()
{
    addTaskContainer.classList.add('hidden')
    addTaskOpen.classList.remove('hidden')
}

function addTaskOpenContainer()
{
    addTaskOpen.addEventListener('click', () =>
    {   
        addTaskContainer.classList.remove('hidden')
        addTaskOpen.classList.add('hidden')
    })
}


function deleteProject(projectName)
{
    projectList.getList().forEach((project) =>
    {
        if(project.name == projectName)
        {
            projectList.deleteProject(projectName)
            projectList.setStorage()
            renderProjectsSidebar()
        }
    })
}


if(localStorage.getItem('projects') != null) projectList.getStorage()

if(projectList.getList() != null) renderProjectsSidebar()

displayProject('Inbox')




let toggleable = [...sidebarButtons, ...projects]

toggleActive(toggleable)

changeDisplayedProject()

function deleteProjectButtonsWork()
{
    deleteProjectButtons.forEach((button) =>
    {
        button.addEventListener('click', () =>
        {
            let projectName = button.parentElement.id
            deleteProject(projectName)
            renderProjectsSidebar()
            changeDisplayedProject()
        })
    })
}


function deleteProjectButtonsToggle()
{
        projects.forEach((project) =>
        {
            project.addEventListener('mouseover', () =>
            {
                deleteProjectButtons.forEach((button) =>
                {
                    if(project.contains(button))
                    {
                        button.classList.remove('hidden')
                    }
                    else button.classList.add('hidden')
                })
            })
            project.addEventListener('mouseleave', () =>
            {
                deleteProjectButtons.forEach((button) =>
                {
                    if(project.contains(button))
                    {
                        button.classList.add('hidden')
                    }
                })
            })
    })

}



inboxButton.addEventListener('click', () =>
{
    display.innerText = '';
    displayProject('Inbox')
})

addProjectOpen.addEventListener('click', () =>
{
    addProjectContainer.classList.remove('hidden')
    addProjectOpen.classList.add('hidden')
})

cancelAddProject.addEventListener('click', () =>
{
    addProjectContainer.classList.add('hidden')
    addProjectOpen.classList.remove('hidden')
})


addProject.addEventListener('click', () =>
{
    let newName = newProjectName.value
    addNewProject(newName)
    projectList.getStorage()
    renderProjectsSidebar()
    
})



function changeDisplayedProject()
{
        projects = document.querySelectorAll('.projectSidebar')
        for(let i = 0; i<projects.length; i++)
    {
        projects[i].addEventListener('click', () =>
        {
            let name = projects[i].id
            displayProject(name)
        })

        let toggleable = [...sidebarButtons, ...projects]

        toggleActive(toggleable)
    }
}



todayButton.addEventListener('click', () =>
{
    displayTodayUpcoming("Today")
})

upcomingButton.addEventListener('click', () =>
{
    displayTodayUpcoming("Upcoming")
})
