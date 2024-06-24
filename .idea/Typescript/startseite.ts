document.addEventListener('DOMContentLoaded', () => {
    const statusFilter = document.getElementById('status-filter') as HTMLSelectElement;
    const artFilter = document.getElementById('art-filter') as HTMLSelectElement;
    const searchInput = document.querySelector('.search-wrapper input') as HTMLInputElement;
    const tags = document.querySelectorAll('.tags a');
    const topicsTable = document.getElementById('topics-table') as HTMLTableElement;
    const filterButton = document.querySelector('.filter-btn') as HTMLButtonElement;
    const filterModal = document.getElementById('filter-modal') as HTMLDivElement;
    const saveButton = document.querySelector('.save-btn') as HTMLButtonElement;
    const addButton = document.querySelector('.add-btn') as HTMLButtonElement;
    const modal = document.querySelector('.modal') as HTMLDivElement;
    const titleInput = document.getElementById('title') as HTMLTextAreaElement;
    const authorInput = document.getElementById('author') as HTMLInputElement;
    const statusInput = document.getElementById('status-filter-modal') as HTMLSelectElement;
    const typeInput = document.getElementById('art-filter-modal') as HTMLSelectElement;
    const sectionsContainer = document.querySelector('.sections-container') as HTMLDivElement;
    const tagContainer = document.querySelector('.tag-container') as HTMLDivElement;
    const closeButton = document.querySelector('.close-btn') as HTMLSpanElement;

    let editingRow: HTMLTableRowElement | null = null;

    statusFilter.addEventListener('change', filterTopics);
    artFilter.addEventListener('change', filterTopics);
    searchInput.addEventListener('input', filterTopics);
    tags.forEach(tag => tag.addEventListener('click', filterByTag));
    filterButton.addEventListener('click', () => {
        filterModal.style.display = 'block';
    });

    document.getElementById('filter-close-btn')?.addEventListener('click', () => {
        filterModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === filterModal) {
            filterModal.style.display = 'none';
        }
    });

    addButton.addEventListener('click', () => {
        modal.style.display = 'block';
        editingRow = null;
        resetForm();
    });

    saveButton.addEventListener('click', () => {
        let isValid = true;
        let errorMessage = '';

        if (!titleInput.value.trim()) {
            isValid = false;
            errorMessage += 'Bitte füllen Sie den Titel aus.\n';
        }

        if (!authorInput.value.trim()) {
            isValid = false;
            errorMessage += 'Bitte füllen Sie den Autor aus.\n';
        }

        const statusValue = statusInput.value || 'Entwurf';
        const typeValue = typeInput.value || 'Bachelor';

        if (isValid) {
            const title = titleInput.value.trim();
            const author = authorInput.value.trim();

            if (editingRow) {
                // Update existing topic
                updateTopicInTable(editingRow, title, statusValue, typeValue, author);
                updateTopicInLocalStorage(editingRow.dataset.id, { title, status: statusValue, type: typeValue, author });
            } else {
                // Add new topic
                const id = new Date().getTime().toString();
                addTopicToTable(id, title, statusValue, typeValue, author);
                saveToLocalStorage({ id, title, status: statusValue, type: typeValue, author });
            }

            modal.style.display = 'none';
            resetForm();
        } else {
            alert(errorMessage);
        }
    });

    // Close button event listener for the modal
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Add event listener for the add-section button
    document.querySelector('.add-section-btn')?.addEventListener('click', () => {
        addSection();
    });

    // Add event listener for the add-tag button
    document.querySelector('.add-tag-btn')?.addEventListener('click', () => {
        addTag();
    });

    loadTopicsFromLocalStorage();

    function filterTopics() {
        const statusValue = statusFilter.value.toLowerCase();
        const artValue = artFilter.value.toLowerCase();
        const searchValue = searchInput.value.toLowerCase();

        const rows = topicsTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const status = row.querySelector('.status')?.textContent?.toLowerCase() || '';
            const art = row.cells[3]?.textContent?.toLowerCase() || '';
            const title = row.cells[1]?.textContent?.toLowerCase() || '';

            const matchesStatus = !statusValue || status.includes(statusValue);
            const matchesArt = !artValue || art.includes(artValue);
            const matchesSearch = !searchValue || title.includes(searchValue);

            if (matchesStatus && matchesArt && matchesSearch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function filterByTag(event: Event) {
        const tag = (event.target as HTMLAnchorElement).textContent?.toLowerCase() || '';
        searchInput.value = tag;
        filterTopics();
    }

    function deleteRow(event: Event) {
        const button = event.target as HTMLElement;
        const row = button.closest('tr') as HTMLTableRowElement;
        if (row) {
            const id = row.dataset.id;
            row.remove();
            removeFromLocalStorage(id);
        }
        event.stopPropagation();
    }

    function editRow(event: Event) {
        const button = event.target as HTMLElement;
        const row = button.closest('tr') as HTMLTableRowElement;
        if (row) {
            const title = row.cells[1].textContent;
            const status = row.querySelector('.status')?.textContent;
            const type = row.cells[3].textContent;
            const author = row.dataset.author;

            titleInput.value = title;
            authorInput.value = author;
            statusInput.value = status;
            typeInput.value = type;

            modal.style.display = 'block';
            editingRow = row;
        }
        event.stopPropagation();
    }

    function showDetailModal(row: HTMLTableRowElement) {
        const title = row.cells[1].textContent;
        const author = row.dataset.author;
        const status = row.querySelector('.status')?.textContent;
        const type = row.cells[3].textContent;
        const description = "Lorem ipsum dolor sit amet...";

        const modalTitle = document.getElementById('modal-title');
        const modalAuthor = document.getElementById('modal-author');
        const modalStatus = document.getElementById('modal-status');
        const modalType = document.getElementById('modal-type');
        const modalDescription = document.getElementById('modal-description');

        modalTitle.textContent = title;
        modalAuthor.textContent = `Autor: ${author}`;
        modalStatus.textContent = `Status: ${status}`;
        modalType.textContent = `Typ: ${type}`;
        modalDescription.textContent = `Beschreibung: ${description}`;

        const modal = document.getElementById('detail-modal') as HTMLDivElement;
        modal.style.display = 'block';
    }

    function downloadPDF(event: Event) {
        const row = (event.target as HTMLElement).closest('tr') as HTMLTableRowElement;
        if (!row) return;

        const title = row.cells[1].textContent;
        const author = row.dataset.author;
        const status = row.querySelector('.status')?.textContent;
        const type = row.cells[3].textContent;
        const description = "Lorem ipsum dolor sit amet...";

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text(`Titel: ${title}`, 10, 10);
        doc.text(`Autor: ${author}`, 10, 20);
        doc.text(`Status: ${status}`, 10, 30);
        doc.text(`Typ: ${type}`, 10, 40);
        doc.text(`Beschreibung: ${description}`, 10, 50);

        doc.save(`${title}.pdf`);
    }

    function addTopicToTable(id: string, title: string, status: string, type: string, author: string) {
        const statusClass = status.toLowerCase() === 'vollständig' ? 'complete' : status.toLowerCase() === 'vergeben' ? 'assigned' : 'draft';

        const displayStatus = status || '';
        const displayType = type || '';

        const newRow = document.createElement('tr');
        newRow.dataset.id = id;
        newRow.dataset.author = author;

        newRow.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${title}</td>
            <td><span class="status ${statusClass}">${displayStatus}</span></td>
            <td>${displayType}</td>
            <td>
                <button class="edit-btn"><img src="../Bilder/edit-icon.png" alt="Edit"></button>
                <button class="delete-btn"><img src="../Bilder/delete-icon.png" alt="Delete"></button>
            </td>
        `;

        topicsTable.querySelector('tbody')?.appendChild(newRow);

        newRow.querySelector('.delete-btn')?.addEventListener('click', deleteRow);
        newRow.querySelector('.edit-btn')?.addEventListener('click', editRow);
        newRow.addEventListener('click', () => showDetailModal(newRow as HTMLTableRowElement));
    }

    function updateTopicInTable(row: HTMLTableRowElement, title: string, status: string, type: string, author: string) {
        row.cells[1].textContent = title;
        row.querySelector('.status')!.textContent = status;
        row.cells[3].textContent = type;
        row.dataset.author = author;
    }

    function saveToLocalStorage(topic: { id: string, title: string, status: string, type: string, author: string }) {
        const topics = JSON.parse(localStorage.getItem('topics') || '[]');
        topics.push(topic);
        localStorage.setItem('topics', JSON.stringify(topics));
    }

    function updateTopicInLocalStorage(id: string, updatedTopic: { title: string, status: string, type: string, author: string }) {
        const topics = JSON.parse(localStorage.getItem('topics') || '[]');
        const index = topics.findIndex((topic: { id: string }) => topic.id === id);
        if (index !== -1) {
            topics[index] = { id, ...updatedTopic };
            localStorage.setItem('topics', JSON.stringify(topics));
        }
    }

    function removeFromLocalStorage(id: string) {
        const topics = JSON.parse(localStorage.getItem('topics') || '[]');
        const updatedTopics = topics.filter((topic: { id: string }) => topic.id !== id);
        localStorage.setItem('topics', JSON.stringify(updatedTopics));
    }

    function loadTopicsFromLocalStorage() {
        const topics = JSON.parse(localStorage.getItem('topics') || '[]');
        topics.forEach((topic: { id: string, title: string, status: string, type: string, author: string }) => {
            addTopicToTable(topic.id, topic.title, topic.status, topic.type, topic.author);
        });
    }

    function resetForm() {
        const placeholderImg = document.getElementById('placeholder-img') as HTMLImageElement;
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        const placeholderSrc = placeholderImg.src; // Store the original placeholder image source

        placeholderImg.src = placeholderSrc; // Reset the image to the placeholder
        fileInput.value = ''; // Clear the file input
        titleInput.value = ''; // Clear the title input
        authorInput.value = ''; // Clear the author input
        statusInput.value = ''; // Clear the status input
        typeInput.value = ''; // Clear the type input
        sectionsContainer.innerHTML = ''; // Clear all sections
        addSection(); // Add initial section
        tagContainer.innerHTML = ''; // Clear all tags
        addTag(); // Add initial tag
    }

    function addSection() {
        const section = document.createElement('div');
        section.classList.add('section');
        section.innerHTML = `
            <div class="section-header">
                <button class="add-section-btn">+</button>
                <input type="text" class="modal-input" placeholder="Abschnitt Titel hinzufügen">
            </div>
            <textarea class="modal-textarea large-textarea" placeholder="Abschnitt hinzufügen"></textarea>
        `;
        section.querySelector('.add-section-btn')?.addEventListener('click', addSection);
        sectionsContainer.appendChild(section);
    }

    function addTag() {
        const tagItem = document.createElement('div');
        tagItem.classList.add('tag-item');
        tagItem.innerHTML = `
            <button class="add-tag-btn">+</button>
            <input type="text" class="tag-input" placeholder="Tag hinzufügen">
        `;
        tagItem.querySelector('.add-tag-btn')?.addEventListener('click', addTag);
        tagContainer.appendChild(tagItem);
    }
});


