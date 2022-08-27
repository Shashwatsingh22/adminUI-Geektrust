const apiUrl = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"

//This Map will act like our DataBase which also help speed up in deleting , searching and editing
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

//Function prepare our complete page like -- table content (row) + pagination implement and 
//also we have implement the page jumper concept here

let pageSize = 10;
let currentPage = 1;

async function viewTable(currentPage)
{
	//get the data
	await getData();
	let rows = "";

	//Now we will traverse to the array but we will follow the limitation also

	let begin=(currentPage-1)*pageSize;
	let end=currentPage*pageSize;

	for(let user=begin;user<end;user++)
	{
		rows+="<tr>"
		rows+=`<td><input type="checkbox" class="form-check-input" id="exampleCheck1"></td>`
		rows+=`<td> ${(userData[user].name)} </td>`
		rows+=`<td> ${(userData[user].email)} </td>`
		rows+=`<td> ${(userData[user].role)} </td>`
		rows+=`<td>
		<button class="edit" title="Edit" data-toggle="tooltip"> ✏ </button>
		<button class="delete" id="delete" title="Delete" data-toggle="tooltip"> 🗑️ </button>
	</td>`
		"</tr>"
	}
	document.getElementById("data").innerHTML=rows;
    
	//Now here I have written logic for showing boxes of pageJumper
	let pagesBtnNumSize=0; //Limitation for showing number of boxe (like once only 4 boxes allowed)

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
			<button class="page-link" >${pages}</button>
		</li>`
		
		else 
			pagesBtnNumCol+=`<li class="page-item">
			<button class="page-link" >${pages}</button>
		</li>`
		
		pagesBtnNumSize++;
		}
		else
		{
			pagesBtnNumSize=0;
		}
	}

	document.getElementById("pagesJumper").innerHTML=pagesBtnNumCol;
	console.log(userData.length)
}

viewTable(1)

const prevPage = () => {
	if(currentPage>1)
		currentPage--;
	
	viewTable(currentPage);
}

const nextPage=()=>{
	if(currentPage*pageSize < userData.length) currentPage++;

	viewTable(currentPage);
}

const deleteUserById=(id)=>{
   userData.forEach(user=>{
        if(user.id==id) delete user;

   })

   viewTable(currentPage);
}



//For Moving to previous Page
document.querySelector("#prevFunc").addEventListener('click', prevPage,false);
//For moving to next Page
document.querySelector("#nextFunc").addEventListener('click', nextPage,false);

//For Deleteing the Page
// document.querySelector("#delete").addEventListener('delete', deleteUserById,false);