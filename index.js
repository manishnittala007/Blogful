// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Show the spinner
    showSpinner();
    // Simulate content loading time (replace with your actual loading logic)
    setTimeout(function () {
        hideSpinner();
        console.log("Content loaded!");
    }, 1500); 
});

// Function to display the spinner
function showSpinner() {
    document.getElementById('spinner-overlay').style.display = 'flex';
}
 
// Function to hide the spinner
function hideSpinner() {
    document.getElementById('spinner-overlay').style.display = 'none';
}

// Function to reload the page
function reloadPage() {
    location.reload();
}

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Dark mode toggle switch and body element
    var darkModeToggle = document.getElementById('darkModeToggle');
    var body = document.body;

    // Attach the toggleDarkMode function to the onchange event
    darkModeToggle.onchange = toggleDarkMode;

    // Function to toggle dark mode
    function toggleDarkMode() {
        if (darkModeToggle.checked) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    }

    // Function to enable dark mode
    function enableDarkMode() {
        body.classList.add('dark-mode');
        console.log('Dark mode enabled');      
    }

    // Function to enable light mode
    function enableLightMode() {
        body.classList.remove('dark-mode');
        console.log('Dark mode disabled');
    }
});

// Function to set the active link in the navbar
function setActive(link) {
    // Removing 'active' class from all links
    document.querySelectorAll('.navbar-nav a').forEach(function (element) {
      element.classList.remove('active');
    });

    // Adding 'active' class to the clicked link
    link.classList.add('active');
}

// Function to toggle the search form or filter by category
function toggleForm(category) {
    if (category === 'search') {
        var searchLink = document.querySelector('.search');
        var form = document.getElementById("searchForm");
        searchLink.classList.toggle('hidden');
        form.classList.toggle("hidden");
    } else {
        if (category !== undefined) {
            filterBlogsByCategory(category);
        }
    }
}

// Event listener for the search form submission
document.getElementById('searchForm').onsubmit = function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var input = document.getElementById('search-input');
    if (input.value.trim() === "") {
        filterBlogsByCategory('all');
        return;
    }

    // Filtering blogs based on search input
    var filterdata = allBlogsData.filter(blog => blog.heading.toLowerCase().includes(input.value.toLowerCase()));
    loadblogs(filterdata, 'blogContainer');
    input.value = null;
};

// Function to filter blogs by category
function filterBlogsByCategory(category) {
    if (category === 'all') {
        loadblogs(allBlogsData, 'blogContainer'); 
    } else {
        var filteredData = allBlogsData.filter(blog => blog.category === category);
        loadblogs(filteredData, 'blogContainer');
    }
}

// Variable to track if it's the first blog
var firstblog = true;
// Variable to store all blog data
var allBlogsData;

// Event listener to fetch blog data when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Fetching blog data from JSON file
    fetch('blog.json')
        .then(response => response.json())
        .then(data => {
            allBlogsData = data; 
            loadblogs(data, 'blogContainer');
            var allHeadings = allBlogsData.map(head => head.heading.toLowerCase());
            console.log(allHeadings);
            populateSuggestionList(allHeadings);
        })
        .catch(error => console.error('Error fetching data:', error));
});
// Function to populate the suggestion list
function populateSuggestionList(headings) {
    var suggestionList = document.getElementById('suggestion-list');
    suggestionList.innerHTML = ''; // Clear existing options

    headings.forEach(headingtitle => {
        var option = document.createElement('option');
        option.value = headingtitle;
        suggestionList.appendChild(option);
    });
}

