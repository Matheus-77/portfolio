function setIdioma(lang) {
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = textos[lang][el.dataset.i18n];
  });
}
setIdioma("pt");

function renderLista(idDiv, itens, montarHtml) {
  const caixa = document.getElementById(idDiv);
  itens.forEach(item => {
    const card = document.createElement("article");
    card.className = "item";
    card.innerHTML = montarHtml(item);
    caixa.appendChild(card);
  });
}

const projetosOrdenados = [...projetos].sort((a, b) => a.data.localeCompare(b.data));

renderLista("lista-projetos", projetosOrdenados, p => `
  ${p.imagem ? `<img src="${p.imagem}" alt="Projeto ${p.nome} em funcionamento">` : ""}
  <small>${p.data}</small>
  <h3>${p.nome}</h3>
  <p>${p.descricao}</p>
  <div class="tags">${p.tecnologias.map(t => `<span>${t}</span>`).join("")}</div>
  <a href="${p.github}" target="_blank" rel="noopener">Ver no GitHub</a>
`);

renderLista("lista-experiencias", experiencias, e => `
  <small>${e.periodo}</small>
  <h3>${e.atividade}</h3>
  <p><strong>${e.instituicao}</strong></p>
  <p>${e.descricao}</p>
`);

const form = document.getElementById("form-contato");
const statusForm = document.getElementById("status-form");
emailjs.init({ publicKey: CONFIG.publicKey });

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (CONFIG.publicKey.startsWith("SUA_")) {
    statusForm.textContent = "Configure as chaves do EmailJS em js/data.js.";
    return;
  }
  statusForm.textContent = "Enviando...";
  try {
    await emailjs.sendForm(CONFIG.serviceId, CONFIG.templateId, form);
    statusForm.textContent = "Mensagem enviada com sucesso!";
    form.reset();
  } catch (erro) {
    statusForm.textContent = "Não foi possível enviar. Tente novamente.";
    console.error(erro);
  }
});
