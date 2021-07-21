window.maxLengthCheck = function (object) {
    
    if (Number(object.value) > Number(object.max)){
        //console.log(object.value,object.max);
        alert("Please Enter correct " + object.placeholder + " value") ;
        object.value = "";
    }
        
}

window.isNumeric = function (evt) {
    //console.log("isNumeric");
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

window.isMoreThan = function(evt) {
    //console.log("isMoreThan");
    var theEvent = evt || window.event;
    var target = theEvent.target;
    var keyID = event.keyCode;
    var isDelete = false;
    switch (keyID) {
        case 8:
            isDelete = true;
            // alert("backspace");
            break;
        case 46:
            isDelete = true;
            // alert("delete");
            break;
        default:
            break;
    }

    if (!isDelete && target.value.length == target.max.length) {
        return false;
    }
}

function loadData(){
    let myList = localStorage.getItem("list");
    if(myList != null){
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item =>{

            // create a todo
            let todo = document.createElement("div");
            todo.classList.add("todo");

            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = item.todoText;

            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = item.todoMonth + "/" + item.todoDate;

            todo.appendChild(text);
            todo.appendChild(time);
    
            // create green check and red trah on
            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = '<i class="fas fa-check"></i>';
            completeButton.addEventListener("click",e =>{
                //console.log(e.target);
                //console.log(e.target.parentElement);
                let todoItem = e.target.parentElement;
                //todoItem.classList.add("done");
                todoItem.classList.toggle("done");
            });

            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<i class="fas fa-trash"></i>';
            trashButton.addEventListener("click",e =>{
                let todoItem = e.target.parentElement;
                console.log(todoItem);
        
                
                /*
                    當animation結束後,
                    刪掉自己
                */
                todoItem.addEventListener("animationend",() =>{
                    todoItem.remove();

                    // remove from local storage
                    let text = todoItem.children[0].innerText;
                    let local_storage_array = JSON.parse(localStorage.getItem("list"));
                    local_storage_array.forEach((item,index) =>{
                        if(item.todoText == text){
                            local_storage_array.splice(index,1);
                            localStorage.setItem("list",JSON.stringify(local_storage_array));
                        }
                    });
                });
                todoItem.style.animation = "scaleDown 0.3s forwards";
            });
        
            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            section.appendChild(todo);
        })
    }
}

function mergeTime(arr1,arr2){
    let result = [];
    let i = 0,j = 0;

    while( i < arr1.length && j < arr2.length){
        if(Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)){
            result.push(arr2[j]);
            j++;
        }
        else if(Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)){
            result.push(arr1[i]);
            i++;
        }
        else if(Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)){
            if(Number(arr1[i].todoDate) > Number(arr2[j].todoDate)){
                result.push(arr2[j]);
                j++;
            }
            else{
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while( i < arr1.length){
        result.push(arr1[i]);
        i++;
    }
    while( j < arr2.length){
        result.push(arr2[j]);
        j++;
    }

    return result;
}

function mergeSort(arr){
    if(arr.length === 1){
        return arr;
    }
    else{
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0,middle);
        let left =  arr.slice(middle,arr.length);
        return mergeTime(mergeSort(right),mergeSort(left));
    }
}

//console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));


let add = document.querySelector("form button");
let section = document.querySelector("section");
let sortButton = document.querySelector("div.sort button");
let title = document.querySelector("header h1");

let local_storage_user_name = localStorage.getItem("user_name");
if(local_storage_user_name == null){
    let name = prompt("Please Enter your name");
    if(name){ 
        //用户填写了内容并且点击的是“确定” 
        title.innerText = name + "'s Todo List";
        localStorage.setItem("user_name",name);
    }else if(name === ""){ 
        //用户没有输入内容点击的“确定” 
    }else{ 
        //点击的是“取消” 
    }
}
else{
    title.innerText = local_storage_user_name + "'s Todo List";
}



loadData();

add.addEventListener("click",e =>{
    // prevent form from being subimtted
    e.preventDefault();

    // get the input values
    /*
        e.target.parentElement:
        <form>
            <input type="text">
            <input type="number" min="1" max="12"  placeholder="Month" 
            onkeypress="return isNumeric(event)" onkeydown="return isMoreThan(event)" oninput="maxLengthCheck(this)" 
            required>
            <input type="number" min="1" max="31" placeholder="Date" 
            onkeypress="return isNumeric(event)" onkeydown="return isMoreThan(event)" oninput="maxLengthCheck(this)" 
            required>
            <button type="submit">Add into List</button>
        </form>
    */
    //console.log(e.target.parentElement);
    let form = e.target.parentElement;
    
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;
    //console.log(typeof todoMonth);
    //console.log(todoText + " " + todoMonth + " " + todoDate);

    if(todoText === ""){
        alert("Please Enter some text");
        return;
    }

    // create a todo
    let todo = document.createElement("div");
    todo.classList.add("todo");

    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;

    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + "/" + todoDate;

    todo.appendChild(text);
    todo.appendChild(time);

    // create green check and red trah on
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.addEventListener("click",e =>{
        //console.log(e.target);
        //console.log(e.target.parentElement);
        let todoItem = e.target.parentElement;
        //todoItem.classList.add("done");
        todoItem.classList.toggle("done");
    });

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.addEventListener("click",e =>{
        let todoItem = e.target.parentElement;

        
        /*
            當animation結束後,
            刪掉自己
        */
        todoItem.addEventListener("animationend",() =>{
            todoItem.remove();

            // remove from local storage
            let text = todoItem.children[0].innerText;
            let local_storage_array = JSON.parse(localStorage.getItem("list"));
            local_storage_array.forEach((item,index) =>{
                if(item.todoText == text){
                    local_storage_array.splice(index,1);
                    localStorage.setItem("list",JSON.stringify(local_storage_array));
                }
            });
        });
        todoItem.style.animation = "scaleDown 0.3s forwards";
    });

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.3s forwards";

    
    // create an object
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate:todoDate
    };
    
    // store data into an array of objects
    let myList = localStorage.getItem("list");
    if(myList == null){
        localStorage.setItem("list",JSON.stringify([myTodo]));
    }else{
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list",JSON.stringify(myListArray));
    }

    //console.log(JSON.parse(localStorage.getItem("list")));
    
    form.children[0].value = ""; // clear the text input
    section.appendChild(todo);

});



sortButton.addEventListener("click",() =>{
    if(section.children.length == 0)
        return;
    
    // sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list",JSON.stringify(sortedArray));


    // remove data
    let len = section.children.length;
    for(let i = 0; i < len; i++){
        section.children[0].remove();
    }

    // load data
    loadData();
});
