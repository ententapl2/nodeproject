function handleSearchBarToggle() {

    const nav = this.parentElement.parentElement;

    const searchBar = nav.querySelector(".__headerSearchBar");
    const headerIcon = nav.querySelector("#headerIcon");
    const userIcon = nav.querySelector("#userIconButton");
    const logoutIcon = nav.querySelector("#logoutIconButton");
    const themeIcon = nav.querySelector("#toggleTheme");

    if (searchBar.classList.contains('active')) {
        const searchBarContent = (searchBar.querySelector("input").value ?? '').trim();
        if (searchBarContent !== '') {
            window.location.href = '/poll?search=' + encodeURIComponent(searchBarContent);
            return;
        }

        searchBar.classList.remove('active'); 
        headerIcon.classList.add('active');
        userIcon.classList.add('active');
        logoutIcon?.classList?.add('active');
        themeIcon?.classList.add('active');
    } else {
        searchBar.classList.add('active');
        headerIcon.classList.remove('active');
        userIcon.classList.remove('active');
        logoutIcon?.classList?.remove('active');
        themeIcon?.classList.remove('active');
    }
}


function applyTheme() {

    const stored = localStorage.getItem('theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored ?? (system ? 'dark' : 'light');


    document.querySelector('#toggleTheme').src = '/images/icons/' + (theme === 'dark' ? 'light' : 'dark') + '.svg';
    document.documentElement.setAttribute('data-theme', theme);

}

function handleThemeToggle() {

    const isDarkCurrent = document.documentElement.getAttribute('data-theme') === 'dark';
    const theme = isDarkCurrent ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    applyTheme();
    
    
}

function handleSubmit(e) {

    const searchBarContent = (e.target.value ?? '').trim();
    if (searchBarContent !== '' && e.key === 'Enter') window.location.href = '/poll?search=' + encodeURIComponent(searchBarContent);

}


document.querySelector("#searchIconButton").addEventListener('click', handleSearchBarToggle);
document.querySelector(".__headerSearchBar input").addEventListener('keydown', handleSubmit);
document.querySelector('#toggleTheme').addEventListener('click', handleThemeToggle);
applyTheme();