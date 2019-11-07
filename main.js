// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
let caloriesList = document.querySelector('#calories-list')
caloriesList.innerHTML = ''

let calorieForm = document.querySelector('#new-calorie-form')

let progressBar = document.createElement('h3')
progressBar.id = 'progress-bar'
progressBar.innerText = `${progressBar.value} Total Calories`
progressBar.value = 0
console.log(progressBar.value)
calorieForm.parentNode.prepend(progressBar)

loadPage()

calorieForm.addEventListener('submit', evt => {
    evt.preventDefault()
    let calories = evt.target["calorie-input"].value
    let desc = evt.target["calorie-description"].value
    
    if (calories === "" || desc === ""){return}

    fetch('http://localhost:3000/api/v1/calorie_entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            api_v1_calorie_entry: {
            calorie: parseFloat(calories),
            note: desc
            }
        })
    })
    .then(resp => {resp.json()})
    .then(respJSON => {
        loadPage()
    })
})

function loadPage(){
    caloriesList.innerHTML = ''
    progressBar.value = 0
    return fetch('http://localhost:3000/api/v1/calorie_entries')
        .then(resp => resp.json())
        .then(respJSON => {
            respJSON.forEach(loadCalories)
        })
}


function loadCalories(obj){
    let listItem = document.createElement('li')
    listItem.className = 'calories-list-item'

    let grid = document.createElement('div')
    grid.className = 'uk-grid'

    let width_16 = document.createElement('div')
    width_16.className = 'uk-width-1-6'

    let strong = document.createElement('strong')
    strong.innerText = obj.calorie

    let span = document.createElement('span')
    span.innerText = 'kcal'

    width_16.append(strong, span)

    let width_45 = document.createElement('div')
    width_45.className = 'uk-width-4-5'

    let em = document.createElement('em')
    em.className = 'uk-text-meta'
    em.innerText = obj.note

    width_45.append(em)

    grid.append(width_16, width_45)

    let menu = document.createElement('div')
    menu.className = 'list-item-menu'
    menu.innerHTML = `<a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a><a class="delete-button" uk-icon="icon: trash"></a>`
    // let editBtn = document.createElement('a')
    // editBtn.innerHTML = `<a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a>`
//problem assigning attributes.......
    // let deleteBtn = document.createElement('a')
        // deleteBtn.className = 'delete-button'
        // deleteBtn['uk-icon'] = 'icon: trash'
    // deleteBtn.innerHTML = `<a class="delete-button" uk-icon="icon: trash"></a>`
    // deleteBtn.addEventListener('click', evt => {
    //     fetch(`http://localhost:3000/api/v1/calorie_entries/${obj.id}`, {
    //         method: 'DELETE'
    //     })
    //     .then(resp => resp.json())
    //     .then(respJSON => {
    //         loadPage()
    //     })
    // })

    // menu.append(editBtn, deleteBtn)

    listItem.append(grid, menu)

    caloriesList.prepend(listItem)

    progressBar.value += obj.calorie
    progressBar.innerText = `${progressBar.value} Total Calories`
}