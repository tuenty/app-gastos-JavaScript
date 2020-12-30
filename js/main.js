const form = document.getElementById("FormTransaction");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let transactionFormData = new FormData(form);
  let transactionObj = convertFormDataToTransactionObj(transactionFormData);
  saveTransactionObjJSON(transactionObj);
  insertRowInTransactionTable(transactionObj);
  form.reset();
});

document.addEventListener("DOMContentLoaded", function (event) {
  let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
  transactionObjArr.forEach(function (arrayElement) {
    insertRowInTransactionTable(arrayElement);
  });
});
function insertRowInTransactionTable(transactionObj) {
  let transactionTableRef = document.getElementById("transactionTable");

  let newTrasactionRowRef = transactionTableRef.insertRow(-1);
  newTrasactionRowRef.setAttribute(
    "data-transaction-id",
    transactionObj["transactionId"]
  );

  let newTypeCellRef = newTrasactionRowRef.insertCell(0);
  newTypeCellRef.textContent = transactionObj["tsSelector"];

  newTypeCellRef = newTrasactionRowRef.insertCell(1);
  newTypeCellRef.textContent = transactionObj["transactionDescription"];

  newTypeCellRef = newTrasactionRowRef.insertCell(2);
  newTypeCellRef.textContent = transactionObj["transactionAmount"];

  newTypeCellRef = newTrasactionRowRef.insertCell(3);
  newTypeCellRef.textContent = transactionObj["transactionCategory"];

  let newDeleteCell = newTrasactionRowRef.insertCell(4);
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  newDeleteCell.appendChild(deleteButton);

  deleteButton.addEventListener("click", function (event) {
    let transactionRow = event.target.parentNode.parentNode;
    let transactionId = transactionRow.getAttribute("data-transaction-id");
    transactionRow.remove();
    deleteTransactionObj(transactionId);
  });
}
//le paso como parametro el transactionId de la transaccion que quiero eliminar
function deleteTransactionObj(transactionId) {
  //obtengo las transaccion de mi "base de datos"(desconvierto de json a objeto)
  let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
  //busco el indice / la posicion de la transaccion que quiero eliminar
  let transactionIndexInArray = transactionObjArr.findIndex(
    (element) => element.transactionId === transactionId
  );
  //elimino el elemento de esa posicion
  transactionObjArr.splice(transactionIndexInArray, 1);
  //convierto de objeto a json
  let transactionArrayJSON = JSON.stringify(transactionObjArr);
  //Guardo mi arrya de transaccion en formato JSON en el local storage
  localStorage.setItem("transactionData", transactionArrayJSON);
}

function getNewTransactionId() {
  let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
  let newTransactionID = JSON.parse(lastTransactionId) + 1;
  localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionID));
  return newTransactionID;
}

function convertFormDataToTransactionObj(transactionFormData) {
  let transactionType = transactionFormData.get("tsSelector");
  let transactionDescription = transactionFormData.get(
    "transactionDescription"
  );
  let transactionAmount = transactionFormData.get("transactionAmount");
  let transactionCategory = transactionFormData.get("transactionCategory");
  let transactionId = getNewTransactionId();
  return {
    tsSelector: transactionType,
    transactionDescription: transactionDescription,
    transactionAmount: transactionAmount,
    transactionCategory: transactionCategory,
    transactionId: transactionId,
  };
}
function saveTransactionObjJSON(transactionObj) {
  let myTransactionAray =
    JSON.parse(localStorage.getItem("transactionData")) || [];
  myTransactionAray.push(transactionObj);
  //Convierto mi array de transaccion a JSON
  let transactionArrayJSON = JSON.stringify(myTransactionAray);
  //Guardo mi arrya de transaccion en formato JSON en el local storage
  localStorage.setItem("transactionData", transactionArrayJSON);
}
