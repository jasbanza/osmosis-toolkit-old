<template>
  <img src="/images/osmoToolKit_logo_banner-01.svg" />
    <div class="center container card" id="heading">
      <span class="title"
        id="pageTitle">Home</span>
        <ul class="nav">
        <button class="nav"><a href="/">
            <li><font-awesome-icon icon="fa-duotone fa-house" /> Home</li>
          </a></button>
        <button class="nav"><a href="swap.html">
            <li><font-awesome-icon icon="fa-duotone fa-arrow-right-arrow-left" /> Swap</li>
          </a></button>
        <button class="nav"><a href="pool.html">
            <li><font-awesome-icon icon="fa-duotone fa-scale-balanced" /> Pool</li>
          </a></button>
        <button disabled class="nav"><font-awesome-icon icon="fa-duotone fa-books" /> 
          <li>Wiki</li>
        </button>
      </ul>
        <button class="keplr" onclick="module.btnConnectKeplr_onClick()">
          <img src="/images/keplr_square.webp" />
          <div id="btnConnectKeplr_text">Connect</div>
        </button><br />
      <span><B>Address:</B></span> <span id="wallet-status">osmo1vjsxu6sew3z5wphzeu59nq0e78s0974dm5tx6x</span>
    </div>
</template>

<style scoped>
/* Banner Image */
img {
  width: 650px;
}
/* Page Title */
.title {
  font-family: var(--fontHeadings);
}
/* FA Icons */
.svg-inline--fa {
  font-size: 1.75rem;
  margin: 0 5px;
}
.fa-arrow-right-arrow-left {
  --fa-primary-color: var(--colorOsmoBullish);
  --fa-secondary-color: var(--colorOsmoBearish);
  --fa-secondary-opacity: 1.0;
}
.fa-house{
  color: var(--colorOsmoAmmelia);
}
/* UL Navigation Related*/
ul.nav {
  list-style-type: none;
  display: grid;
  padding: 0;
  margin: 0;
  grid-template-columns: auto auto auto auto;
  justify-content: center;
}
button.nav {
  display: inline-flex;
  justify-content: center;
  font-size: 1.75rem;
  padding: 1.0rem;
  transition-property: all;
  transition-duration: 0.30s;
  transition-timing-function: ease-in-out;
}
button.nav:hover {
  transform: rotate(-0.03turn);
  transition-property: all;
  transition-duration: 0.30s;
  transition-timing-function: ease-in-out;
}
button.nav:disabled {
  background-color: #ccc;
  border-color: #ccc;
  color: #3f3f3f;
  cursor: not-allowed;
}
button.nav:disabled:hover {
  border-radius: 1.0rem;
}
button.nav > a {
  color: var(--colorNotSoWhite);
  text-decoration-line: none;
}
button.keplr {
  display: inline-flex;
  max-width: 200px;
  align-items: center;
  font-variant-caps: normal;
}
button.keplr > img {
  width: 25px;
  margin-right: 0.25rem;
}
#wallet-status {
  font-size: medium;
}
</style>
