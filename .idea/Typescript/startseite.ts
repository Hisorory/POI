import { jsPDF } from 'jspdf';

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
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const authorInput = document.getElementById('author') as HTMLInputElement;
    const statusInput = document.getElementById('status-filter-modal') as HTMLSelectElement;
    const typeInput = document.getElementById('art-filter-modal') as HTMLSelectElement;
    const sectionsContainer = document.querySelector('.sections-container') as HTMLDivElement;
    const tagContainer = document.querySelector('.tag-container') as HTMLDivElement;
    const closeButton = document.querySelector('.close-btn') as HTMLSpanElement;
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const placeholderImg = document.getElementById('placeholder-img') as HTMLImageElement;

    let editingRow: HTMLTableRowElement | null = null;
    let uploadedImageUrl = '';

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

        if (!statusInput.value.trim()) {
            isValid = false;
            errorMessage += 'Bitte wählen Sie einen Status aus.\n';
        }

        if (!typeInput.value.trim()) {
            isValid = false;
            errorMessage += 'Bitte wählen Sie eine Art aus.\n';
        }

        const statusValue = statusInput.value || 'Entwurf';
        const typeValue = typeInput.value || 'Bachelor';

        const sections = toArray(sectionsContainer.querySelectorAll('.section')).map(section => {
            const title = (section.querySelector('.modal-input') as HTMLInputElement).value.trim();
            const content = (section.querySelector('.modal-textarea') as HTMLTextAreaElement).value.trim();
            return { title, content };
        }).filter(section => section.title || section.content);

        const tags = toArray(tagContainer.querySelectorAll('.tag-item')).map(tagItem => {
            const tag = (tagItem.querySelector('.tag-input') as HTMLInputElement).value.trim();
            return tag;
        }).filter(tag => tag);

        if (isValid) {
            const title = titleInput.value.trim();
            const author = authorInput.value.trim();
            const imageUrl = uploadedImageUrl || '../Bilder/placeholder.png';

            const topic = { id: '', title, status: statusValue, type: typeValue, author, imageUrl, sections, tags };

            if (editingRow) {
                topic.id = editingRow.dataset.id!;
                updateTopicInTable(editingRow, topic);
                updateTopicInLocalStorage(topic.id, topic);
            } else {
                topic.id = new Date().getTime().toString();
                addTopicToTable(topic);
                saveToLocalStorage(topic);
            }

            modal.style.display = 'none';
            resetForm();
        } else {
            alert(errorMessage);
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.querySelector('.add-section-btn')?.addEventListener('click', () => addSection());
    document.querySelector('.add-tag-btn')?.addEventListener('click', () => addTag());

    placeholderImg.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', handleFileUpload);

    loadTopicsFromLocalStorage();

    function filterTopics() {
        const statusValue = statusFilter.value.toLowerCase();
        const artValue = artFilter.value.toLowerCase();
        const searchValue = searchInput.value.toLowerCase();

        const rows = topicsTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const status = (row.querySelector('.status') as HTMLElement)?.textContent?.toLowerCase() || '';
            const art = (row as HTMLTableRowElement).cells[3]?.textContent?.toLowerCase() || '';
            const title = (row as HTMLTableRowElement).cells[1]?.textContent?.toLowerCase() || '';

            const matchesStatus = !statusValue || status.indexOf(statusValue);
            const matchesArt = !artValue || art.indexOf(artValue);
            const matchesSearch = !searchValue || title.indexOf(searchValue);

            if (matchesStatus && matchesArt && matchesSearch) {
                (row as HTMLElement).style.display = '';
            } else {
                (row as HTMLElement).style.display = 'none';
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
            const id = row.dataset.id!;
            row.remove();
            removeFromLocalStorage(id);
        }
        event.stopPropagation();
    }

    function editRow(event: Event) {
        const button = event.target as HTMLElement;
        const row = button.closest('tr') as HTMLTableRowElement;
        if (row) {
            const title = row.cells[1].textContent || '';
            const status = row.querySelector('.status')?.textContent || '';
            const type = row.cells[3].textContent || '';
            const author = row.dataset.author || '';
            const imageUrl = row.dataset.imageUrl || '../Bilder/placeholder.png';
            const sections = JSON.parse(row.dataset.sections || '[]');
            const tags = JSON.parse(row.dataset.tags || '[]');

            titleInput.value = title;
            authorInput.value = author;
            statusInput.value = status;
            typeInput.value = type;

            placeholderImg.src = imageUrl;
            uploadedImageUrl = imageUrl;

            sectionsContainer.innerHTML = '';
            sections.forEach((section: { title: string, content: string }) => addSection(section.title, section.content));
            if (sections.length === 0) addSection();

            tagContainer.innerHTML = '';
            tags.forEach((tag: string) => addTag(tag));
            if (tags.length === 0) addTag();

            modal.style.display = 'block';
            editingRow = row;
        }
        event.stopPropagation();
    }

    function showDetailModal(row: HTMLTableRowElement) {
        const title = row.cells[1].textContent || '';
        const author = row.dataset.author || '';
        const status = row.querySelector('.status')?.textContent || '';
        const type = row.cells[3].textContent || '';
        const description = "Lorem ipsum dolor sit amet...";

        const modalTitle = document.getElementById('modal-title')!;
        const modalAuthor = document.getElementById('modal-author')!;
        const modalStatus = document.getElementById('modal-status')!;
        const modalType = document.getElementById('modal-type')!;
        const modalDescription = document.getElementById('modal-description')!;

        modalTitle.textContent = title;
        modalAuthor.textContent = `Autor: ${author}`;
        modalStatus.textContent = `Status: ${status}`;
        modalType.textContent = `Typ: ${type}`;
        modalDescription.textContent = `Beschreibung: ${description}`;

        const detailModal = document.getElementById('detail-modal') as HTMLDivElement;
        detailModal.style.display = 'block';
    }

    function downloadPDF(event: Event) {
        const row = (event.target as HTMLElement).closest('tr') as HTMLTableRowElement;
        if (!row) return;

        const title = row.cells[1].textContent || '';
        const author = row.dataset.author || '';
        const status = row.querySelector('.status')?.textContent || '';
        const type = row.cells[3].textContent || '';
        const description = "Lorem ipsum dolor sit amet...";

        const doc = new jsPDF();

        doc.text(`Titel: ${title}`, 10, 10);
        doc.text(`Autor: ${author}`, 10, 20);
        doc.text(`Status: ${status}`, 10, 30);
        doc.text(`Typ: ${type}`, 10, 40);
        doc.text(`Beschreibung: ${description}`, 10, 50);

        doc.save(`${title}.pdf`);
    }

    function addTopicToTable(topic: { id: string, title: string, status: string, type: string, author: string, imageUrl: string, sections: any[], tags: string[] }) {
        const statusClass = getStatusClass(topic.status);

        const newRow = document.createElement('tr');
        newRow.dataset.id = topic.id;
        newRow.dataset.author = topic.author;
        newRow.dataset.imageUrl = topic.imageUrl;
        newRow.dataset.sections = JSON.stringify(topic.sections);
        newRow.dataset.tags = JSON.stringify(topic.tags);

        newRow.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${topic.title}</td>
            <td><span class="status ${statusClass}">${topic.status}</span></td>
            <td>${topic.type}</td>
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

    function updateTopicInTable(row: HTMLTableRowElement, topic: { id: string, title: string, status: string, type: string, author: string, imageUrl: string, sections: any[], tags: string[] }) {
        row.cells[1].textContent = topic.title;
        const statusElement = row.querySelector('.status') as HTMLElement;
        statusElement.textContent = topic.status;
        statusElement.className = `status ${getStatusClass(topic.status)}`;
        row.cells[3].textContent = topic.type;
        row.dataset.author = topic.author;
        row.dataset.imageUrl = topic.imageUrl;
        row.dataset.sections = JSON.stringify(topic.sections);
        row.dataset.tags = JSON.stringify(topic.tags);
    }

    function saveToLocalStorage(topic: { id: string, title: string, status: string, type: string, author: string, imageUrl: string, sections: any[], tags: string[] }) {
        const topics = JSON.parse(localStorage.getItem('topics') || '[]');
        topics.push(topic);
        localStorage.setItem('topics', JSON.stringify(topics));
    }

    function updateTopicInLocalStorage(id: string, updatedTopic: { title: string, status: string, type: string, author: string, imageUrl: string, sections: any[], tags: string[] }) {
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
        topics.forEach((topic: { id: string, title: string, status: string, type: string, author: string, imageUrl: string, sections: any[], tags: string[] }) => {
            addTopicToTable(topic);
        });
    }

    function resetForm() {
        resetImagePlaceholder();
        titleInput.value = '';
        authorInput.value = '';
        statusInput.value = '';
        typeInput.value = '';
        sectionsContainer.innerHTML = '';
        addSection();
        tagContainer.innerHTML = '';
        addTag();
        uploadedImageUrl = '';
    }

    function resetImagePlaceholder() {
        const placeholderSrc = '../Bilder/placeholder.png';
        placeholderImg.src = placeholderSrc;
        fileInput.value = '';
    }

    function addSection(title = '', content = '') {
        const section = document.createElement('div');
        section.classList.add('section');
        section.innerHTML = `
            <div class="section-header">
                <button class="add-section-btn">+</button>
                <input type="text" class="modal-input" placeholder="Abschnitt Titel hinzufügen" value="${title}">
            </div>
            <textarea class="modal-textarea large-textarea" placeholder="Abschnitt hinzufügen">${content}</textarea>
        `;
        section.querySelector('.add-section-btn')?.addEventListener('click', (event) => {
            event.preventDefault();
            addSection();
        });
        sectionsContainer.appendChild(section);
    }

    function addTag(tag = '') {
        const tagItem = document.createElement('div');
        tagItem.classList.add('tag-item');
        tagItem.innerHTML = `
            <button class="add-tag-btn">+</button>
            <input type="text" class="tag-input" placeholder="Tag hinzufügen" value="${tag}">
        `;
        tagItem.querySelector('.add-tag-btn')?.addEventListener('click', (event) => {
            event.preventDefault();
            addTag();
        });
        tagContainer.appendChild(tagItem);
    }

    function getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'vollständig':
                return 'complete';
            case 'vergeben':
                return 'assigned';
            default:
                return 'draft';
        }
    }

    function handleFileUpload() {
        const file = fileInput.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImageUrl = e.target?.result as string;
                placeholderImg.src = uploadedImageUrl;
            };
            reader.readAsDataURL(file);
        } else {
            resetImagePlaceholder();
        }
    }

    function toArray(nodeList: NodeList): HTMLElement[] {
        const array: HTMLElement[] = [];
        for (let i = 0; i < nodeList.length; i++) {
            array.push(nodeList[i] as HTMLElement);
        }
        return array;
    }
});
