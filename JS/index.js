const enviarComensales = document.getElementById("enviarComensales");
const select1 = document.getElementById("select1");
const select2 = document.getElementById("select2");
const select3 = document.getElementById("select3");
const select4 = document.getElementById("select4");
const form = document.getElementById("pedirComida");
const fieldSet = document.getElementById("fieldset");
const bottonEnviarPedido = document.getElementById("enviarPedido");
let cantidadClientes = 0;
let counter = 1;
const pedidos = [];

// Cambia de pedir los clientes a enseñar el formulario
document
  .getElementById("formComensales")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    // Esto se pone aqui porque el document.getElementById lo coge al iniciarse la página entonces no le da tiempo el dato
    // Se castea a number porque al cogerlo del html esta en string
    cantidadClientes = Number(
      document.getElementById("cantidadComensales").value,
    );
    document.getElementById("formComensales").style.display = "none";
    form.style.display = "block";
    document.getElementById("numeroCliente").innerHTML =
      "Comensal nº: " + counter;
    document.getElementById("idCliente").value = counter;
  });

// Esto era dos codigos pero lo he refactorizado a una funcion
function duplicateFood(select, otroSelect) {
  select.addEventListener("change", () => {
    const valorSeleccionado = select.value;

    // Recorremos todas las opciones del segundo menú
    Array.from(otroSelect.options).forEach((option) => {
      // Si la opción coincide con la seleccionada en el menú 1 (y no es la vacía), la ocultamos
      if (option.value === valorSeleccionado && valorSeleccionado !== "") {
        option.style.display = "none"; // Oculta la opción
        option.disabled = true;
        // Si el menú 2 ya tenía seleccionado ese producto, reseteamos su valor
        if (otroSelect.value === valorSeleccionado) {
          otroSelect.value = "";
        }
      } else {
        option.style.display = "block"; // Muestra las demás opciones
        option.disabled = false;
      }
    });
  });
}
duplicateFood(select1, select2);
duplicateFood(select2, select1);

function checker() {
  if (!checkerEmptySelect(select1)) {
    return false;
  }
  if (!checkerEmptySelect(select2)) {
    return false;
  }
  if (!checkerEmptySelect(select3)) {
    return false;
  }
  if (!checkerEmptySelect(select4)) {
    return false;
  }
  return true;
}

function checkerEmptySelect(select) {
  // No se hace con Array.from y con forEach porque daba undefined
  return select.value !== "";
}

// Las opciones al ser escondidas tienen que ser reiniciadas para el siguiente cliente
function resetSelectDisplay(select) {
  Array.from(select.options).forEach((option) => {
    option.style.display = "block";
    option.disabled = false;
  });
}

// Evita el envio de pedido y espera a que hayan pedido todos los comensales
document.getElementById("guardar_pedido").addEventListener("click", (e) => {
  e.preventDefault();
  if (checker()) {
    counter += 1;
    pedidos.push({
      idCliente: counter - 1,
      plato1: select1.value,
      plato2: select2.value,
      bebida: select3.value,
      postre: select4.value,
    });
    if (counter <= cantidadClientes) {
      document.getElementById("pedirComida").reset();
      resetSelectDisplay(select1);
      resetSelectDisplay(select2);
      document.getElementById("numeroCliente").innerHTML =
        "Cliente nº: " + counter;
    } else {
      fieldSet.style.display = "none";
      document.getElementById("enviarPedido").style.display = "block";
      bottonEnviarPedido.style.display = "block";
    }
  } else {
    alert("Didnt Pass Validation Check the information selected");
  }
});

// El botton de enviar el pedido
bottonEnviarPedido.addEventListener("click", (e) => {
  // Para enviar la informacion al php como enviamos un array usamos JSON que esta guardado en el guardar_pedido
  // Como es un botton de tipo submit hay que poner el prevent default para que haga lo que queremos nosotros
  e.preventDefault();
  fetch("pedido.php", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedidos),
  });
});
