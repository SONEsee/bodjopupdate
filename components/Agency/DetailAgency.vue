<script lang="ts" setup>
const title = ref("ລາຍລະອຽດຕົວແທນ / Detail of Agency");
const agencyStore = UseAgencyStore();

const response_data = computed(() => {
  return agencyStore.response_detail_query_data;
});
</script>

<template>
  <v-section v-if="response_data !== null">
    <v-row>
      <v-col cols="12">
        <GlobalTextTitleLine :title="title" />
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="12" class="d-flex flex-wrap justify-end">
            <div class="d-flex flex-wrap align-center">
              ສະຖານະ:
              <span class="mx-4">
                <GlobalDefaultStatusChip :status="response_data?.status" />
              </span>
            </div>
          </v-col>

          <v-col md="4" class="d-flex align-center justify-center">
            <div>
              <GlobalAvatarProfileImage
                :image_url="response_data?.image_profile ?? 'N/A'"
              />
            </div>
          </v-col>

          <v-col cols="8">
            <v-row>
              <v-col cols="4">
                <GlobalCardTitle
                  :title="'ຊື່ ແລະ ນາມສະກຸນ / Fullname'"
                  :text="response_data?.fullname ?? 'N/A'"
                />
              </v-col>

              <v-col cols="4">
                <GlobalCardTitle
                  :title="'ຊື່ຫຼິ້ນ / Nickname'"
                  :text="response_data?.nick_name ?? 'N/A'"
                />
              </v-col>

              <v-col cols="4">
                <GlobalCardTitle
                  :title="'ເບີໂທລະສັບ / phone number'"
                  :text="response_data?.phone_number ?? 'N/A'"
                />
              </v-col>

              <v-col cols="4">
                <GlobalCardTitle
                  :title="'ລະຫັດຕົວແທນ / Agency code'"
                  :text="response_data?.agent_code ?? 'N/A'"
                />
              </v-col>

              <v-col cols="4">
                <GlobalCardTitle
                  :title="'ສິດການເຂົ້າໃຊ້ງານ / Role access'"
                  :text="GetAgencyTypeLabel(response_data?.agent_type ?? 'N/A')"
                />
              </v-col>

              <v-col cols="4">
                <GlobalCardTitle
                  :title="'ແຂວງ / Provinces'"
                  :text="
                    response_data?.village?.district?.province?.pr_name ?? 'N/A'
                  "
                />
              </v-col>

              <v-col cols="4">
                <GlobalCardTitle
                  :title="'ເມືອງ / Districts'"
                  :text="response_data?.village?.district?.dr_name ?? 'N/A'"
                />
              </v-col>

              <v-col cols="4">
                <GlobalCardTitle
                  :title="'ບ້ານ / Villages'"
                  :text="response_data?.village?.vill_name ?? 'N/A'"
                />
              </v-col>

              <v-col cols="4">
                <GlobalCardTitle
                  :title="'ຊື້ຜູ້ໃຊ້ງານ / Username'"
                  :text="response_data?.username ?? 'N/A'"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" class="pt-12">
        <v-row>
          <v-col cols="6">
            <h4>ການໃຫ້ເປີເຊັນ / Commissions</h4>
          </v-col>

          <v-col cols="6">
            <h4>
              ເອກະສານລະບຸຕົວຕົນ / Identifications ({{
                formatnumber(response_data?.user_identities.length ?? 0)
              }})
            </h4>
            <section class="mt-4">
              <AgencyDetailContentTableIdentities />
            </section>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-section>
</template>
