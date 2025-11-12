function handleSearchBarToggle() {

    const nav = this.parentElement.parentElement;

    const searchBar = nav.querySelector(".__headerSearchBar");
    const headerIcon = nav.querySelector("#headerIcon");
    const userIcon = nav.querySelector("#userIconButton");
    const logoutIcon = nav.querySelector("#logoutIconButton");

    if (searchBar.classList.contains('active')) {
        const searchBarContent = (searchBar.querySelector("input").value ?? '').trim();
        if (searchBarContent !== '') {
            window.location.href = '/poll?search=' + encodeURIComponent(searchBarContent);
            return;
        }

        searchBar.classList.remove('active') 
        headerIcon.classList.add('active');
        userIcon.classList.add('active');
        logoutIcon?.classList?.add('active');
    } else {
        searchBar.classList.add('active');
        headerIcon.classList.remove('active');
        userIcon.classList.remove('active');
        logoutIcon?.classList?.remove('active');
    }
}

function handleSubmit(e) {

    const searchBarContent = (e.target.value ?? '').trim();
    if (searchBarContent !== '' && e.key === 'Enter') window.location.href = '/poll?search=' + encodeURIComponent(searchBarContent);

}


document.querySelector("#searchIconButton").addEventListener('click', handleSearchBarToggle);
document.querySelector(".__headerSearchBar input").addEventListener('keydown', handleSubmit);