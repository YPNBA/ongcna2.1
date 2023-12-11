// script.js

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-btn');
    const formContainer = document.getElementById('form-container');
    const closeBtn = document.getElementById('close-btn');

    openBtn.addEventListener('click', () => {
        formContainer.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        formContainer.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === formContainer) {
            formContainer.style.display = 'none';
        }
    });
});

// script.js

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-btn');
    const formContainer = document.getElementById('form-container');
    const closeBtn = document.getElementById('close-btn');
    const body = document.body;

    openBtn.addEventListener('click', () => {
        formContainer.style.display = 'block';
        body.classList.add('open-form');
    });

    closeBtn.addEventListener('click', () => {
        formContainer.style.display = 'none';
        body.classList.remove('open-form');
    });

    window.addEventListener('click', (e) => {
        if (e.target === formContainer) {
            formContainer.style.display = 'none';
            body.classList.remove('open-form');
        }
    });
});


window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

// index.js

// index.js

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('modal');
  const closeModalButton = document.getElementById('closeModal');
  const openModalButtons = document.querySelectorAll('[id^="openModal"]');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  openModalButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const index = button.getAttribute('data-index');
      const stagiaire = stagiaires[index];

      // Mettez à jour le contenu du modal avec les détails du stagiaire
      modalTitle.textContent = `${stagiaire.nom} ${stagiaire.prenom}`;
      modalContent.innerHTML = `
        <p>Date de Naissance: ${stagiaire.date}</p>
        <p>Quartier: ${stagiaire.quartier}</p>
        <!-- ... Ajoutez d'autres champs ... -->
      `;

      // Ouvrir le modal
      modal.classList.remove('hidden');
    });
  });

  closeModalButton.addEventListener('click', function () {
    // Fermer le modal
    modal.classList.add('hidden');
  });
});


