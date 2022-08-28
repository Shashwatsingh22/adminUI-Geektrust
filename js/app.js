const apiUrl = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
// Define Head Selector For Selecting items
const headSelector=document.querySelector(".headSelector");
//This Array will act like our DataBase
let userData = [];

//This Section is for the filltered Item
let filteredData=[];
let searchString="";
let byFilter=false;

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
    if(currentPage==totalPage(byFilter))
	{
		toLastPageBtn.disabled=true;
		toLastPageBtn.classList.add("btn-secondary");
		nextBtn.disabled=true;
		nextBtn.classList.add("btn-secondary");
	}

	if(currentPage<totalPage(byFilter))
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
	let dataBase=[];
	if(byFilter) dataBase=filteredData;
	else dataBase=userData;

	let pagesBtnNumCol="";
	let startPoint=currentPage>=5 ? currentPage : 1;
	
	let btnSize=Math.floor(dataBase.length/pageSize);
	let endPoint = dataBase.length > btnSize*pageSize ? btnSize+1 : btnSize;

	if(currentPage>=5) startPoint=currentPage;

	for(let pages=startPoint;pages<=endPoint;pages++)
	{
		if(pagesBtnNumSize<4)
		{
		if(currentPage==pages)
			pagesBtnNumCol+=`<li class="page-item active">
			<button class="page-link"  onclick=jumpTo(${(pages)})> ${pages} </button>
		</li>`
		
		else 
			pagesBtnNumCol+=`<li class="page-item">
			<button class="page-link"  onclick=jumpTo(${(pages)})> ${pages} </button>
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

	let dataBase=[];

	if(byFilter)
	{
		dataBase=filteredData;
		
	}
	else dataBase=userData;

	//Set the Buttons Limitations
	putLimitOnBtn();
	
    let rows = "";
	if(dataBase.length)
	{
	//Now we will traverse to the array but we will follow the limitation also
	let begin=(currentPage-1)*pageSize;
	let end=currentPage*pageSize>dataBase.length ? dataBase.length : currentPage*pageSize;
	
	for(let user=begin;user<end;user++)
	{
		rows+="<tr class='trs'>"
		rows+=`<td><input type="checkbox" class="form-check-input inputs" onchange='singleInputSelected(event,${dataBase[user].id})' id="exampleCheck1" key=${dataBase[user].id}></td>`
		rows+=`<td > ${(dataBase[user].name)} </td>`
		rows+=`<td> ${(dataBase[user].email)} </td>`
		rows+=`<td> ${(dataBase[user].role)} </td>`
		rows+=`<td>
		<button class="edit" onclick=doEditing(event,${dataBase[user].id})  title="Edit" data-toggle="tooltip"> ✏ Edit </button>
		<button class="delete" id="delete" title="Delete" data-toggle="tooltip" onclick=deleteUserById(${(dataBase[user].id)})> 🗑️ Delete </button></td>`
		"</tr>"
	}
    }

	else rows="<h3 class='d-flex justify-content-center'> No Record Found 😩</h3>";
	document.getElementById("data").innerHTML=rows;

	pageJumper()
	if(headSelector.checked) headSelector.checked=false;
}
viewTable()

 

 // Do Editing Function Define
 let isClicked=1;
 const doEditing=(event,id)=>{

	isClicked+=1;
	if(isClicked%2==0){
		// Set Editable true
		event.target.innerHTML="💾 Save"
		const childs=event.path[2].children;
		for(let i=1;i<childs.length-1;i++){
			childs[i].setAttribute("contenteditable",true);
			childs[i].style.backgroundColor="lightgray";
		}
	}
	else{
		let name="",email="",role="";
		// Set Editable False
		event.target.innerHTML="✏ Edit"
		event.target.style.opacity="1";
		const childs=event.path[2].children;
		for(let i=1;i<childs.length-1;i++){
			childs[i].removeAttribute("contenteditable");
			childs[i].style.backgroundColor="white"
			switch(i){
				case 1:
					name=childs[i].innerText;
					break;
				case 2:
					email=childs[i].innerText;
					break;
				case 3:
					role=childs[i].innerText;
					break;
				default:
					break;
			}
		}
		editUserById(id,name,email,role);
	}

 }

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
   userData.splice(user,1);
   if(byFilter) resetFilteredArr()
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
	//Reseting the Filter Array if this call come after filtering
	if(byFilter) resetFilteredArr()
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
	let dataBase=[]
	if(byFilter) dataBase=filteredData;
	else dataBase=userData;

	let totalPage = Math.floor(dataBase.length/pageSize);
	return dataBase.length> totalPage*pageSize? totalPage+1 : totalPage;
}

const toLastPage=()=>{
    currentPage=totalPage();
    viewTable();
}
//Moving to Last Page
document.querySelector("#toLastPage").addEventListener('click', toLastPage);

let toDeleteId=[]
let clickOnMainCheckBox=1;
let isDelete=0;
//For Selecting All
const selectAll =()=>{
    clickOnMainCheckBox++;
	if(clickOnMainCheckBox%2==0)
	{
		isDelete=1;
		const allInputs=document.querySelectorAll(".inputs");
		allInputs.forEach((input)=>{
			toDeleteId.push(+input.getAttribute("key"));
			input.checked=true;
		})
	}
	else{
		clickOnMainCheckBox=1;
		isDelete=0;
		const allInputs=document.querySelectorAll(".inputs");
		allInputs.forEach((input)=>{
			toDeleteId.splice(+input.getAttribute("key"),1);
			input.checked=false;
		})
	}
}

const deleteSlectedUser=()=>{
	if(currentPage==totalPage()) currentPage--;
	
	// if(isDelete)
	// {
	clickOnMainCheckBox=1;
	toDeleteId.forEach(id=>{
		userData.forEach(user=>{
			if(user.id==id)
			{   
				userData.splice(userData.indexOf(user),1);
			}
		})
	})
	
	toDeleteId.splice(0,toDeleteId.length)
	resetFilteredArr();
	viewTable();
//    }
}

const singleInputSelected=(event,id)=>{
	if(event.target.checked){
		// Add
		toDeleteId.push(id)
	}
	else{
		// 
		let targetIndex=toDeleteId.indexOf(id)
		toDeleteId.splice(targetIndex,1)
		}		
		//console.log(toDeleteId)
}

const searchItem=(e)=>{
	currentPage=1;
	byFilter=true
	filteredData.splice(0,filteredData.length)
	searchString=e.target.value.toLowerCase();
	let resultant=userData.filter(data=>{

		let fullName=data.name.toLowerCase();
		let nameArr=fullName.split(" ");
		return data.role.toLowerCase().search(searchString)!=-1||data.email.toLowerCase().search(searchString)!=-1||fullName.search(searchString)!=-1||nameArr[0]==searchString||nameArr[1]==searchString||fullName==searchString||data.role.toLowerCase()==searchString||data.email.toLowerCase()==searchString;
	});
	filteredData.push(...resultant);
	viewTable();
}

const resetFilteredArr=()=>
{
	currentPage=1;
	filteredData.splice(0,filteredData.length)
	let resultant=userData.filter(data=>{
		let fullName=data.name.toLowerCase();
		let nameArr=fullName.split(" ");
		return data.role.toLowerCase().search(searchString)!=-1||data.email.toLowerCase().search(searchString)!=-1||fullName.search(searchString)!=-1||nameArr[0]==searchString||nameArr[1]==searchString||fullName==searchString||data.role.toLowerCase()==searchString||data.email.toLowerCase()==searchString;
	});
	filteredData.push(...resultant);

}