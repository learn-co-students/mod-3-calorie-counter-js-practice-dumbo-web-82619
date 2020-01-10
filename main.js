// defer declared in js script in index.html head

const caloriesUl = document.querySelector('#calories-list')
const newEntryForm = document.querySelector('#new-calorie-form')
const progressBar = document.querySelector('progress')

getEntries()

function getEntries() {
  fetch('http://localhost:3000/api/v1/calorie_entries')
  .then(response => response.json())
  .then(entriesArray => {
    caloriesUl.innerHTML = ''
    entriesArray.forEach(entry => {
      addEntryLiToEntriesUl(entry)
    }) 
  })
}

function setProgressBar() {
  fetch('http://localhost:3000/api/v1/calorie_entries')
  .then(response => response.json())
  .then(entriesArray => {
    let calArr = entriesArray.map(entry => entry.calorie)
    let progress = calArr.reduce((total, cal) => total += cal)
    progressBar.value = progress
  })
}

function addEntryLiToEntriesUl(entry) {
  let newLi = document.createElement('li')
  let contentDiv = document.createElement('div')
  let buttonDiv = document.createElement('div')
  let calorieDiv = document.createElement('div')
  let noteDiv = document.createElement('div')
  let strongTag = document.createElement('strong')
  let spanTag = document.createElement('span')
  let emTag = document.createElement('em')
  let editBtn = document.createElement('a')
  let deleteBtn = document.createElement('a')

  newLi.className = 'calories-list-item'
  contentDiv.className = 'uk-grid'
  calorieDiv.className = 'uk-width-1-6'  
  strongTag.innerText = entry.calorie
  spanTag.innerText = 'kcal'
  noteDiv.className = 'uk-width-4-5'
  emTag.className = 'uk-text-meta'
  emTag.innerText = entry.note
  buttonDiv.className = 'list-item-menu'
  editBtn.className = 'edit-button'
  editBtn.setAttribute('uk-icon', 'icon: pencil')
  editBtn.setAttribute('uk-toggle', 'target: #edit-form-container')
  deleteBtn.className = 'delete-button'
  deleteBtn.setAttribute('uk-icon', 'icon: trash')

  deleteBtn.addEventListener('click', event => {
    let note = event.target.parentElement.parentElement.parentElement.querySelector('em')
    console.log(note)
  })

  calorieDiv.append(strongTag, spanTag)
  noteDiv.append(emTag)
  contentDiv.append(calorieDiv, noteDiv)
  buttonDiv.append(editBtn, deleteBtn)
  newLi.append(contentDiv, buttonDiv)
  caloriesUl.prepend(newLi)
  setProgressBar()

  // newLi.innerHTML = 
    // `<div class="uk-grid">
      // <div class="uk-width-1-6">
        // <strong>${entry.calorie}</strong>
        // <span>kcal</span>
      // </div>
      // <div class="uk-width-4-5">
        // <em class="uk-text-meta">${entry.note}</em>
      // </div>
    // </div>
    // <div class="list-item-menu">
      // <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
      // <a class="delete-button" uk-icon="icon: trash"></a>
    // </div>`
}

newEntryForm.addEventListener('submit', (event) => {
  event.preventDefault()

  let calCount = event.target['new-calorie-count'].value
  let calNote = event.target['new-calorie-note'].value

  fetch('http://localhost:3000/api/v1/calorie_entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      calorie: calCount,
      note: calNote
    })
  })
  .then(response => response.json())
  .then(newEntry => {
    console.log(newEntry)
    addEntryLiToEntriesUl(newEntry)
  })
})
