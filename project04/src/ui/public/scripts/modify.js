function handleDeleteOption() {
    if (this.parentElement.parentElement.querySelectorAll('.option').length < LIMIT) {
        addOptionButton.style.display = 'contents';
    } 
    this.parentElement.remove();
}

function handleAddOption() {

    const index = document.querySelectorAll('.option').length;

    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option');

    const input = document.createElement('input');
    input.name = 'option[]';
    input.placeholder = 'Nowa opcja';
    input.minLength = 1;
    input.maxLength = 100;
    input.title = 'Maksymalna długość opcji to 100 znaków';
    input.required = true;

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('drop');
    button.addEventListener('click', handleDeleteOption);

    const img = document.createElement('img');
    img.src = '/images/icons/delete.svg';
    img.alt = 'Usuń opcję';
    img.title = 'Usuń opcję';

    button.appendChild(img);
    optionDiv.appendChild(input);
    optionDiv.appendChild(button);

    
    const container = this.parentElement;
    container.insertBefore(optionDiv, addOptionButton);
    if (index === LIMIT) {addOptionButton.style.display = 'none';}


}

const LIMIT = 20;
const addOptionButton = document.querySelector('#addOptionButton');
addOptionButton.addEventListener('click', handleAddOption);
document.querySelectorAll('.option .drop').forEach((node) => {node.addEventListener('click', handleDeleteOption);});