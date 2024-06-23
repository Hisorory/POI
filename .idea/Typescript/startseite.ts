document.addEventListener('DOMContentLoaded', () => {
    const statusFilter = document.getElementById('status-filter') as HTMLSelectElement;
    const artFilter = document.getElementById('art-filter') as HTMLSelectElement;
    const searchInput = document.querySelector('.search-wrapper input') as HTMLInputElement;
    const tags = document.querySelectorAll('.tags a');
    const tableRows = document.querySelectorAll('.topics-table tbody tr');

    statusFilter.addEventListener('change', filterTopics);
    artFilter.addEventListener('change', filterTopics);
    searchInput.addEventListener('input', filterTopics);
    tags.forEach(tag => tag.addEventListener('click', filterByTag));

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
});


