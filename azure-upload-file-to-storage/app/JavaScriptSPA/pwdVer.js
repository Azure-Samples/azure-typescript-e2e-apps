var loginPage = true;
var signUpPage = false;
var formValid = false;

//Get ID of the element
function $(id) {
  return document.getElementById(id);
}

function swapPage() {
  //If Remember Me Checkbox is checked, keep and handle the login page username with token (not username on client side)
  if ($('remember').checked) {
    $('username').value = $('username').value;
    //Store session token
  } else {
    $('username').value = '';
  }
  //Clear all other fields other than the username
  for (let i = 0; i < document.forms[0].length; i++) {
    if (document.forms[0][i].name != 'username') {
      document.forms[0][i].value = '';
    }
  }

  if (loginPage = true && (document.getElementById('signUp').style.display === '' || document.getElementById('signUp').style.display === 'none')) {
    loginPage = false;
    signUpPage = true;
    whichForm = 'signUp';
    document.getElementById('signIn').style.display = 'none';
    document.getElementById('signUp').style.display = 'block';
  } else {
    loginPage = true;
    signUpPage = false;
    whichForm = 'signIn';
    document.getElementById('signUp').style.display = 'none';
    document.getElementById('signIn').style.display = 'block';
  }
}

function validateMe() {
  //First index (i) is which form (login or sign-up) and second (j) is the form's element (the input text, checkbox, radio, etc.)   
  //document.forms[i][j].
  //alert(document.forms[0].length);
  //alert(document.forms.length);
  //alert(document.forms[0].parentElement.id);
  //For each / the number of forms on the page
  for (let i = 0; i < document.forms.length; i++) {
    //alert(document.forms[i].id);
    //alert(document.forms[i].parentElement.id);
    //Only check validation if the form's parent element (section) isn't hidden; If the form's section is not display do not check / do nothing
    if (document.forms[i].parentElement.style.display === '' || document.forms[i].parentElement.style.display == 'none') {

    } else { //If form section is displayed and not hidden, for the size of the form(s)
        for (let j = 0; j < document.forms[i].length; j++) {
          //if(document.getElementById(''))
          //If the form element type is a password, email or username field(s) (in either the Login or sign-up pages), the input is required or the form will not submit
          if (document.forms[i].elements[j].type === 'password' || document.forms[i][j].name === 'email' || document.forms[i][j].name === 'username') {
            //Throw error if any of the required fields are missing on the displayed (non-hidden) form/form's fields and do not submit (to server)
            if (document.forms[i][j].value === '') {
                alert('Please enter ' + document.forms[i][j].placeholder);
                document.forms[i][j].style.background = 'red';
                //return false;
            } else { //If not blank, check these other conditions
                document.forms[i][j].style.background = 'white';
                document.getElementById('confirmPwd').style.background = 'white';
                if (document.forms[i].elements[j].type === 'password') {
                  if (document.forms[i][j].value.length < 8) {
                    alert(document.forms[i][j].type + ' is not long enough. Must be 8 or more characters.');
                    document.forms[i][j].style.background = 'yellow';
                    return false;
                  } 
                  //If sign-up form, if the two passwords fields don't match throw error
                  if (document.forms[i].id == 'sign-up' && document.getElementById("inputPwd").value != document.getElementById('confirmPwd').value) {     
                    alert('The passwords do not match.');
                    document.forms[i][j].style.background = 'orange';
                    document.getElementById('confirmPwd').style.background = 'orange';
                    return false;
                  }
                  if (/[A-Z]/.test(document.forms[i][j].value) === false) {
                    alert('Password must contain a capital letter.');
                    document.forms[i][j].style.background = 'yellow';
                  }
                  if (/[a-z]/.test(document.forms[i][j].value) === false) {
                    alert('Password must contain one lowercase letter.');
                    document.forms[i][j].style.background = 'yellow';
                  }
                  if (/[0-9]/.test(document.forms[i][j].value) === false) {
                    alert('Password must contain at least one number');
                    document.forms[i][j].style.background = 'yellow';
                  }
                  if (/[!@#$%^&]/.test(document.forms[i][j].value) === false) {
                    alert('Password must contain at least one symbol: !@#$%^&');
                    document.forms[i][j].style.background = 'yellow';
                  } else {
                      alert("Success!");
                      document.getElementById("create-acc").style.background = '#32CD32';
                      document.getElementById("signIn-btn").style.background = '#32CD32';
                      document.getElementById("signOut").style.background = 'salmon';
                      signIn();
                      return true;
                  }
                }
            }
          } 
        }
      }
  }  
}