//IMPORTANT VARIABLES
const urls=[
    'https://randomuser.me/api/?results=12'// By using '/?results=12', I can get 12 results and not use a for loop.
];
const gallery=document.getElementById('gallery');
const searchContainer=document.getElementById('search-container');
const searchBar = `
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;

var modalContainer=document.createElement("div");  
var modal=document.createElement("div"); 
var close_btn=document.createElement("BUTTON");
var modal_info=document.createElement("div");
var modal_traversal=document.createElement("div");
var prev_btn=document.createElement("BUTTON");
var next_btn=document.createElement("BUTTON");
var search_field=document.createElement("form");
var search_bar=document.createElement("input");
var search_btn=document.createElement("input");

//IMMEDIATELY RUN THIS CODE

Promise.all(urls.map(url =>
    fetchData(url)
));

modalContainer.setAttribute('class','modal-container');
modal.setAttribute('class','modal');
modal_traversal.setAttribute('class', 'modal-btn-container');
modalContainer.appendChild(modal);
modalContainer.appendChild(modal_traversal);
close_btn.setAttribute('type','button');
close_btn.setAttribute('id','modal-close-btn');
close_btn.setAttribute('class','modal-close-btn');
close_btn.setAttribute('onclick', 'modalContainer.style.display = "none"');
close_btn.innerHTML = '<strong>X</strong>';
modal_info.setAttribute('class','modal-info-container');		
modal.appendChild(close_btn);
modal.appendChild(modal_info);
modalContainer.style.display = "none";
document.body.appendChild(modalContainer);
modal_traversal.setAttribute('class','modal-btn-container');
prev_btn.setAttribute('type','button');
next_btn.setAttribute('type','button');
prev_btn.setAttribute('id', 'modal-prev');
next_btn.setAttribute('id', 'modal-next');
prev_btn.setAttribute('class', 'modal-prev btn');
next_btn.setAttribute('class', 'modal-next btn');
prev_btn.textContent='Prev';
next_btn.textContent='Next';
modal_traversal.appendChild(prev_btn);
modal_traversal.appendChild(next_btn);
search_bar.setAttribute('type','search');
search_bar.setAttribute('id','search-input');
search_bar.setAttribute('class','search-input');
search_bar.setAttribute('placeholder','Search...');
search_btn.setAttribute('type','submit');
search_btn.setAttribute('value','Search');
search_btn.setAttribute('id','search-submit');
search_btn.setAttribute('class','search-submit');
search_field.setAttribute('action','#');
search_field.setAttribute('method','get');
search_field.appendChild(search_bar);
search_field.appendChild(search_btn);
searchContainer.appendChild(search_field);

//IMPORTANT FUNCTIONS

function fetchData(url){//Return Fetch Data
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => generateEmployeeList(data))
        .catch(error => console.log('looks like there was a problem', error));
}

function checkStatus(response){//Return Response Status
    if(response.ok){
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function generateEmployeeList(data){//Generate Employees
    let employees=data.results;
    for(let i=0;i<12;i++){
        let employee=employees[i];
		let card=document.createElement("div");
		let img=document.createElement("div");
        card.setAttribute('class','card');
		img.setAttribute('class','card-img-container');
        img.innerHTML = `<img class="card-img" src="${employee.picture.large}" alt="profile picture">`;

		let info=document.createElement("div");
        info.setAttribute('class','card-info-container');
        var html=`
            <h3 id="name" class="card-name cap">${employee.name.title} ${employee.name.first} ${employee.name.last}</h3>
            <p class="card-text">${employee.email}</p>
            <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
        `;
        info.innerHTML=html;
		card.appendChild(img);
		card.appendChild(info);
		card.addEventListener('click', function () {//Next/Prev Modal Event
		    modal_info.innerHTML = createModal(employee);
            modalContainer.style.display = "block";
            next_btn.onclick=next;
            prev_btn.onclick=prev;
            function next(){
                if(i<11){
                    i+=1;
                    modal_info.innerHTML = createModal(employees[i]);
                }
            }
            function prev(){
                if(i>0){
                    i-=1;
                    modal_info.innerHTML = createModal(employees[i]);
                }
            }
        });
        document.getElementById('search-input').addEventListener('keydown', (e)=>{//Dynamic Search Functionality -- Delete Handler
            if(e.keyCode==8){
                document.getElementById('search-input').value='';
                for(i=0; i<12; i++){
                    gallery.children[i].style.display='flex';
                }
            }
        });
        document.getElementById('search-input').addEventListener('input', (e)=>{//Dynamic Search Functionality -- Update Info
            var reg = new RegExp(e.target.value,"i");
            for(x=0; x<12; x++){
                let name=gallery.children[x];
                let searchName=name.textContent.search(reg);
                if(searchName===-1){
                    gallery.children[x].style.display='none';
                } else {
                    gallery.children[x].style.display='flex';
                }
            }
        });
        document.getElementById('search-submit').addEventListener('click', () => {//Dynamic Search Functionality -- Search Button
            var reg = new RegExp(document.getElementById('search-input').value,"i");
            for(x=0; x<12; i++){
                let name=gallery.children[x];
                let searchName = name.textContent.search(reg);
                if(searchName===-1){
                    gallery.children[x].style.display='none';
                } else {
                    gallery.children[x].style.display='flex';
                }
            }
        });
		gallery.appendChild(card);
	}
}

function createModal(employee){//Return HTML for Each Employee. Helps Simplify the Next and Prev Buttons.
    let d = new Date(employee.dob.date);
    let dob = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
    var html = `
        <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${employee.name.title} ${employee.name.first} ${employee.name.last}</h3>
        <p class="modal-text">${employee.email}</p>
        <p class="modal-text cap">${employee.location.city}</p>
        <hr>
        <p class="modal-text">${employee.phone}</p>
        <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state}, ${employee.location.postcode}</p>
        <p class="modal-text">Birthday:  ${dob}</p>
    `;
    return html;
}
