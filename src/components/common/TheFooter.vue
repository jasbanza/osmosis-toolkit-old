<template>
    <footer aria-labelledby="footer">
      <div class="center container card">
        <div class="footer">
          <span><font-awesome-icon icon="fa-duotone fa-user-astronaut" /> Coder: <a href="https://linktr.ee/jasbanza" 
                target="_blank">@jasbanza</a></span>
          <span><font-awesome-icon icon="fa-duotone fa-chart-line-up" /> APR Data</span>
              <span>
          Fueled by Coffee, <a target="_blank" href="https://app.starname.me/profile/jason">buy one for me?</a>
          <font-awesome-icon icon="fa-duotone fa-cup-togo" /></span>
          <span>
          <a href="https://www.dexmos.app/" target="_blank"><img aria-label="Dexmos" alt="Dexmos" src="/images/dexmosWhite.png" />
          </a></span>
              <span><font-awesome-icon icon="fa-duotone fa-browsers" /> UI Designer<br />
              <a href="https://twitter.com/OzMagick"
            target="_blank"><img alt="Zenith"
              src="/images/ZenithText.svg" /></a></span>
            <span><font-awesome-icon icon="fa-duotone fa-server" /><br />Hosting & Dedicated RPC Nodes<br />
              <a href="https://interbloc.org/" target="_blank"><img alt="Interbloc"
              src="/images/interblocHorizontalWhite.png" /></a></span>
              <span><h4>More from @jasbanza:</h4> 
          <a href="https://chrome.google.com/webstore/detail/osmosis-companion/gdfaagnfjplgkajlggjfnimdogmgcjob"
            target="_blank">Osmosis Companion Chrome Extension</a></span>
              <span><img src="/images/svgHelpy_icon.svg" /> Help/Support<br /><a href="https://support.osmosis.zone/" target="_blank"><img alt="Osmosis Support Lab"
              src="/images/oslBanner_new.svg" /></a></span>
        </div>
      </div>
    </footer>
</template>

<style scoped>
footer {
  font-family: var(--fontText);
  font-weight: 400;
  font-size: 0.95rem;
  color: var(--colorNotSoWhite);
}
span {
  margin-top: 0.75rem;
  padding: 0;
}
h4 {
  padding: 0;
  margin: 0.5rem;
}
.footer {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto auto;
}
.footer > span > img {
  width: 2.5rem;
  position: relative;
  top: 8px;
}
.footer > span > a > img {
  margin-top: 0.25rem;
  width: 125px;
  transition-duration: 0.50s;
  transition-timing-function: ease-in-out;
  filter: drop-shadow(0px 0px 2px var(--colorOsmoIon));
}
.footer > span > a:hover > img {
  width: 155px;
  transition-duration: 0.50s;
  transition-timing-function: ease-in-out;
  filter: drop-shadow(0px 0px 10px var(--colorOsmoAmmelia));
}
.svg-inline--fa {
  font-size: 1.75rem;
  position: relative;
  top: 5px;
  margin: 0 5px;
}
.fa-handshake-angle {
    color: var(--colorOsmoBullish);
}
.fa-user-astronaut {
  color: #8FA4D8;
}
.fa-browsers {
  color: #8FA4D8;
}
.fa-chart-line-up {
  color: var(--colorOsmoBullish);
}
.fa-server {
  margin-bottom: 0.50rem;
}
.fa-cup-togo {
  color: var(--colorArcBurg);
  margin: 0 5px;
  font-size: medium;
  top: unset;
  transition-duration: 0.50s;
  transition-timing-function: ease-in-out;
}
.fa-cup-togo:hover {
  font-size: 2.0rem;
  transition-duration: 0.50s;
  transition-timing-function: ease-in-out;
  animation-name: shake;
  animation-duration: 1.0s;
  animation-iteration-count: infinite;
}
</style>
