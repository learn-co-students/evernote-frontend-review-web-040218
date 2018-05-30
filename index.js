document.addEventListener('DOMContentLoaded',function(event) {
    let notes
    const appContainer = document.getElementById('app-container')
    const sidebar = document.getElementById('sidebar')
    const noteDetails = document.getElementById('note-details')
    function fetchNotes() {
        fetch('http://localhost:3000/api/v1/notes').then(r=>r.json()).then( notesObj => {
            console.log(notes)
            notes = notesObj
            console.log(notes)
            generateSidebar()
        } )
    }

    function generateSidebar() {
        sidebar.innerHTML = ''
        sidebar.innerHTML += `<button data-action='create-note'>Create a new note</button>`
        notes.forEach( note => {
            const noteHTML = `
                <div id='note-id-${note.id}'>
                    <h3 data-note-id='${note.id}' id='note-id-header-${note.id}'>${note.title}</h3>
                </div>
            `
            sidebar.innerHTML += noteHTML
        } )
    }

    function displayNoteAfterClick(noteId) {
        const note = notes.find( note => note.id == noteId )
            const noteHTML = `
            <div id='note-id-${note.id}'>
                <h3 data-note-id='${note.id}' id='note-id-header-${note.id}'>${note.title}</h3>
                <p>${note.body}</p>
                <button data-action='edit' data-note-id='${note.id}'>Edit note</button>
                <button data-action='delete' data-note-id='${note.id}'>Delete note</button>
            </div>
            `
            noteDetails.innerHTML = noteHTML
    }

    function createNewNoteForm() {
            const noteFormHTML = `
                <form data-action='create-note'>
                    Title:<br><input id='note-title-input' type='text' value=''><br>
                    Body:<br><textarea id='note-body-input' rows="10" cols="50"></textarea><br>
                    <button type='submit'>Create note</button>
                </form>
            `
            noteDetails.innerHTML = noteFormHTML
    }

    function displayNoteUpdateFormAfterClick(noteId) {
        const note = notes.find( note => note.id == noteId )
            const noteFormHTML = `
                <form data-action='update-note' data-note-id='${note.id}'>
                    Title:<br><input id='note-title-input' type='text' value='${note.title}'><br>
                    Body:<br><textarea id='note-body-input' rows="10" cols="50">${note.body}</textarea><br>
                    <button type='submit'>Update note</button>
                </form>
            `
            noteDetails.innerHTML = noteFormHTML
    }

    appContainer.addEventListener('click',function(event) {
        if (event.target.dataset.noteId) {
            displayNoteAfterClick(event.target.dataset.noteId)
            //displayNoteAfterClick(event)
        }

        if (event.target.dataset.action === 'edit') {
            displayNoteUpdateFormAfterClick(event.target.dataset.noteId)
        }

        if (event.target.dataset.action === 'delete') {
            deleteNote(event.target.dataset.noteId)
        }

        if (event.target.dataset.action === 'create-note') {
            createNewNoteForm()
        }
    })

    function deleteNote(id) {

        notes = notes.filter( note => note.id != id)
        generateSidebar()
        noteDetails.innerHTML = ''
        deleteNoteOnServer(id)

    }

    function deleteNoteOnServer(id) {
        fetch(`http://localhost:3000/api/v1/notes/${id}`,{method:'DELETE'})
    }

    appContainer.addEventListener('submit',function(event) {
        if (event.target.dataset.action === 'update-note') {
            noteObj = notes.find( note => note.id == event.target.dataset.noteId)
            var title = document.getElementById('note-title-input').value
            var body = document.getElementById('note-body-input').value
            noteObj.title = title
            noteObj.body = body
            displayNoteAfterClick(noteObj.id)
            generateSidebar()
            updateNoteOnServer(noteObj.id,title,body)
        }

        if (event.target.dataset.action === 'create-note') {
            event.preventDefault()
            var title = document.getElementById('note-title-input').value
            var body = document.getElementById('note-body-input').value
            createNoteOnServer(title,body)
        }
    })

    function createNoteOnServer(title,body) {
        const config = {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                title:title,
                body:body,
                user_id:1
            })
        }
        const url = `http://localhost:3000/api/v1/notes/`
        fetch(url,config).then( r=>r.json()).then( noteObj => {
            notes.push(noteObj)
            generateSidebar()
            displayNoteAfterClick(noteObj.id)
        } )
    }

    function updateNoteOnServer(id,title,body) {
        const config = {
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                title:title,
                body:body,
                user_id:1
            })
        }
        const url = `http://localhost:3000/api/v1/notes/${id}`
        fetch(url,config)
    }

    fetchNotes()
})