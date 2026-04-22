const nfCalculadoraSession = nfRequireSession("../login.html");

if (nfCalculadoraSession) {
  const pesoInput = document.getElementById("peso");
  const tallaInput = document.getElementById("talla");
  const resultadoValor = document.getElementById("imc-value");
  const resultadoTexto = document.getElementById("imc-text");
  const botonCalcular = document.getElementById("btn-calcular");

  if (nfCalculadoraSession.peso) {
    pesoInput.value = nfCalculadoraSession.peso;
  }

  if (nfCalculadoraSession.talla) {
    tallaInput.value = nfCalculadoraSession.talla;
  }

  botonCalcular.addEventListener("click", () => {
    const peso = Number(pesoInput.value);
    const tallaCm = Number(tallaInput.value);

    if (!peso || !tallaCm) {
      resultadoValor.textContent = "--";
      resultadoTexto.textContent = "Completa peso y talla para obtener el resultado.";
      return;
    }

    const talla = tallaCm / 100;
    const imc = peso / (talla * talla);
    let estado = "Peso saludable";

    if (imc < 18.5) {
      estado = "Bajo peso";
    } else if (imc < 25) {
      estado = "Peso saludable";
    } else if (imc < 30) {
      estado = "Sobrepeso";
    } else {
      estado = "Obesidad";
    }

    resultadoValor.textContent = imc.toFixed(1);
    resultadoTexto.textContent = `Clasificacion actual: ${estado}.`;
  });
}
