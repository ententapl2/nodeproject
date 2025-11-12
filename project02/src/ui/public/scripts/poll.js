async function handlePollDelete() {
    const confirmed = confirm('Czy na pewno chcesz usunąć ankietę? Tej operacji NIE można COFNĄĆ')
    if (confirmed) {
        const request = await fetch(window.location.href, {method:'DELETE'});
        if (request.ok) {
            window.location.replace('/')
        } else {
            alert('Nie udało się usunąć ankiety');
        }
    }
}

document.querySelectorAll('._____optionProgress').forEach(e => {
    e.style.width = e.dataset.width + '%';
})
document.querySelector('#deletePollButton')?.addEventListener('click', handlePollDelete);