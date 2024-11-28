var f1 = document.querySelector(".Manual");
var f2 = document.querySelector(".Personal-Dict");
var f3 = document.querySelector(".tts");
var f4 = document.querySelector(".f4");
function startReading() {   
    
    const loaderContainer = document.getElementById('loader-container');
    loaderContainer.style.display = 'flex';

    
    setTimeout(() => {  
        window.location.href = '/pdf-viewer';
        loaderContainer.style.display = 'none';
    }, 6500);
}

document.querySelector('.dropdown-link').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link behavior
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    // Toggle the dropdown menu visibility
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });
  
f1.addEventListener('click', () => {
    // Redirect to manual dictionary page
    window.location.href = '/manual-dictionary';
});
f2.addEventListener('click', () => {
    // Redirect to manual dictionary page
    window.location.href = '/wordstock';
});
f3.addEventListener('click', () => {
    // Redirect to manual dictionary page
    window.location.href = '/tts';
});
f4.addEventListener('click', () => {
    const loaderContainer = document.getElementById('loader-container');
    loaderContainer.style.display = 'flex';

    // Wait for 5 seconds, then redirect
    setTimeout(() => {
        window.location.href = '/pdf-viewer';
        loaderContainer.style.display = 'none';
    }, 6500);

});
