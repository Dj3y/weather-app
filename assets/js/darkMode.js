export function darkMode(){
    let darkMode = localStorage.getItem('darkMode');
    const btndDarkMode = document.querySelector('#dark_mode');
    let img = document.createElement('img');
    // img.setAttribute('src', 'assets/images/icon/moon.png');
    // img.setAttribute('alt','icon moon');
    // btndDarkMode.appendChild(img);
    const logo = document.querySelector('#logo');
    const activeDarkMode = () => {
        document.body.classList.add('darkmode');
        localStorage.setItem('darkMode', 'active');
        // img.setAttribute('src', 'assets/images/sun.svg');
        btndDarkMode.textContent = "light mode";
    }
    const desibleDarkMode = () => {
        document.body.classList.remove('darkmode');
        localStorage.setItem('darkMode', null);
    //     img.setAttribute('src', 'assets/images/moon.svg');
    btndDarkMode.textContent = "dark mode";
    }
    if (darkMode === "active"){
        activeDarkMode();        
    }
    btndDarkMode.addEventListener('click', () => {
        darkMode = localStorage.getItem('darkMode');
        if(darkMode !== 'active'){
            activeDarkMode();
            console.log(darkMode);
        }
        else{
            desibleDarkMode();
            console.log(darkMode);
        }
    })
}