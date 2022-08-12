import type { Order } from "../Api";

export const orders: { [key: string]: Order[] } = {
  userX: [
    {
      campaign_uuid: "97c921aa-d1c3-4e34-8c72-bc620f566970",
      order_uuid: "90354820v905v3-c89275489vb-8v67",
      paid_amount: 100,
      items: [
        { amount: 1, item_uuid: "1dfb1dae-7b1f-475f-84a9-a562d68d1c22" },
        { amount: 2, item_uuid: "234d4d93-4b36-41f3-b9ef-cc158b10932a" },
        { amount: 3, item_uuid: "4fd6fd19-39d2-46a4-8206-6c76aba1d734" },
      ],
    },
  ],
  "test-user": [
    {
      campaign_uuid: "97c921aa-d1c3-4e34-8c72-bc620f566970",
      order_uuid: "90354820v905v3-c89275489v-453276g",
      paid_amount: 200,
      items: [
        { amount: 1, item_uuid: "1dfb1dae-7b1f-475f-84a9-a562d68d1c22" },
        { amount: 1, item_uuid: "4fd6fd19-39d2-46a4-8206-6c76aba1d734" },
      ],
    },
    {
      campaign_uuid: "a170039a-9917-4168-aee1-aedb77afe34e",
      order_uuid: "9vn20986h764v",
      paid_amount: 221,
      items: [{ amount: 1, item_uuid: "9ed31265-54cb-4e6d-af3d-ca8ba8942b37" }],
    },
  ],
};
