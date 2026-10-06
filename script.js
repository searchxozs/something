function showScene(id) {
  document.querySelectorAll(".scene").forEach(function (scene) {
    scene.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}