document.addEventListener('DOMContentLoaded', () => {
    const statusFilter = document.getElementById('status-filter') as HTMLSelectElement;
    const artFilter = document.getElementById('art-filter') as HTMLSelectElement;
    const tableRows = document.querySelectorAll('.topics-table tbody tr');

    statusFilter.addEventListener('change', filterTopics);
    artFilter.addEventListener('change', filterTopics);

    function filterTopics() {
        const statusValue = statusFilter.value.toLowerCase();
        const artValue = artFilter.value.toLowerCase();

        tableRows.forEach(row => {
            if (row instanceof HTMLTableRowElement) {
                const statusElement = row.querySelector('.status');
                const statusText = statusElement ? statusElement.textContent?.toLowerCase() : '';
                const artText = row.cells[3]?.textContent?.toLowerCase() || '';

                // @ts-ignore
                const statusMatches = statusValue === '' || (statusText && statusText.includes(statusValue));
                // @ts-ignore
                const artMatches = artValue === '' || artText.includes(artValue);

                if (statusMatches && artMatches) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }
});

