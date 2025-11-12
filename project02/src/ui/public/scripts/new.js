function handleDeleteOption() {
    if (this.parentElement.parentElement.querySelectorAll('.option').length - 1 < LIMIT) {
        addOptionButton.style.display = 'block';
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
    if (index === LIMIT-1) {addOptionButton.style.display = 'none';}


}

const LIMIT = 20;
const addOptionButton = document.querySelector('#addOptionButton');
const optionsWithoutFirst = document.querySelectorAll('.option:not(:first-child) .drop');
optionsWithoutFirst.forEach((el) => {
  el.addEventListener('click', handleDeleteOption);
});
addOptionButton.addEventListener('click', handleAddOption);