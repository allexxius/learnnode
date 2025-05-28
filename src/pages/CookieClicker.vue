<script setup>
import { computed, onUnmounted, ref, watch } from 'vue';

// Cookies and buildings state
let cookies = ref(0);
let totalCookiesClicked = ref(0);

let buildings = ref([
  { name: 'Cursor', price: 15, count: 0, cps: 0.1 },
  { name: 'Grandma', price: 100, count: 0, cps: 1 },
  { name: 'Farm', price: 1000, count: 0, cps: 10 },
  { name: 'Factory', price: 10000, count: 0, cps: 100 },
]);

// Upgrades state
let upgrades = ref([
  { id: 1, name: 'Efficient Cursors', description: 'Cursors produce 2x CPS', price: 100, building: 'Cursor', multiplier: 2, bought: false },
  { id: 2, name: 'Grandma’s Recipes', description: 'Grandmas produce 2x CPS', price: 500, building: 'Grandma', multiplier: 2, bought: false },
  { id: 3, name: 'Farm Machinery', description: 'Farms produce 3x CPS', price: 5000, building: 'Farm', multiplier: 3, bought: false },
]);

// Achievements state
let achievements = ref([
  { id: 1, name: 'First Click', description: 'Click the cookie once', unlocked: false },
  { id: 2, name: 'Cookie Hoarder', description: 'Collect 1000 cookies', unlocked: false },
  { id: 3, name: 'Building Buyer', description: 'Buy 10 buildings total', unlocked: false },
]);

// Click power (how many cookies per click)
let clickPower = ref(1);

// Golden cookie state
let goldenCookieVisible = ref(false);
let goldenCookieBonusActive = ref(false);
let goldenCookieTimeout = null;
let goldenCookieEffectTimeout = null;

// Calculate cps with upgrades
let cps = computed(() => {
  let total = 0;
  buildings.value.forEach(building => {
    let baseCps = building.cps * building.count;
    // Apply upgrades multiplier for this building
    let buildingUpgradeMultiplier = upgrades.value
      .filter(upg => upg.bought && upg.building === building.name)
      .reduce((acc, upg) => acc * upg.multiplier, 1);
    total += baseCps * buildingUpgradeMultiplier;
  });
  // Apply golden cookie bonus multiplier (2x)
  if (goldenCookieBonusActive.value) total *= 2;
  return total;
});

// Add cookies each second from buildings
const cpsInterval = setInterval(() => {
  cookies.value += cps.value;
  updateTitle();

  // Golden cookie random spawn (1% chance every second)
  if (!goldenCookieVisible.value && Math.random() < 0.01) {
    showGoldenCookie();
  }
}, 1000);

// Update document title with cookies count
function updateTitle() {
  document.title = `🍪 ${cookies.value.toFixed(1)} cookies`;
}

// Clicking main cookie
function clickCookie() {
  cookies.value += clickPower.value;
  totalCookiesClicked.value++;
  updateTitle();
  checkAchievements();

  // Unlock 'First Click' achievement
  unlockAchievement(1);
}

// Buy building
function buyBuilding(building) {
  if (cookies.value >= building.price) {
    cookies.value -= building.price;
    building.price = Math.ceil(building.price * 1.15);
    building.count++;
    updateTitle();
    checkAchievements();
  }
}

// Buy upgrade
function buyUpgrade(upgrade) {
  if (!upgrade.bought && cookies.value >= upgrade.price) {
    cookies.value -= upgrade.price;
    upgrade.bought = true;
    updateTitle();
  }
}

// Show golden cookie on screen for 10 seconds
function showGoldenCookie() {
  goldenCookieVisible.value = true;
  // Golden cookie disappears after 10 seconds
  goldenCookieTimeout = setTimeout(() => {
    goldenCookieVisible.value = false;
  }, 10000);
}

// Click golden cookie: gives 15 seconds 2x CPS bonus
function clickGoldenCookie() {
  if (!goldenCookieVisible.value) return;

  goldenCookieVisible.value = false;
  goldenCookieBonusActive.value = true;

  clearTimeout(goldenCookieTimeout);

  // Bonus lasts 15 seconds
  goldenCookieEffectTimeout = setTimeout(() => {
    goldenCookieBonusActive.value = false;
  }, 15000);
}

// Check and unlock achievements
function checkAchievements() {
  // Unlock 'Cookie Hoarder'
  if (cookies.value >= 1000) unlockAchievement(2);

  // Unlock 'Building Buyer' for total buildings bought >= 10
  const totalBuildings = buildings.value.reduce((acc, b) => acc + b.count, 0);
  if (totalBuildings >= 10) unlockAchievement(3);
}

// Unlock achievement helper
function unlockAchievement(id) {
  const achievement = achievements.value.find(a => a.id === id);
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
  }
}

// Cleanup intervals on component unmount
onUnmounted(() => {
  clearInterval(cpsInterval);
  clearTimeout(goldenCookieTimeout);
  clearTimeout(goldenCookieEffectTimeout);
});
</script>

<template>
  <div class="columns">
    <div class="column is-3 has-background-primary p-5">
      <h1 class="is-size-1"><b>Cookies: {{ cookies.toFixed(1) }}</b></h1>
      <h3 class="is-size-3"><b>CPS: {{ cps.toFixed(1) }}</b></h3>

      <figure class="image is-square m-5" style="position: relative;">
        <img
          @click="clickCookie"
          class="is-rounded"
          src="https://pngimg.com/uploads/cookie/cookie_PNG13656.png"
          style="cursor: pointer;"
        />
        <!-- Golden cookie overlay -->
        <img
          v-if="goldenCookieVisible"
          @click.stop="clickGoldenCookie"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Golden_cookie_icon.png/240px-Golden_cookie_icon.png"
          alt="Golden Cookie"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer;"
        />
      </figure>
    </div>

    <div class="column is-7 has-background-info p-5">
      <h2 class="is-size-3">Upgrades</h2>
      <div v-for="upgrade in upgrades" :key="upgrade.id" class="box" :class="{ 'has-background-success-light': upgrade.bought }">
        <h4><b>{{ upgrade.name }}</b> <small v-if="upgrade.bought">(Purchased)</small></h4>
        <p>{{ upgrade.description }}</p>
        <button
          class="button is-primary"
          :disabled="upgrade.bought || cookies < upgrade.price"
          @click="buyUpgrade(upgrade)"
        >
          Buy for 🍪 {{ upgrade.price }}
        </button>
      </div>
    </div>

    <div class="column is-2 has-background-warning p-5">
      <h3 class="is-size-4">Buildings</h3>
      <button
        class="button is-large is-fullwidth is-primary mb-2"
        v-for="building in buildings"
        :key="building.name"
        :disabled="cookies < building.price"
        @click="buyBuilding(building)"
      >
        {{ building.name }} 🍪{{ building.price }} #{{ building.count }}
      </button>

      <h3 class="is-size-4 mt-5">Achievements</h3>
      <ul>
        <li
          v-for="achievement in achievements"
          :key="achievement.id"
          :style="{ color: achievement.unlocked ? 'green' : 'gray' }"
        >
          {{ achievement.name }} <small v-if="achievement.unlocked">✔️</small>
        </li>
      </ul>
    </div>
  </div>
</template>
