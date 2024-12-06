document.addEventListener('DOMContentLoaded', function () {
    const buttonOpen = document.getElementById('buttonOpen');
    const buttonClose = document.getElementById('buttonClose');
    const menu = document.getElementById('menu');

    const style = document.createElement('style');
    style.textContent = `
        @keyframes menuSlideIn {
            from {
                opacity: 0;
                transform: translateY(-100%);
            }
            to {
                opacity: 1;
                transform: translateY(0%);
            }
        }

        #menu.open {
            display: flex;
            animation: menuSlideIn 0.1s ease-out forwards;
        }
    `;
    document.head.appendChild(style);

    buttonOpen.addEventListener('click', function () {
        menu.classList.remove('hidden');
        menu.classList.add('open');
        buttonOpen.style.display = 'none';
        buttonClose.style.display = 'flex';
        //desactive le scroll
        document.body.style.overflow = 'hidden';
    });

    buttonClose.addEventListener('click', function () {
        //active le scroll
        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
        menu.classList.remove('open');
        menu.classList.add('hidden');
        buttonOpen.style.display = 'flex';
        buttonClose.style.display = 'none';
    });
});