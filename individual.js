// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Show the spinner
    showSpinner();
    setTimeout(function () {
        hideSpinner();

        console.log("Content loaded!");
    }, 500); 
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

// Extracting the blog ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const blogId = parseInt(urlParams.get("id"));
var blog;
var allBlogsData;
// Fetching data from the JSON file
fetch('blog.json')
    .then(response => response.json())
    .then(data => {
        allBlogsData = data;
        console.log('fetched data:', data);
        console.log('blog id: ', blogId);
        blog = data.find(blog => blog.id === blogId);
        console.log('selected blog:', blog);
        if (blog) {
            console.log('loading blogs');
            loadBlogs(blog, 'blogContainer');
            activeLink(blog.category);
        } else {
            console.error('blog not found for id', blogId);
        }
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to load the blog content into the specified container
function loadBlogs(blog, containerId) {
    var container = document.getElementById(containerId);
    if (!container) {
        console.error('Container element not found:', containerId);
        return;
    }
    
    // Clearing the container
    container.innerHTML = '';
    
    var backArrow = createBackArrow();
    container.appendChild(backArrow);

    var blogContainer = createBlogContainer(blog);
    container.appendChild(blogContainer);

    var hrDivider = createDivider();
    blogContainer.appendChild(hrDivider);

    var relatedHead = createRelatedHead();
    blogContainer.appendChild(relatedHead);

    var rowDiv = createRowDiv();
    loadRelatedBlogs(blog.category, rowDiv);

    container.appendChild(rowDiv);
}

function createBackArrow() {
    var backArrow = document.createElement('div');
    backArrow.classList.add('backArrow', 'd-flex', 'mb-3');
    backArrow.style.cursor = 'pointer';

    var backImg = document.createElement('img');
    backImg.src = 'images/backarrow.png';
    backImg.style.height = "25px";
    backArrow.appendChild(backImg);

    var backP = document.createElement('p');
    backP.classList.add('m-0');
    backP.textContent = 'Back';
    backArrow.appendChild(backP);

    backArrow.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    return backArrow;
}

function createBlogContainer(blog) {
    var blogContainer = document.createElement('div');
    blogContainer.classList.add('blog-container', 'mt-3');

    var head = document.createElement('h1');
    head.textContent = blog.heading;
    blogContainer.appendChild(head);

    var dataDiv = createDataDiv(blog);
    blogContainer.appendChild(dataDiv);

    var cardContainer = createCardContainer(blog);
    blogContainer.appendChild(cardContainer);

    return blogContainer;
}

function createDataDiv(blog) {
    var dataDiv = document.createElement('div');
    dataDiv.classList.add('d-inline-flex', 'flex-wrap', 'my-2');

    var profileImgDiv = createProfileImgDiv(blog);
    dataDiv.appendChild(profileImgDiv);

    var pInfoDiv = createPInfoDiv(blog);
    dataDiv.appendChild(pInfoDiv);

    var imgDiv = createImgDiv();
    dataDiv.appendChild(imgDiv);

    var sliderDiv = createSliderDiv();
    dataDiv.appendChild(sliderDiv);

    return dataDiv;
}

function createProfileImgDiv(blog) {
    var profileImgDiv = document.createElement('div');
    var profileImage = document.createElement('img');
    profileImage.src = blog.profileimg;
    profileImage.classList.add('m-3');
    profileImage.style.borderRadius = '50%';
    profileImgDiv.appendChild(profileImage);
    return profileImgDiv;
}

function createPInfoDiv(blog) {
    var pInfoDiv = document.createElement('div');
    var authorPara = document.createElement('p');
    authorPara.textContent = `${blog.author} | ${blog.role}`;
    var dateReadPara = document.createElement('p');
    dateReadPara.textContent = `${blog.date} | ${blog.readTime}`;
    pInfoDiv.appendChild(authorPara);
    pInfoDiv.appendChild(dateReadPara);
    return pInfoDiv;
}

function createImgDiv() {
    var imgDiv = document.createElement('div');
    imgDiv.style.position = 'relative';
    imgDiv.style.display = 'inline-block';
    const shareImage = document.createElement('img');
    shareImage.src = 'images/share.png';
    shareImage.classList.add('mx-3', 'my-3');
    shareImage.style.opacity = '0.6';
    shareImage.style.cursor = 'pointer';
    imgDiv.appendChild(shareImage);
    var dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('dropdown-menu');
    dropdownMenu.style.display = 'none';
    dropdownMenu.style.position = 'absolute';
    dropdownMenu.style.overflow = 'auto';
    dropdownMenu.style.padding = '5px';
    dropdownMenu.style.zIndex = '1';
    dropdownMenu.style.top = (shareImage.offsetHeight+50) + 'px';
    
    var whatsapp = createItem('whatsapp');
    var facebook = createItem('facebook');
    var instagram = createItem('instagram');
    var twitter = createItem('twitter');

    dropdownMenu.appendChild(whatsapp);
    dropdownMenu.appendChild(facebook);
    dropdownMenu.appendChild(instagram);
    dropdownMenu.appendChild(twitter);

    imgDiv.appendChild(dropdownMenu);
    shareImage.addEventListener('click', function () {
        if (dropdownMenu.style.display === 'none') {
            dropdownMenu.style.display = 'block';
            shareImage.style.opacity = '1';
        } else {
            dropdownMenu.style.display = 'none';
            shareImage.style.opacity = '0.6';
        }
        
    });
    window.addEventListener('click', function (event) {
        if (!imgDiv.contains(event.target)) {
            dropdownMenu.style.display = 'none';
            shareImage.style.opacity = '0.6';
        }
    });
    
    return imgDiv;
}
function createItem(text) {
    var dropItem = document.createElement('a');
    dropItem.textContent = text;
    dropItem.style.display = 'block';
    dropItem.style.padding = '5px';
    dropItem.style.textDecoration = 'none';
    dropItem.style.color = '#333';
    dropItem.style.cursor = 'pointer';

    dropItem.addEventListener('mouseenter', function () {
        dropItem.style.backgroundColor = '#ddd';
    });
    dropItem.addEventListener('mouseleave', function () {
        dropItem.style.backgroundColor = '';
    });
    dropItem.addEventListener('click', function () {
        var imageSource = '/images/source.png'; 

        switch (text.toLowerCase()) {
            case 'whatsapp':
                var whatsappShareLink = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(imageSource);
                window.open(whatsappShareLink, '_blank');
                break;

            case 'facebook':
                var facebookShareLink = 'https://api.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(imageSource);
                window.open(facebookShareLink, '_blank');
                break;

            case 'instagram':
                var instagramShareLink = 'https://www.instagram.com/';
                window.open(instagramShareLink, '_blank');
                break;

            case 'twitter':
                var twitterShareLink = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(imageSource);
                window.open(twitterShareLink, '_blank');
                break;

            default:
                break;
        }
    });


    return dropItem;
}
function createSliderDiv() {
    var sliderDiv = document.createElement('div');
    
    var slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'fontrange';
    slider.min = '1';
    slider.max = '4';
    slider.step = '1';
    slider.value = '1';
    slider.classList.add('custom-range', 'mx-2', 'mt-3','thin-slider');
    slider.addEventListener('input', function() {
        var sliderValue = slider.value;

        updateDescriptionTextSize(sliderValue *5);
    });

    
    sliderDiv.appendChild(slider);

    return sliderDiv;
}
function updateDescriptionTextSize(size) {
    var descriptionText = document.querySelector('.description-text');
    
    // Updating the font size of the description text
    descriptionText.style.fontSize = (parseFloat(size)+10) + 'px';
}


function createCardContainer(blog) {
    var cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container', 'mt-1');
    cardContainer.style.marginBottom = "10%";

    var card = createCard(blog);
    cardContainer.appendChild(card);

    var cardBody = createCardBody(blog);
    cardContainer.appendChild(cardBody);

    return cardContainer;
}

function createCard(blog) {
    var card = document.createElement('div');
    card.classList.add('card', 'border-0');
    card.style.cursor = 'pointer';

    var cardImg = createCardImg(blog);
    card.appendChild(cardImg);

    return card;
}

function createCardImg(blog) {
    var cardImg = document.createElement('img');
    cardImg.classList.add('card-img-top');
    cardImg.style.height = '100%';
    cardImg.style.width = '100%';
    cardImg.src = blog.img;

    return cardImg;
}

function createCardBody(blog) {
    var cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'p-0', 'mt-3');

    var cardBtn = createCardBtn(blog);
    cardBody.appendChild(cardBtn);

    var cardP = createCardP(blog);
    cardBody.appendChild(cardP);

    var cardTitle = createCardTitle(blog);
    cardBody.appendChild(cardTitle);

    var cardDescription = createCardDescription(blog);
    cardBody.appendChild(cardDescription);

    return cardBody;
}

function createCardBtn(blog) {
    var chip = document.createElement('button');
    chip.classList.add('chip', 'chip-outline', 'chip-input', 'rounded-pill', 'chip-sm','mx-3');
    chip.style.border = "1px solid #007bff";
    chip.style.backgroundColor = "transparent";
    chip.style.color = "#007bff";
    chip.style.textAlign = "center";
    chip.style.padding = '7px 12px';
    chip.style.fontSize = '16px';
    chip.style.float = 'right';
    chip.textContent = blog.category;
    return chip;
}

function createCardP(blog) {
    var cardP = document.createElement('p');
    cardP.classList.add('card-text');
    cardP.textContent = blog.content;
    return cardP;
}

function createCardTitle(blog) {
    var cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title', 'mt-3');
    cardTitle.textContent = blog.cardtitle;
    return cardTitle;
}

function createCardDescription(blog) {
    var cardDescription = document.createElement('p');
    cardDescription.classList.add('card-text', 'description-text');
    cardDescription.textContent = blog.description;
    return cardDescription;
}

function createDivider() {
    var divHr = document.createElement('hr');
    divHr.classList.add('my-3');
    divHr.style.backgroundColor = '#333';
    return divHr;
}

function createRelatedHead() {
    var relatedHead = document.createElement('h3');
    relatedHead.classList.add('text-center');
    relatedHead.style.marginTop = '8%';
    relatedHead.textContent = 'Related Posts';
    return relatedHead;
}

function createRowDiv() {
    var rowDiv = document.createElement('div');
    rowDiv.classList.add('row', 'mt-5');
    return rowDiv;
}

function loadRelatedBlogs(category, rowDiv) {
    var relatedBlogs = allBlogsData.filter(blog => blog.category === category && blog.id !== blogId);
    shuffleArray(relatedBlogs);
    relatedBlogs.slice(0, 2).forEach(blog => {
        loadRelatedBlog(blog, rowDiv);
    });
}

function loadRelatedBlog(blog, rowDiv) {
    var colDiv = createColDiv();
    var card = createCard(blog);
    var cardBody = createCardBody(blog);
    card.appendChild(cardBody); // Append the card body to the card
    colDiv.appendChild(card);
    rowDiv.appendChild(colDiv);
}


function createColDiv() {
    var colDiv = document.createElement('div');
    colDiv.classList.add('col', 'col-12', 'col-sm-12', 'col-md-12', 'col-lg-6', 'mb-5');
    return colDiv;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function activeLink(category) {
    var links = document.querySelectorAll('.navbar-nav .nav-link');
    
    links.forEach(navlink => {
        if (navlink.textContent.trim().toLowerCase() === category.toLowerCase()) {
            navlink.classList.add('active'); 
        } else {
            navlink.classList.remove('active'); 
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
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
