(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function r(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(t){if(t.ep)return;t.ep=!0;const o=r(t);fetch(t.href,o)}})();let m=[];var u;(u=document.getElementById("preferences-form"))==null||u.addEventListener("submit",function(i){i.preventDefault();const e=document.getElementById("genre").value,r=document.getElementById("duration").value,n=document.getElementById("year").value,t=document.getElementById("director").value;fetch("https://cinematch-0iyy.onrender.com/movies").then(o=>o.json()).then(o=>{m=o;const c=o.filter(d=>(e==="all"||d.genre&&d.genre.includes(e))&&(!r||d.runtime&&parseInt(d.runtime)<=Number(r))&&(!n||d.releasedYear&&d.releasedYear>=Number(n))&&(!t||d.director&&d.director.toLowerCase().includes(t.toLowerCase())));p(c)}).catch(o=>{console.error("Erro ao buscar filmes:",o);const c=document.getElementById("movie-results");c&&(c.innerHTML="<p>Erro ao carregar filmes. Tente novamente.</p>")})});function p(i){const e=document.getElementById("movie-results");if(!e)return;e.innerHTML="";const r=document.createElement("button");if(r.textContent="Adicionar Novo Filme",r.classList.add("add-movie-btn"),r.onclick=f,e.appendChild(r),i.length===0){const n=document.createElement("p");n.textContent="Nenhum filme encontrado.",e.appendChild(n);return}i.forEach(n=>{const t=document.createElement("div");t.classList.add("movie-card"),t.innerHTML=`
            <img src="${n.posterLink}" alt="${n.seriesTitle}">
            <div class="info">
                <h3>${n.seriesTitle}</h3>
                <p><strong>Descrição:</strong> ${n.overview||"N/A"}</p>
                <p><strong>Diretor:</strong> ${n.director||"N/A"}</p>
                <p><strong>Gênero:</strong> ${n.genre}</p>
                <p><strong>Duração:</strong> ${n.runtime||"N/A"}</p>
                <p><strong>Ano:</strong> ${n.releasedYear||"N/A"}</p>
                <p><strong>Nota:</strong> ${n.imdbRating||"N/A"}</p>
                <div class="movie-actions">
                    <button onclick="editMovie(${n.id})" class="edit-btn">Editar</button>
                    <button onclick="deleteMovie(${n.id})" class="delete-btn">Excluir</button>
                </div>
            </div>
        `,e.appendChild(t)})}function f(){var e;document.body.insertAdjacentHTML("beforeend",`
        <div class="movie-form-overlay">
            <div class="movie-form">
                <h3>Adicionar Novo Filme</h3>
                <form id="add-movie-form">
                    <input type="text" id="title" placeholder="Título" required>
                    <input type="text" id="director" placeholder="Diretor" required>
                    <input type="text" id="genres" placeholder="Gêneros" required>
                    <input type="text" id="duration" placeholder="Duração" required>
                    <input type="number" id="year" placeholder="Ano" required>
                    <input type="url" id="image" placeholder="URL da Imagem (opcional)">
                    <div class="form-actions">
                        <button type="submit">Salvar</button>
                        <button type="button" onclick="closeMovieForm()">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `),(e=document.getElementById("add-movie-form"))==null||e.addEventListener("submit",function(r){r.preventDefault(),v()})}function v(){const i=document.getElementById("title").value,e=document.getElementById("genres").value,r=document.getElementById("director").value,n=document.getElementById("duration").value,t=parseInt(document.getElementById("year").value),o=document.getElementById("image").value||"https://via.placeholder.com/180x270?text=No+Image";fetch("https://cinematch-0iyy.onrender.com/movies",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({seriesTitle:i,genre:e,director:r,runtime:n,releasedYear:t,posterLink:o})}).then(d=>d.json()).then(d=>{var l;console.log("Filme adicionado:",d),a(),(l=document.getElementById("preferences-form"))==null||l.dispatchEvent(new Event("submit"))}).catch(d=>{console.error("Erro ao adicionar filme:",d),alert("Erro ao adicionar filme. Tente novamente.")})}function y(i){var n;const e=m.find(t=>t.id===i);if(!e){alert("Filme não encontrado!");return}const r=`
        <div class="movie-form-overlay">
            <div class="movie-form">
                <h3>Editar Filme</h3>
                <form id="edit-movie-form">
                    <input type="text" id="edit-title" value="${e.seriesTitle}" required>
                    <input type="text" id="edit-director" value="${e.director}" required>
                    <input type="text" id="edit-genre" value="${e.genre}" required>
                    <input type="text" id="edit-runtime" value="${e.runtime}" required>
                    <input type="number" id="edit-year" value="${e.releasedYear}" required>
                    <input type="url" id="edit-image" value="${e.posterLink}">
                    <div class="form-actions">
                        <button type="submit">Salvar</button>
                        <button type="button" onclick="closeMovieForm()">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;document.body.insertAdjacentHTML("beforeend",r),(n=document.getElementById("edit-movie-form"))==null||n.addEventListener("submit",function(t){t.preventDefault(),g(i)})}function g(i){const e=document.getElementById("edit-title").value,r=document.getElementById("edit-director").value,n=document.getElementById("edit-genre").value,t=document.getElementById("edit-runtime").value,o=parseInt(document.getElementById("edit-year").value),c=document.getElementById("edit-image").value,d={seriesTitle:e,director:r,genre:n,runtime:t,releasedYear:o,posterLink:c};fetch(`https://cinematch-0iyy.onrender.com/movies/${i}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}).then(l=>l.json()).then(l=>{var s;console.log("Filme atualizado:",l),a(),(s=document.getElementById("preferences-form"))==null||s.dispatchEvent(new Event("submit"))}).catch(l=>{console.error("Erro ao atualizar filme:",l),alert("Erro ao atualizar filme. Tente novamente.")})}function h(i){confirm("Tem certeza que deseja excluir este filme?")&&fetch(`https://cinematch-0iyy.onrender.com/movies/${i}`,{method:"DELETE"}).then(e=>e.json()).then(e=>{var r;console.log("Filme excluído:",e),(r=document.getElementById("preferences-form"))==null||r.dispatchEvent(new Event("submit"))}).catch(e=>{console.error("Erro ao excluir filme:",e),alert("Erro ao excluir filme. Tente novamente.")})}function a(){const i=document.querySelector(".movie-form-overlay");i&&i.remove()}window.editMovie=y;window.deleteMovie=h;window.closeMovieForm=a;
