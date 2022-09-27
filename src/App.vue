<template>
  <router-view />
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>Formulaire d'inscription:</strong>
        <a href="https://forms.gle/7e1P9vDcW1Ydvh4k7">Google Forms</a><br />
        Développé par
        <a href="https://github.com/Bhacaz">Jean-Francis Bastien</a>.<br />
        Pour
        <a href="https://collegesaintsacrement.qc.ca"
          >Collége Saint-Sacrement</a
        >
      </p>
    </div>
  </footer>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
