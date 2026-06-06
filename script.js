document.addEventListener('DOMContentLoaded', () => {
    const GITHUB_PAT = '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'; // Dein GitHub Personal Access Token
    const GITHUB_API_URL = 'https://api.github.com/user/repos?type=owner&sort=updated&direction=desc';
    const repositoryList = document.getElementById('repositoryList');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    let allRepositories = [];

    const fetchRepositories = async () => {
        repositoryList.innerHTML = '<p class="loading-message">Lade Repositories...</p>';
        try {
            const response = await fetch(GITHUB_API_URL, {
                headers: {
                    'Authorization': `token ${GITHUB_PAT}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API Fehler: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const repos = await response.json();
            allRepositories = repos.map(repo => {
                const pagesUrl = `https://${repo.owner.login}.github.io/${repo.name}/`;
                return {
                    name: repo.name,
                    description: repo.description,
                    updated_at: new Date(repo.updated_at),
                    html_url: repo.html_url,
                    has_pages: repo.has_pages, // GitHub API provides this flag
                    pages_url: pagesUrl
                };
            });
            displayRepositories(allRepositories);
        } catch (error) {
            console.error('Fehler beim Abrufen der Repositories:', error);
            repositoryList.innerHTML = `<p class="no-results-message">Fehler beim Laden der Repositories: ${error.message}. Bitte überprüfe deinen GitHub PAT und deine Internetverbindung.</p>`;
        }
    };

    const displayRepositories = (repositories) => {
        repositoryList.innerHTML = ''; // Clear existing content

        if (repositories.length === 0) {
            repositoryList.innerHTML = '<p class="no-results-message">Keine Repositories gefunden, die den Kriterien entsprechen.</p>';
            return;
        }

        repositories.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.classList.add('repository-card');

            repoCard.innerHTML = `
                <h2>${repo.name}</h2>
                <p class="description">${repo.description || 'Keine Beschreibung verfügbar.'}</p>
                <p class="last-updated">Zuletzt aktualisiert: ${repo.updated_at.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div class="links">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.19.01-.82.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07.01 1.93.01 2.2 0 .21-.15.46-.55.38A8.013 8.013 0 0 1 8 16c-4.42 0-8-3.58-8-8a8.013 8.013 0 0 1 7.59-8z"></path></svg>
                        GitHub Repo
                    </a>
                    ${repo.has_pages ? `<a href="${repo.pages_url}" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2h1v-.08zM18.93 11H17v-.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V11h-1v-.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V11h-1v-.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V11h-1v-.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V11c0 .28-.22.5-.5.5s-.5-.22-.5-.5V10c0-1.1-.9-2-2-2H9v-.93c3.95.49 7 3.85 7 7.93 0 .62-.08 1.21-.21 1.79L15 9v-1c0-1.1-.9-2-2-2H9.08L9 6h-.08C5.02 6 2 9.02 2 12c0 1.94.75 3.7 2 5L4 12c0-1.1.9-2 2-2h1c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H6c-1.1 0-2 .9-2 2v.08L4.07 13H5v.5c0 .28.22.5.5.5s.5-.22.5-.5V13h1v.5c0 .28.22.5.5.5s.5-.22.5-.5V13h1v.5c0 .28.22.5.5.5s.5-.22.5-.5V13h1v.5c0 .28.22.5.5.5s.5-.22.5-.5V13h1v.5c0 .28.22.5.5.5s.5-.22.5-.5V13h1v.5c0 .28.22.5.5.5s.5-.22.5-.5V13h.08L18 12c.03 0 .07 0 .1 0H19c1.1 0 2-.9 2-2V9h-.07C18.49 9.38 18 10.15 18 11zM11 5h1c.55 0 1 .45 1 1v1h-3V6c0-.55.45-1 1-1zm6 11c0 1.1-.9 2-2 2H9.08l-.01-.01c-.13.58-.2 1.18-.21 1.79 3.95-.49 7-3.85 7-7.93 0-.62-.08-1.21-.21-1.79L17 15v1z"/></svg>
                        GitHub Pages
                    </a>` : ''}
                </div>
            `;
            repositoryList.appendChild(repoCard);
        });
    };

    const filterAndSortRepositories = () => {
        let filtered = [...allRepositories];

        // Filter
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(repo =>
                repo.name.toLowerCase().includes(searchTerm) ||
                (repo.description && repo.description.toLowerCase().includes(searchTerm))
            );
        }

        // Sort
        const sortValue = sortSelect.value;
        filtered.sort((a, b) => {
            if (sortValue === 'name-asc') {
                return a.name.localeCompare(b.name);
            } else if (sortValue === 'name-desc') {
                return b.name.localeCompare(a.name);
            } else if (sortValue === 'updated-asc') {
                return a.updated_at.getTime() - b.updated_at.getTime();
            } else if (sortValue === 'updated-desc') {
                return b.updated_at.getTime() - a.updated_at.getTime();
            }
            return 0;
        });

        displayRepositories(filtered);
    };

    // Event Listeners
    searchInput.addEventListener('input', filterAndSortRepositories);
    sortSelect.addEventListener('change', filterAndSortRepositories);

    // Initial fetch
    fetchRepositories();
});
