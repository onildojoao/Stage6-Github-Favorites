import { GithubUser } from "./GithubUser.js"

//Classe que vai conter a lógica dos dados (como eles serão estruturados)
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    //O método é estático, então não precisa do construtor new
    /* GithubUser.search("onildojoao").then((user) => console.log(user)) */
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username)

      if (userExists) {
        throw new Error("Usuário já cadastrado!")
      }

      const githubUser = await GithubUser.search(username)

      if (githubUser.login === undefined) {
        throw new Error("Usuário não encontrado!")
      }
      this.entries = [...this.entries, githubUser]
      this.update()
      this.save()

      console.log(this.entries)
    } catch (error) {
      alert(error)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    )

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}
//Classe que vai criar a visualização e eventos do html
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root) //Chama o construtor da classe pai

    this.tbody = this.root.querySelector("table tbody")

    this.update()

    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector(".search button")

    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input")

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach((user) => {
      const createdRow = this.createRow()

      createdRow.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`

      createdRow.querySelector(".user p").textContent = user.name

      createdRow.querySelector(
        ".user img"
      ).alt = `Foto do perfil do Github de ${user.name}`

      createdRow.querySelector(".user span").textContent = user.login

      createdRow.querySelector(
        ".user a"
      ).href = `https://github.com/${user.login}`

      createdRow.querySelector(".followers").textContent = user.followers

      createdRow.querySelector(".repositores").textContent = user.public_repos

      createdRow.querySelector(".remove").onclick = () => {
        const deleteOption = confirm(
          "Tem certeza que deseja deletar essa linha?"
        )
        if (deleteOption) {
          this.delete(user)
        }
      }
      this.tbody.append(createdRow)
    })
  }

  createRow() {
    const tr = document.createElement("tr")

    tr.innerHTML = `
            <td class="user">
              <img
                src="https://github.com/onildojoao.png"
                alt="Foto do perfil do Github de Onildo João"
              />
              <a href="https://github.com/onildojoao" target="_blank">
                <p>Onildo João</p>
                <span>onildojoao</span>
              </a>
            </td>
            <td class="followers">100</td>
            <td class="repositores">50</td>
            <td>
              <button class="remove">&times;</button>
            </td>
          
`
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}
