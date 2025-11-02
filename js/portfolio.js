document.addEventListener('DOMContentLoaded', function() {
    console.log("Portfolio script loaded. Waiting 100ms before executing...");
    setTimeout(loadProjects, 100);

    const modal = document.getElementById('project-modal');
    const span = document.getElementsByClassName('close')[0];

    function closeModal() {
        modal.classList.remove('is-open');
        setTimeout(() => {
            modal.style.display = 'none';
            document.getElementById('modal-video').src = ''; // Stop video playback
        }, 300); // Match CSS transition duration
    }

    span.onclick = closeModal;
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
});

function loadProjects() {
    console.log("Attempting to load projects from portfolio_data/projects.json...");
    fetch('portfolio_data/projects.json')
        .then(response => {
            console.log("Fetch response received. Status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(projects => {
            console.log("Projects data loaded successfully:", projects);
            const grid = document.getElementById('project-grid');
            if (!grid) {
                console.error("CRITICAL ERROR: The 'project-grid' element was not found in the HTML.");
                return;
            }
            grid.innerHTML = ''; // Clear existing content
            projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'col-md-4 col-sm-6 project-card';

                // Create the final HTML structure with the overlay effect
                card.innerHTML = `
                    <div class="overlay-effect effects clearfix">
                        <div class="img">
                            <img class="grayscale" src="${project.image_thumb}" alt="${project.title}">
                            <div class="overlay">
                                <h4 class="project-title">${project.title}</h4>
                                <p class="project-description">${project.category}</p>
                                <button class="btn view-details-btn">View Details</button>
                            </div>
                        </div>
                    </div>
                `;

                // Add the click event to the button inside the card
                const viewDetailsBtn = card.querySelector('.view-details-btn');
                viewDetailsBtn.onclick = (e) => {
                    e.stopPropagation(); // Prevent any other click events
                    showProjectModal(project);
                };

                grid.appendChild(card);
            });
            console.log(`Rendered ${projects.length} project(s) successfully.`);
        })
        .catch(error => {
            console.error("FATAL ERROR: Could not load or render projects. See details below:", error);
        });
}

function showProjectModal(project) {
    const modal = document.getElementById('project-modal');
    
    // Populate content first
    document.getElementById('modal-title').innerText = project.title;
    document.getElementById('modal-video').src = project.video_url;
    document.getElementById('modal-role').innerText = project.my_role;
    document.getElementById('modal-platforms').innerText = project.platforms.join(', ');
    document.getElementById('modal-tech').innerText = project.tech_stack.join(', ');
    document.getElementById('modal-long-description').innerText = project.description_long;

    const projectLink = document.getElementById('modal-project-link');
    const sourceLink = document.getElementById('modal-source-link');

    if (project.project_url && project.project_url !== '#') {
        projectLink.href = project.project_url;
        projectLink.style.display = 'inline-block';
    } else {
        projectLink.style.display = 'none';
    }

    if (project.source_url && project.source_url !== '#') {
        sourceLink.href = project.source_url;
        sourceLink.style.display = 'inline-block';
    } else {
        sourceLink.style.display = 'none';
    }

    // Show modal with animation
    modal.style.display = 'block';
    // We need a slight delay to allow the display property to apply before adding the class for transition
    setTimeout(() => {
        modal.classList.add('is-open');
    }, 10);
}
