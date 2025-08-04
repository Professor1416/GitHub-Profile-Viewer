if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

function toggleDark() {
  document.body.classList.toggle("dark");
  localStorage.setItem('theme', document.body.classList.contains("dark") ? 'dark' : 'light');
}


async function getProfile() {
  const username = document.getElementById("username").value.trim();
  const resultDiv = document.getElementById("result");

  // Reset
  resultDiv.classList.remove("visible");

  if (!username) {
    resultDiv.innerHTML = `<p class="error-msg">⚠️ Please enter a username</p>`;
    resultDiv.classList.add("visible");
    return;
  }

  resultDiv.innerHTML = `<p>⏳ Loading...</p>`;
  resultDiv.classList.add("visible");

  const url = `https://api.github.com/users/${username}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("User not found");

    const data = await res.json();

    // Fetch top 5 repos
    const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=5`);
    const repos = await repoRes.json();

    let repoList = "<br><h4 style='text-align:left'>Top Repositories</h4><ul style='text-align:left'>";
    repos.forEach(repo => {
      repoList += `<li style='list-style: none'>📁<a href="${repo.html_url}" target="_blank">${repo.name}</a> ⭐ ${repo.stargazers_count}</li>`;
    });
    repoList += "</ul>";

    resultDiv.innerHTML = `
      <img src="${data.avatar_url}" width="100" height="100" />
      <h3>${data.name || data.login}</h3>
      <p>Repos: ${data.public_repos} | Followers: ${data.followers} | Following: ${data.following}</p>
      <a href="${data.html_url}" target="_blank">View GitHub Profile</a><br>
      ${repoList}
    `;

    resultDiv.classList.add("visible");
  } catch (error) {
    resultDiv.innerHTML = `<p class="error-msg">❌ ${error.message}</p>`;
    resultDiv.classList.add("visible");
  }
}


document.getElementById("username").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getProfile();
  }
});
