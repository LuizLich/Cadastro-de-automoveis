const firebaseConfig = {
  apiKey: "AIzaSyABMBS0hpELvkidlw5BFdZc8cJF2v2BBWg",
  authDomain: "cadastro-de-automoveis-19e3e.firebaseapp.com",
  projectId: "cadastro-de-automoveis-19e3e",
  storageBucket: "cadastro-de-automoveis-19e3e.appspot.com",
  messagingSenderId: "782071885543",
  appId: "1:782071885543:web:e39537d77e37967ba83c42",
  measurementId: "G-86SR67K0NT"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const carrosRef = db.collection("automoveis");

const form = document.getElementById("car-form");
const carList = document.getElementById("car-list");
const btnClear = document.getElementById("btn-clear");

window.addEventListener("DOMContentLoaded", listarCarros);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("car-id").value;
  const dados = {
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    cor: document.getElementById("cor").value,
    placa: document.getElementById("placa").value.toUpperCase(),
    anoFabricacao: parseInt(document.getElementById("anoFabricacao").value),
    kmRodada: parseInt(document.getElementById("kmRodada").value)
  };

  try {
    if (id) {
      await carrosRef.doc(id).update(dados);
      alert("Carro atualizado com sucesso!");
    } else {
      await carrosRef.add(dados);
      alert("Carro cadastrado com sucesso!");
    }

    form.reset();
    document.getElementById("car-id").value = "";
    btnClear.style.display = "none";
    listarCarros();
  } catch (error) {
    alert("Erro ao salvar: " + error.message);
  }
});

async function listarCarros() {
  carList.innerHTML = "";
  try {
    const snapshot = await carrosRef.get();
    if (snapshot.empty) {
      carList.innerHTML = "<p>Nenhum carro cadastrado.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const carro = doc.data();
      const div = document.createElement("div");
      div.className = "car-card";

      div.innerHTML = `
        <strong>${carro.marca} ${carro.modelo}</strong>
        <p><span class="info-label">Cor:</span> ${carro.cor}</p>
        <p><span class="info-label">Placa:</span> ${carro.placa}</p>
        <p><span class="info-label">Ano:</span> ${carro.anoFabricacao}</p>
        <p><span class="info-label">KM:</span> ${carro.kmRodada}</p>
        <div class="car-actions">
          <button onclick="editarCarro('${doc.id}')">Editar</button>
          <button onclick="excluirCarro('${doc.id}')">Excluir</button>
        </div>
      `;

      carList.appendChild(div);
    });
  } catch (error) {
    carList.innerHTML = "<p>Erro ao carregar os carros.</p>";
  }
}

window.excluirCarro = async (id) => {
  const confirmar = confirm("Tem certeza que deseja excluir este carro?");
  if (!confirmar) return;

  try {
    await carrosRef.doc(id).delete();
    alert("Carro excluído com sucesso!");
    listarCarros();
  } catch (error) {
    alert("Erro ao excluir carro: " + error.message);
  }
};

window.editarCarro = async (id) => {
  try {
    const doc = await carrosRef.doc(id).get();
    if (!doc.exists) {
      alert("Carro não encontrado!");
      return;
    }

    const carro = doc.data();
    document.getElementById("car-id").value = id;
    document.getElementById("marca").value = carro.marca;
    document.getElementById("modelo").value = carro.modelo;
    document.getElementById("cor").value = carro.cor;
    document.getElementById("placa").value = carro.placa;
    document.getElementById("anoFabricacao").value = carro.anoFabricacao;
    document.getElementById("kmRodada").value = carro.kmRodada;
    btnClear.style.display = "inline";
  } catch (error) {
    alert("Erro ao carregar carro para edição: " + error.message);
  }
};

// LIMPAR FORMULÁRIO
btnClear.addEventListener("click", () => {
  form.reset();
  document.getElementById("car-id").value = "";
  btnClear.style.display = "none";
});