// Function to load blogs into the specified container
function loadblogs(data, containerId) {
    var container = document.getElementById(containerId);
    if (!container) {
        console.error('Container element not found:', containerId);
        return;
    }
    container.innerHTML = '';
    var heading = document.createElement('h3');
    heading.textContent = "Today's Picks";
    container.appendChild(heading);

    var blogContainer = document.createElement('div');
    blogContainer.classList.add('blog-container1', 'mt-3');
    container.appendChild(blogContainer);
    var blogId1 = data[0].id;
    // firstcard
    var firstCard = document.createElement('div');
    firstCard.classList.add('card', 'border-0');
    firstCard.style.cursor = 'pointer';
    firstCard.id = 'blogcard' + blogId1;

    var img1 = document.createElement('img');
    img1.classList.add('card-img-top');
    img1.src = data[0].img;
    img1.style.height = "40%";
    img1.style.width = "100%";

    var cardBody1 = document.createElement('div');
    cardBody1.classList.add('card-body', 'p-0', 'mt-3');

    // var button1 = document.createElement('button');
    // button1.classList.add('chip', 'chip-outline', 'chip-input', 'rounded-pill','chip-sm');
    // button1.textContent = data[0].category;
    // button1.style.border = "1px solid #007bff";
    // button1.style.backgroundColor = "transparent";
    // button1.style.color = "#007bff";
    // button1.style.textAlign = "center";
    // button1.style.fontSize = '15px';
    // button1.style.padding = "7px"; 
    var button1 = createChip(data[0].category);

    var cardData1 = document.createElement('div');
    cardData1.classList.add('card-data', 'mt-2');
    cardData1.innerHTML = `
        <span>${data[0].author} |</span>
        <span>${data[0].role} |</span>
        <span>${data[0].readTime}</span><br>
        <p style="margin-top: 10px;">${data[0].date}</p>
    `;

    var titleDescriptionDiv1 = document.createElement('div');

    var title1 = document.createElement('h5');
    title1.classList.add('card-title', 'mt-3');
    title1.textContent = data[0].heading;

    var content1 = document.createElement('p');
    content1.classList.add('card-text');
    content1.textContent = data[0].content;

    titleDescriptionDiv1.appendChild(title1);
    titleDescriptionDiv1.appendChild(content1);

    cardBody1.appendChild(button1);
    cardBody1.appendChild(cardData1);
    cardBody1.appendChild(titleDescriptionDiv1);

    firstCard.appendChild(img1);
    firstCard.appendChild(cardBody1);

    
    var learnMoreLink = document.createElement('a');
    learnMoreLink.classList.add('text-primary');
    learnMoreLink.style.textDecoration = 'underline';
    learnMoreLink.textContent = 'Learn More';
    
    firstCard.appendChild(learnMoreLink);

    var start = 1;
    var noofblogs = 9;
    var afterthird = true;

    firstCard.addEventListener('click', function () {
        redirectToIndividualPage(blogId1);
    });
    blogContainer.appendChild(firstCard);
    // rest all cards
    var rowdiv = document.createElement('div');
    var blogRow = document.createElement('div');
    blogRow.classList.add('row', 'mt-5');
    blogRow.style.marginTop = "8%";
    
    function blogsdisplay(starting,ending){
        for (i = starting; i < ending; i++) {
            var blogdata = data[i];
            if (!blogdata) {
                break;
            }
            var blogId = blogdata.id;


            var blogCol = document.createElement('div');
            blogCol.classList.add('col', 'col-12', 'col-sm-12', 'col-md-12', 'col-lg-6', 'mb-5');

            var card = document.createElement('div');
            card.classList.add('card', 'border-0');
            card.style.cursor = 'pointer';
            card.id = 'blogCard' + blogId;

            var img = document.createElement('img');
            img.classList.add('card-img-top');
            img.src = data[i].img;
            img.style.height = "50%";
            img.style.width = "100%";

            var cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'p-0', 'mt-3');

            // var button = document.createElement('button');
            // button.classList.add('btn', 'btn-primary');
            // button.textContent = data[i].category;
            // button.style.borderRadius = "10%";
            var button = createChip(data[i].category);

            var cardData = document.createElement('div');
            cardData.classList.add('card-data', 'mt-2');
            cardData.innerHTML = `
                <span>${data[i].author} |</span>
                <span>${data[i].role} |</span>
                <span>${data[i].readTime}</span><br>
                <p style="margin-top: 10px;">${data[i].date}</p>
            `;
            var titleDescriptionDiv = document.createElement('div');

            var title = document.createElement('h5');
            title.classList.add('card-title', 'mt-3');
            title.textContent = data[i].heading;

            var content = document.createElement('p');
            content.classList.add('card-text');
            content.textContent = data[i].content;

            titleDescriptionDiv.appendChild(title);
            titleDescriptionDiv.appendChild(content);

            cardBody.appendChild(button);
            cardBody.appendChild(cardData);
            cardBody.appendChild(titleDescriptionDiv);

            card.appendChild(img);
            card.appendChild(cardBody);
            //immediately-invoked function expression (IIFE).
            (function (currentBlogId) {
                card.addEventListener('click', function () {
                    redirectToIndividualPage(currentBlogId);
                });
            })(blogId);

            blogCol.appendChild(card);
            
            blogRow.appendChild(blogCol);

            rowdiv.appendChild(blogRow);

            if (i == start + 1 && afterthird == true) {
                afterthird = false;
                var hrdiv = document.createElement('div');
                var hr = document.createElement('hr');
                hr.style.marginTop = "100px";
                hr.style.backgroundColor = "#333";
                hr.style.marginBottom = '50px';
                hrdiv.appendChild(hr);
                var trend = document.createElement('h3');
                trend.textContent = 'Trending Topics';
                hrdiv.appendChild(trend);
                rowdiv.appendChild(hrdiv);
                
            }                   
        }
     
    }
    function createChip(text) {
        var chip = document.createElement('button');
        chip.classList.add('chip', 'chip-outline', 'chip-input', 'rounded-pill', 'chip-sm');
        chip.textContent = text;
        chip.style.border = "1px solid #007bff";
        chip.style.backgroundColor = "transparent";
        chip.style.color = "#007bff";
        chip.style.textAlign = "center";
        chip.style.fontSize = '16px';
        chip.style.padding = "7px 12px";
        return chip;
    }
    blogContainer.appendChild(rowdiv);
    blogsdisplay(start, noofblogs);
    //show more button
    var btndiv = document.createElement('div');
    btndiv.classList.add('text-center', 'm-5');

    var showmorebtn = document.createElement('button');
    showmorebtn.classList.add('btn', 'btn-primary');
    showmorebtn.textContent = 'SHOW MORE';
    showmorebtn.addEventListener('click', function () {
        start += noofblogs;
        blogsdisplay(start-1, start+noofblogs-1);
        if (start >= data.length) {
            showmorebtn.style.display = 'none';
            
        }
    })

    btndiv.appendChild(showmorebtn);
    blogContainer.appendChild(btndiv);

}
// Function to redirect to individual blog page
function redirectToIndividualPage(blogId) {
    window.location.href = 'individual.html?id=' + blogId;
}
