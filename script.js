let allCourses = [];
let filteredCourses = [];
let currentPage = 1;
const coursesPerPage = 3;


async function fetchCourses() {
    try {
        const response = await fetch('https://json.extendsclass.com/bin/8b8364bd9e99');
        allCourses = await response.json();
        filteredCourses = [...allCourses];
        displayCourses();
        populateCategoryFilter();
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}


function displayCourses() {
    const coursesList = document.getElementById('courses-list');
    coursesList.innerHTML = '';

    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    paginatedCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        courseCard.innerHTML = `
            <h3>${course.title}</h3>
            <p>Instructor: ${course.instructor}</p>
            <p>Duration: ${course.duration}</p>
            <p>Rating: ${course.rating}</p>
            <p>Category: ${course.category}</p>
            <p>Price: ${course.price}</p>
            <p>Enrolled: ${course.enrolled}</p>
        `;
        coursesList.appendChild(courseCard);
    });

    updatePagination();
}


function updatePagination() {
const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
document.getElementById('current-page').textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}


function CategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    const categories = [...new Set(allCourses.map(course => course.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}


document.getElementById('search').addEventListener('input', filterCourses);
document.getElementById('category-filter').addEventListener('change', filterCourses);
document.getElementById('sort').addEventListener('change', sortCourses);
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayCourses();
    }
});
document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayCourses();
    }
});


function filterCourses() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;

    filteredCourses = allCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm) || 
                              course.instructor.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === '' || course.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    currentPage = 1;
    displayCourses();
}


function sortCourses() {
    const sortBy = document.getElementById('sort').value;
    filteredCourses.sort((a, b) => {
        if (sortBy === 'price') {
            return parseFloat(a.price.replace('Rs.', '')) - parseFloat(b.price.replace('Rs.', ''));
        } else if (sortBy === 'rating') {
            return b.rating - a.rating;
        } else {
            return a.title.localeCompare(b.title);
        }
    });
    displayCourses();
}


document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const courseId = document.getElementById('course-id').value;

    if (name && email && courseId) {
        if (validateEmail(email)) {
            if (allCourses.some(course => course.courseId === courseId)) {
                alert('Thank you for signing up!');
                this.reset();
            } else {
                alert('Invalid Course ID. Please check and try again.');
            }
        } else {
            alert('Please enter a valid email address.');
        }
    } else {
        alert('Please fill in all fields.');
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


fetchCourses();