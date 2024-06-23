document.addEventListener('DOMContentLoaded', () => {
    const statusFilter = document.getElementById('status-filter') as HTMLSelectElement;
    const artFilter = document.getElementById('art-filter') as HTMLSelectElement;
    const searchInput = document.querySelector('.search-wrapper input') as HTMLInputElement;
    const tags = document.querySelectorAll('.tags a');
    const tableRows = document.querySelectorAll('.topics-table tbody tr');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    statusFilter.addEventListener('change', filterTopics);
    artFilter.addEventListener('change', filterTopics);
    searchInput.addEventListener('input', filterTopics);
    tags.forEach(tag => tag.addEventListener('click', filterByTag));
    deleteButtons.forEach(button => button.addEventListener('click', deleteRow));

    function filterTopics() {
        const statusValue = statusFilter.value.toLowerCase();
        const artValue = artFilter.value.toLowerCase();
        const searchValue = searchInput.value.toLowerCase();

        tableRows.forEach(row => {
            if (row instanceof HTMLTableRowElement) {
                const statusElement = row.querySelector('.status');
                const statusText = statusElement ? statusElement.textContent?.toLowerCase() : '';
                const artText = row.cells[3]?.textContent?.toLowerCase() || '';
                const topicText = row.cells[1]?.textContent?.toLowerCase() || '';

                // @ts-ignore
                const statusMatches = statusValue === '' || (statusText && statusText.includes(statusValue));
                // @ts-ignore
                const artMatches = artValue === '' || artText.includes(artValue);
                // @ts-ignore
                const searchMatches = searchValue === '' || topicText.includes(searchValue);

                if (statusMatches && artMatches && searchMatches) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
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
        const row = button.closest('tr');
        if (row) {
            row.remove();
        }
    }

});

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('.add-btn') as HTMLButtonElement;
    const closeButton = document.querySelector('.close-btn') as HTMLSpanElement;
    const modal = document.querySelector('.modal') as HTMLDivElement;
    const sectionsContainer = document.querySelector('.sections-container') as HTMLDivElement;
    const tagContainer = document.querySelector('.tag-container') as HTMLDivElement;
    const placeholderImg = document.getElementById('placeholder-img') as HTMLImageElement;
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const saveButton = document.querySelector('.save-btn') as HTMLButtonElement;
    const titleInput = document.getElementById('title') as HTMLTextAreaElement;
    const authorInput = document.getElementById('author') as HTMLInputElement;
    const topicsTable = document.getElementById('topics-table') as HTMLTableElement;

    const placeholderSrc = placeholderImg.src; // Store the original placeholder image source

    addButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        resetForm();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetForm();
        }
    });

    placeholderImg.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement).files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                placeholderImg.src = e.target.result as string;
            };
            reader.readAsDataURL(file);
        }
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

        const tagInputs = document.querySelectorAll('.tag-input');
        let statusValue = '';
        let typeValue = '';
        tagInputs.forEach((input) => {
            // @ts-ignore
            const value = input.value.trim();
            if (value === 'Entwurf' || value === 'Vollständig' || value === 'Vergeben') {
                statusValue = value;
            }
            if (value === 'Bachelor' || value === 'Master') {
                typeValue = value;
            }
        });

        if (isValid) {
            addTopicToTable(titleInput.value.trim(), statusValue, typeValue);
            modal.style.display = 'none';
            resetForm();
        } else {
            alert(errorMessage);
        }
    });

    function addTopicToTable(title: string, status: string, type: string) {
        const statusClass = status.toLowerCase() === 'vollständig' ? 'complete' : status.toLowerCase() === 'vergeben' ? 'assigned' : 'draft';

        // Use default empty values if no valid status or type provided
        const displayStatus = status || '';
        const displayType = type || '';

        const newRow = document.createElement('tr');

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

        topicsTable.querySelector('tbody').appendChild(newRow);
    }

    function resetForm() {
        placeholderImg.src = placeholderSrc; // Reset the image to the placeholder
        fileInput.value = ''; // Clear the file input
        titleInput.value = ''; // Clear the title input
        authorInput.value = ''; // Clear the author input
        // @ts-ignore
        document.querySelectorAll('.tag-input').forEach(input => input.value = ''); // Clear all tag inputs
    }

    function addSection() {
        const section = document.createElement('div');
        section.className = 'section';

        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';

        const addSectionButton = document.createElement('button');
        addSectionButton.className = 'add-section-btn';
        addSectionButton.textContent = '+';
        addSectionButton.addEventListener('click', addSection);

        const sectionTitleInput = document.createElement('input');
        sectionTitleInput.type = 'text';
        sectionTitleInput.className = 'modal-input';
        sectionTitleInput.placeholder = 'Abschnitt Titel hinzufügen';

        sectionHeader.appendChild(addSectionButton);
        sectionHeader.appendChild(sectionTitleInput);

        const textArea = document.createElement('textarea');
        textArea.className = 'modal-textarea large-textarea';
        textArea.placeholder = 'Abschnitt hinzufügen';

        section.appendChild(sectionHeader);
        section.appendChild(textArea);
        sectionsContainer.appendChild(section);
    }

    function addTag() {
        const tagItem = document.createElement('div');
        tagItem.className = 'tag-item';

        const addTagButton = document.createElement('button');
        addTagButton.className = 'add-tag-btn';
        addTagButton.textContent = '+';
        addTagButton.addEventListener('click', addTag);

        const tagInput = document.createElement('input');
        tagInput.type = 'text';
        tagInput.className = 'tag-input';
        tagInput.placeholder = 'Tag hinzufügen';

        tagItem.appendChild(addTagButton);
        tagItem.appendChild(tagInput);
        tagContainer.appendChild(tagItem);
    }

    // Add initial section and tag
    addSection();
    addTag();
});
















