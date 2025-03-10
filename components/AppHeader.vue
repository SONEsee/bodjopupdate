<template>
  <v-app-bar :elevation="2" color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>Application Bar</v-app-bar-title>
    <v-menu min-width="200px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar class="pa-3,mr-3" color="#BDBDBD" size="large">
            <span class="text-h5" v-if="user.initials">
              <!-- {{ user.initials }} -->
              <v-icon
                icon="mdi-account-circle-outline"
                color="#FFFFFF"
              ></v-icon>
            </span>
            <span class="text-h5" v-else>
              <v-icon
                icon="mdi-account-circle-outline"
                color="#FFFFFF"
              ></v-icon>
            </span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="brown">
              <span class="text-h5" v-if="user.initials">{{
                user.initials
              }}</span>
              <span class="text-h5" v-else>
                <v-icon icon="mdi-account-circle-outline"></v-icon>
              </span>
            </v-avatar>
            <h3>{{ user.fullName }}</h3>
            <p class="text-caption mt-1">
              {{ user.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text" rounded> Edit Account </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text" rounded @click="onLogout"> Disconnect </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" permanent :rail="rail" order="1">
    <v-list nav density="comfortable">
      <div v-for="(item, i) in items" :key="`item-${i}`">
        <v-list-subheader>{{ item.title }}</v-list-subheader>

        <v-list-item
          color="primary"
          v-for="(menu, indexMenu) in item.menu"
          :key="`menu-${indexMenu}`"
          :value="menu"
          rounded="xl"
          :to="menu.to"
        >
          <template v-slot:prepend>
            <v-icon :icon="menu.icon"></v-icon>
          </template>

          <v-list-item-title v-text="menu.text"></v-list-item-title>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
const user = ref({
  fullName: "bih",
  initials: "n",
  email: "",
});

const items = ref([
  {
    title: "ໜ້າຫຼັກ",
    menu: [{ text: "Dashboard", icon: "mdi-clock", to: "/" }],
  },
  {
    title: "ຈັດການຂໍ້ມູນ",
    menu: [
         {
        text: "ຂາຍຢາ",
        icon: "mdi-network-pos",
        to: "/home",
      },
      { text: "ຈັດການຂໍ້ມູນປະເພດຂອງຢາ", icon: "mdi-shape-plus-outline", to: "/category" },
      {
        text: "ຈັດການຢາ",
        icon: "mdi-pill-multiple",
        to: "/product",
      },
   
    ],
  },
]);

const drawer = ref(true);
const rail = ref(false);
</script>
