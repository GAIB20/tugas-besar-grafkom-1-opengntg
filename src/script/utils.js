function showError(errorText) {
  const errorBoxDiv = document.querySelector("#error-box");
  const errorTextP = document.createElement("p");
  errorTextP.innerText = errorText;
  errorBoxDiv.appendChild(errorTextP);
  console.log(errorText);
}
