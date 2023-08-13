<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>Quickstart | MSAL.JS Vanilla JavaScript SPA</title>

    <!-- msal.js with a fallback to backup CDN -->
    <script src="https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.js"
      integrity="sha384-o4ufwq3oKqc7IoCcR08YtZXmgOljhTggRwxP2CLbSqeXGtitAxwYaUln/05nJjit"
      crossorigin="anonymous"></script> 
    <script type="text/javascript" src="https://alcdn.msftauth.net/lib/1.2.1/js/msal.js" integrity="sha384-9TV1245fz+BaI+VvCjMYL0YDMElLBwNS84v3mY57pXNOt6xcUYch2QLImaTahcOP" crossorigin="anonymous"></script>

    <!-- adding Bootstrap 4 for UI components  -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">

    <!-----------------------------------------------------------  JavaScript STARTS HERE  -------------------------------->
    <script>
      var loginPage = true;
      var signUpPage = false;

        //Get ID of the element
      function $(id) {
			  return document.getElementById(id);
	    }

      function swapPage() {
        //If Remember Me Checkbox is checked, keep and handle the login page username with token (not username on client side)
        if($('remember').checked) {
          $('username').value = $('username').value;
          //Store session token
        } else {
          $('username').value = '';
        }
        //Clear all other fields other than the username
        for (let i=0;i<document.forms[0].length;i++) {
          if(document.forms[0][i].name != 'username') {
            document.forms[0][i].value = '';
          }
        }

        if(loginPage = true && (document.getElementById('signUp').style.display === '' || document.getElementById('signUp').style.display == 'none')) {
          loginPage = false;
          signUpPage = true;
          document.getElementById('signIn').style.display = 'none';
          document.getElementById('signUp').style.display = 'block';
        } else {
          loginPage = true;
          signUpPage = false;
          document.getElementById('signUp').style.display = 'none';
          document.getElementById('signIn').style.display = 'block';
        }
      }

      function verifyForm() {

        //For the size of the form(s)
        for (let i=0;i<document.forms[0].length;i++) {
          if (document.forms[0][i].parentElement.parentElement.display === '' || document.forms[0][i].parentElement.parentElement.display === 'none'){

          } else {
              //if(document.getElementById(''))
            //If the form element type is a password or if the email or username fields (in or on either the Login or Sign-Up page) form invalid and do not create or sign in / dont run those functions
            if(document.forms[0].elements[i].type == 'password' || document.forms[0][i].name == 'email' || document.forms[0][i].name == 'username') {
              //If the form field is empty alerty which ones and add red indicators
              if (document.forms[0][i].value === '' && (document.forms[0].elements[i].style.display != '' || document.forms[0].elements[i].style.display != 'none')) {
                alert ('Please enter ' + document.forms[0][i].name);
                document.forms[0][i].style.background = 'red';
                return false;
              } else if (document.$('inputPwd').value != document.$('confirmPwd').value) {
                  alert('The passwords do not match.');
                }
            }
          }
        }    
      }


    </script>
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="/">MS Identity Platform</a>
    </nav>
    <br>
    <h5 class="card-header text-center">User Login w Azure & Microsoft Validation w 2FA to upload audio file(s): mp3, aiff, wav, mp4, flac.</h5>
    <br>
<!------------------  Login Form and Fields Starts Here  ------------------------------------>
    <form action="/action_page.php" method="post" id="signIn">
      <!-- class="container" -->
      <div class="wrapper">
        <!--  Header  -->
        <header class="section header">
          <div class="trapezoid"></div>
          <div class="header__text">
            <h1>Welcome.</h1>
            <p>Sign in or create a new account.</p>
          </div>
        </header>
          <!--  Sign In  -->
        <section class="section sign-in">
            <form action="">
                <label for="uname"><b>Username</b></label>
                <input type="text" name="username" class="username" id='username' placeholder="Username or Email">
                <div class="new-row">
                  <label for="psw" type="password"><b>Password</b></label>
                  <input type="checkbox" checked="" name="remember" id="rememberMe" class="middle password">&nbsp; Remember me
                </div>
                
                <input type="password" name="psw" placeholder="Password">

                <span class="psw"><a href="#">Forgot password?</a></span>
                    <div class="below-login">
                        
                    </div>
                <div class="container" style="background-color:#f1f1f1"></div>
                <p class="btm-swap"><a class="opposite-btn1" onclick="swapPage();" >Don't have an account?</a></p>
            </form>
            <!--------------------------------------------------------  The Sign In Button to run /login.js javaScript functions if form complete & not missing any requirements  --------------------------------->
            <div class="new-row go-up">
              <div class="btn-group ml-auto dropleft submit-btn">
                <button type="button" id="signIn" class="btn btn-secondary align-r" onclick="verifyForm();">Sign In</button>
              </div>
            </div>
          </section>
      </div>

      <div class="btm-wrap">
        <div class="new-row go-up">
          <div class="btn-group ml-auto dropleft submit-btn">
            <button type="button" id="signOut" class="btn btn-success d-none" onclick="signOut()">Sign Out</button>
          </div>
        </div>
      </div>
    </form> 

    <form action="/action_page.php" method="post" id="loginForm" id="signUp">
      <!-- class="container" -->
      <div class="wrapper">
        <!--  Header  -->
        <header class="section header">
          <div class="trapezoid"></div>
          <div class="header__text">
            <h1>Welcome.</h1>
            <p>Sign in or create a new account.</p>
          </div>
        </header><!--  Sign Up  -->
        <section class="section sign-up">
            <div class="trapezoid"></div>
            <form action="">
              <input type="text" name="name" placeholder="Name">
              <input type="text" name="email" placeholder="Email">
              <input type="password" name="password" placeholder="Password" class="password" id="inputPwd">
              <input type="password" name="confirm" placeholder="Confirm Password" class="password" id="confirmPwd">
              <button type="submit" class="submit-btn submit btn btn-secondary" id="create-acc">Create Account</button>
              <a class="opposite-btn2" onclick="swapPage();">Already have an account?</a>
            </form>
          </section>
      </div>
    </form> 


    <div class="row" style="margin:auto" >
    <div id="card-div" class="col-md-3 d-none">
    <div class="card text-center">
      <div class="card-body">
        <h5 class="card-title" id="welcomeMessage">Please sign-in to see your profile and read your mails</h5>
        <div id="profile-div"></div>
        <br>
        <br>
        <button class="btn btn-primary" id="seeProfile" onclick="seeProfile()">See Profile</button>
        <br>
        <br>
        <button class="btn btn-primary d-none" id="readMail" onclick="readMail()">Read Mails</button>
      </div>
    </div>
    </div>
    <br>
    <br>
      <div class="col-md-4">
        <div class="list-group" id="list-tab" role="tablist">
        </div>
      </div>
      <div class="col-md-5">
        <div class="tab-content" id="nav-tabContent">
        </div>
      </div>
    </div>
    <br>
    <br>

    <!-- importing bootstrap.js and supporting .js libraries -->
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

    <!-- importing app scripts (load order is important) -->
    <script type="text/javascript" src="./authConfig.js"></script>
    <script type="text/javascript" src="./graphConfig.js"></script>
    <script type="text/javascript" src="./ui.js"></script>

    <!-- replace the next line with authRedirect.js if you want to use the redirect flow -->
    <!-- <script type="text/javascript" src="./authRedirect.js"></script>   -->
    <script type="text/javascript" src="./authPopup.js"></script>
    <script type="text/javascript" src="./graph.js"></script>
  </body>
</html>