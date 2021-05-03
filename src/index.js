const mainTable = document.querySelector("body > div > div:nth-child(3) > table")
const editForm = document.querySelector("#dog-form")

function runFetchAgain(){
    fetch('http://localhost:3000/dogs')
    .then(res => res.json())
    .then(dogArr => {
        dogArr.forEach(dogObj => dispOneDog(dogObj))
    })
}
    function dispOneDog(dogObj){
        const detRow = document.createElement('tr') 
            detRow.classList.add('individual-row')    
            detRow.innerHTML = `
            <tr><td>${dogObj.name}</td> <td>${dogObj.breed}</td> <td>${dogObj.sex}</td> <td><button data-id="${dogObj.id}">Edit</button></td></tr>`

            detRow.dataset.id = dogObj.id
            mainTable.append(detRow);
    }
    mainTable.addEventListener('click', evt => {
        if(evt.target.matches('button')){
            fetch(`http://localhost:3000/dogs/${evt.target.dataset.id}`)
                .then(res => res.json())
                .then(dogObj => {
                    editForm.dataset.id = dogObj.id
                    editForm.name.value = dogObj.name
                    editForm.breed.value = dogObj.breed
                    editForm.sex.value = dogObj.sex
                });
        };
    });

editForm.addEventListener('submit', evt => {
    evt.preventDefault();

    let name =  editForm.name.value
    let breed = editForm.breed.value
    let sex =  editForm.sex.value
    fetch(`http://localhost:3000/dogs/${evt.target.dataset.id}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({name, breed, sex})
    })
    .then(res => res.json())
    .then(() => {
        let rowsToBeChanged = document.querySelectorAll('tr.individual-row')
            rowsToBeChanged.forEach(rowObj => {
                rowObj.innerHTML = "";
            })
        runFetchAgain();
    })
})
runFetchAgain();
