//função que retorna palavra aleatoria
export function randomtitle() {
  return (Math.random() * 7).toString(30).replace(".", "");
}
