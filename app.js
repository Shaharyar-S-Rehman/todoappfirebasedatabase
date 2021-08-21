// signup = () => {
//     var username = document.getElementById("username")
//     var email = document.getElementById("email")
//     var password = document.getElementById("password")


//     firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
//         .then((res) => {
//             let user = {
//                 username: username.value,
//                 email: email.value,
//                 password: password.value

//             }
//             firebase.database().ref("users").set(user)
//                 .then((res) => {
//                     alert("signup successfuly")
//                     window.location = "login.html"
//                 })

//         })
//         .catch((err) => {
//             console.log("err=>", err)
//         })


//     console.log(username.value)
//     console.log(email.value)
//     console.log(password.value)

// }

// login = () => {

//     var email = document.getElementById("email")
//     var password = document.getElementById("password")

//     firebase.auth().signInWithEmailAndPassword(email.value, password.value)
//         .then((res) => {

//             firebase.database().ref(`users/${res.user.uid}`).once('value', (data) => {
//                 alert("data.val()")
//                 // window.location = "login.html"
//             })

//         })
//         .catch((err) => {
//             console.log('err=>', err)

//         })

//     console.log(email.value)
//     console.log(password.value)

// }


//----------------------signup------------------//
let signup = () => {
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((res) => {
            let user = {
                username: username.value,
                email: email.value,
                password: password.value
            }

            firebase.database().ref(`users/${res.user.uid}`).set(user)
                .then(() => {
                    alert("User register hogaya")
                    window.location = "login.html"
                })

        })
        .catch((err) => {
            alert("enter correct email",err)
        })
}
//-------------------------login---------------//

let login = () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)

    .then((res) => {
            firebase.database().ref(`users/${res.user.uid}`).once('value', (data) => {
                localStorage.setItem("userBio",data.val().username);
                // console.log(data.val())
                window.location.href="logout.html";
            })
        })
        .catch((err) => {
            alert("enter correct email and password",err)
        })

}
//-------------logout & todo--------------------//
let logout = () => {

    try {

        firebase.auth().signOut();
        alert("logout hogya")


    } catch (error) {
        console.log(error);
    }

}

//--------- additem------------------------//
const databio = () => {
    let list = document.getElementById("list");
    // document.getElementById("name").innerHTML=localStorage.getItem("userBio");
    let name=document.getElementById("name")
    let uname=localStorage.getItem("userBio");
    let firstChar = uname.slice(0,1);
    let otherChar = uname.slice(1);
    let frstChar = firstChar.toUpperCase();
    let othrChar = otherChar.toLowerCase();
    name.innerHTML=frstChar + othrChar;
    firebase.database().ref(`todolist`).on('child_added',(data)=>{
        var li = document.createElement("li")
        var liText = document.createTextNode(data.val().add_todo)
        li.appendChild(liText)
        //----------editbutton-----------//
        let editButton = document.createElement("i")
        editButton.setAttribute("class","fas iconedt fa-edit")
        editButton.setAttribute("id", data.val().key)
        editButton.setAttribute("onclick", "editItem(this)");
        li.appendChild(editButton)
        //----------deleteButton----------//
        let deleteButton = document.createElement("i")
        deleteButton.setAttribute("class","fas icondlt fa-trash-alt")
        deleteButton.setAttribute("id", data.val().key)
        deleteButton.setAttribute("onclick", "dltItem(this)");
        li.appendChild(deleteButton)
        // li.setAttribute()
        list.appendChild(li)
        // console.log("hy")
        // console.log(li)
        // console.log(list)
    })
}

//-----------additem------------//
const addItem = () => {
    let add_todo = document.getElementById("add_todo")
    if (add_todo.value.length<=0) {
        alert("please enter atleast one sentence")
    } else {
        var key=firebase.database().ref('todolist').push().key
        var todo={
            add_todo: add_todo.value,
            key: key
        }
        firebase.database().ref(`todolist/${key}`).set(todo)
        add_todo.value = " ";
    }
}

//------------all delete item---------------//

const deleteAll=(e)=>{
    list.innerHTML=" "
    firebase.database().ref("todolist").remove()
}

//---------------edit item------------------//
const editItem=(e)=>{
    var val =prompt("Enter update value",e.parentNode.firstChild.nodeValue);
      var editTodo={
        add_todo:val,
          key:e.id
      }
      firebase.database().ref("todolist").child(e.id).set(editTodo)
      e.parentNode.firstChild.nodeValue=val;
  }
//------------delete item-------------------//
  const dltItem=(e)=>{
    firebase.database().ref(`todolist`).child(e.id).remove();
    e.parentNode.remove();
  }