async function handleCopyUserLink() {

    const btnImage = this.querySelector('img');
    const userId = this.getAttribute('data-userId');

    const URI = new URL(document.URL);
    const protocol = URI.protocol;
    const host = URI.host;

    navigator.clipboard.writeText(`${protocol}//${host}/user/${userId}`);
    
    btnImage.src = '/images/icons/checkmark.svg';
    await (new Promise(r => setTimeout(r, (0.8 * 1000))));
    btnImage.src = '/images/icons/link.svg'; 

}

document.querySelector("#copyUserLinkButton").addEventListener('click', handleCopyUserLink);