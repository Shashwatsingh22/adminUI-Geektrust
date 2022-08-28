const apiUrl = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"


//This Array will act like our DataBase
let userData = [];

//Function will help us to make the get request on url and abl to fetch the data
const getData = async() => {
	try{
		let response = await fetch(apiUrl);
	   
		if(response.status===200){
		   const data= await response.json();
		   userData=data;
		}

		else
		{
		   console.log("Some Error Caused 😩 while featching the Data");
		}
	}
	catch(err)
	{
		console.log("Some Error Caused 😩",err);
	}
}

//For Changing the Properties of Button according to the Page Number
const putLimitOnBtn=()=>{
	//For Changing the Properties of Buttons
	let toFirstPageBtn=document.querySelector("#toFirstPage")
	let toLastPageBtn=document.querySelector("#toLastPage")
	let backBtn = document.querySelector("#prevFunc")
	let nextBtn = document.querySelector("#nextFunc")

	if(currentPage==1) 
	{
		//Disable it
		toFirstPageBtn.disabled=true;
		//Changing the color to Grey
		toFirstPageBtn.classList.add("btn-secondary");

		backBtn.disabled=true;
		backBtn.classList.add("btn-secondary");
	}
	else if(currentPage>1)
	{
		toFirstPageBtn.disabled=false;
		toFirstPageBtn.classList.remove("btn-secondary");
		backBtn.disabled=false;
		backBtn.classList.remove("btn-secondary");
	}

	if(currentPage==totalPage())
	{
		toLastPageBtn.disabled=true;
		toLastPageBtn.classList.add("btn-secondary");
		nextBtn.disabled=true;
		nextBtn.classList.add("btn-secondary");
	}

	if(currentPage<totalPage())
	{
		toLastPageBtn.disabled=false;
		toLastPageBtn.classList.remove("btn-secondary");
		nextBtn.disabled=false;
		nextBtn.classList.remove("btn-secondary");
	}
}

//Page Jumper
const pageJumper=()=>{
	//Now here I have written logic for showing boxes of pageJumper
	let pagesBtnNumSize=0; //Limitation for showing number of boxs (like once only 4 boxes allowed)

	//Forexample if we have data arround 46 then 5 pages required but at one page I am allowing only four
	//Boxes

	let pagesBtnNumCol="";
	let startPoint=currentPage>=5 ? currentPage : 1;
	
	let btnSize=Math.floor(userData.length/pageSize);
	let endPoint = userData.length > btnSize*pageSize ? btnSize+1 : btnSize;

	if(currentPage>=5) startPoint=currentPage;

	for(let pages=startPoint;pages<=endPoint;pages++)
	{
		if(pagesBtnNumSize<4)
		{
		if(currentPage==pages)
			pagesBtnNumCol+=`<li class="page-item active">
			<button class="page-link"  onclick=jumpTo(${(pages)})>${pages}</button>
		</li>`
		
		else 
			pagesBtnNumCol+=`<li class="page-item">
			<button class="page-link"  onclick=jumpTo(${(pages)})>${pages}</button>
		</li>`
		
		pagesBtnNumSize++;
		}

		else
		{
			pagesBtnNumSize=0;
		}
	}

	document.getElementById("pagesJumper").innerHTML=pagesBtnNumCol;
}

//Function prepare our complete page like -- table content (row) + pagination implement and 
//also we have implement the page jumper concept here

let pageSize = 10;
let currentPage = 1;

let isFetched = false;

async function viewTable()
{
	//get the data
	if(!isFetched)
	{
		isFetched=true;
		await getData()
	}

	//Set the Buttons Limitations
	putLimitOnBtn();
	
    let rows = "";
	if(userData.length)
	{
	//Now we will traverse to the array but we will follow the limitation also
	let begin=(currentPage-1)*pageSize;
	let end=currentPage*pageSize>userData.length ? userData.length : currentPage*pageSize;
	
	for(let user=begin;user<end;user++)
	{
		rows+="<tr>"
		rows+=`<td><input type="checkbox" class="form-check-input" id="exampleCheck1"></td>`
		rows+=`<td> ${(userData[user].name)} </td>`
		rows+=`<td> ${(userData[user].email)} </td>`
		rows+=`<td> ${(userData[user].role)} </td>`
		rows+=`<td>
		<button class="edit" title="Edit" data-toggle="tooltip"> ✏ </button>
		<button class="delete" id="delete" title="Delete" data-toggle="tooltip" onclick=deleteUserById(${(userData[user].id)})> 🗑️ </button></td>`
		"</tr>"
	}
    }

	else rows="<h3 class='d-flex justify-content-center'> No Record Found 😩</h3>";
	document.getElementById("data").innerHTML=rows;
    

pageJumper()
	
}
viewTable()

//Through this function we can move prevpage
const prevPage=()=>{
	if(currentPage>1)
		currentPage--;
	viewTable();
}
//For Moving to previous Page
document.querySelector("#prevFunc").addEventListener('click', prevPage);

const nextPage=()=>{
	if(currentPage*pageSize < userData.length) currentPage++;
	viewTable();
}
//For moving to next Page
document.querySelector("#nextFunc").addEventListener('click', nextPage);


const deleteUserById=(id)=>{
	let user=0
	
	for(user=0;user<userData.length;user++)
	{
		if(userData[user].id==id) break;
	}
   console.log(user);
   userData.splice(user,1);
   console.log(userData)
   viewTable();
}

const editUserById=(id,name,email,role)=>{
	userData.forEach(user=>{
		if(user.id==id)
		{
			user.name=name;
			user.email=email;
			user.role=role;
		}
	})
	viewTable();
}

//For Deleteing the Page
// document.querySelector("#delete").addEventListener('delete', deleteUserById,false);
const toFirstPage=()=>{
	currentPage=1;
	viewTable();
}
//Moving to FirstPage
document.querySelector("#toFirstPage").addEventListener('click',toFirstPage);

const jumpTo=(page)=>{
	currentPage=page;
	viewTable();
}

const totalPage=()=>{
	let totalPage = Math.floor(userData.length/pageSize);
	return userData.length> totalPage*pageSize? totalPage+1 : totalPage;
}

const toLastPage=()=>{
    currentPage=totalPage();
    viewTable();
}
//Moving to Last Page
document.querySelector("#toLastPage").addEventListener('click', toLastPage);