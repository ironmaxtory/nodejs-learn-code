function throwError(){
  function fnA() {
    fnB();
  }
  
  function fnB() {
    fnC();
  }
  
  function fnC() {
    throw new Error('Error Occurred.');
  }
  
  fnA();
  console.log('This line will not be printed.');
}

function returnError(){
  function fnA() {
    return fnB();
  }
  
  function fnB() {
    return fnC();
  }
  
  function fnC() {
    return new Error('Error Occurred.');
  }
  
  var res = fnA();
  console.log(res);
  console.log('This line will be printed.');
}

// throwError();
returnError();