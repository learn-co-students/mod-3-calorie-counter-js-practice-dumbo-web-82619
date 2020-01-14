// defer declared in js script in index.html head

const caloriesUl = document.querySelector('#calories-list')
const newEntryForm = document.querySelector('#new-calorie-form')
const progressBar = document.querySelector('progress')
const lowBMR = document.querySelector('#lower-bmr-range')
const highBMR = document.querySelector('#higher-bmr-range')
const BMRForm = document.querySelector('#bmr-calulator')
const editCal = document.querySelector('#edit-calorie-count')
const editNote = document.querySelector('#edit-calorie-note')
const editEntryForm = document.querySelector('#edit-calorie-form')
let editEntry = {}

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
  
  newLi.className = 'calories-list-item' 
  newLi.innerHTML = 
  `<div class="uk-grid">
    <div class="uk-width-1-6">
      <strong>${entry.calorie}</strong>
      <span>kcal</span>
    </div>
    <div class="uk-width-4-5">
      <em class="uk-text-meta">${entry.note}</em>
    </div>
  </div>
  <div class="list-item-menu">
    <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
    <a class="delete-button" uk-icon="icon: trash"></a>
  </div>`

  newLi.addEventListener('click', event => {
    if (event.target.parentElement.className === 'delete-button uk-icon') {
      fetch(`http://localhost:3000/api/v1/calorie_entries/${entry.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then(message => {
        console.log(message)
        getEntries()
        setProgressBar()
      })
    } else if (event.target.parentElement.className === 'edit-button uk-icon') {
      editCal.value = entry.calorie
      editNote.value = entry.note
      editEntry = entry
    }
  })

  caloriesUl.prepend(newLi)
  setProgressBar()
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
    addEntryLiToEntriesUl(newEntry)
    newEntryForm.reset()
  })
})


editEntryForm.addEventListener('submit', (event) => {
  event.preventDefault()

  let calCount = event.target['edit-calorie-count'].value
  let calNote = event.target['edit-calorie-note'].value

  fetch(`http://localhost:3000/api/v1/calorie_entries/${editEntry.id}`, {
    method: 'PATCH',
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
    getEntries()
    setProgressBar()
  })

})


BMRForm.addEventListener('submit', (event) => {
  event.preventDefault()

  let weight = parseInt(event.target.querySelector('#weight').value, 10)
  let height = parseInt(event.target.querySelector('#height').value, 10)
  let age = parseInt(event.target.querySelector('#age').value, 10)

  let low = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age)
  let high = 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age)

  lowBMR.innerText = Math.round(low)
  highBMR.innerText = Math.round(high)
  progressBar.max = (low + high) / 2
})
