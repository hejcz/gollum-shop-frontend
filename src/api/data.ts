import type { Campaign, Order } from "./Api";

const campaigns: Campaign[] = [
    {
      "uuid": "a170039a-9917-4168-aee1-aedb77afe34e",
      "title": "Kingdoms Forlorn",
      "img_url": "/images/forlorn.avif",
      "url": "https://www.kickstarter.com/projects/kingdomsforlorn/kingdoms-forlorn-dragons-devils-and-kings",
      "items": [
        {
          "name": "Core Game Pledge",
          "price": 540,
          "uuid": "66a89ed0-8fdd-4c6e-a14f-ee0ab4045255"
        },
        {
          "name": "Elite Core Game Pledge",
          "min_amount": 5,
          "price": 750,
          "uuid": "a1ebd6d4-566d-4c13-9453-9f488b7c8bb4"
        }
      ],
      "locked": false
    },
    {
      "uuid": "ee2d0863-bd0d-4fb4-8ed3-f0ec58a0b223",
      "title": "Scarface 1920",
      "img_url": "/images/scarface1920.avif",
      "url": null,
      "items": [],
      "locked": false
    },
    {
      "uuid": "97c921aa-d1c3-4e34-8c72-bc620f566970",
      "title": "Too Many Bones / Cloudspire",
      "img_url": "/images/tmb.avif",
      "url": null,
      "items": [
        {
          "name": "Cloudspire Skymat",
          "price": 201,
          "uuid": "1dfb1dae-7b1f-475f-84a9-a562d68d1c22"
        },
        {
          "name": "Cloudspire: Portal Seekers",
          "price": 127,
          "uuid": "234d4d93-4b36-41f3-b9ef-cc158b10932a"
        },
        {
          "name": "Cloudspire: The Griege",
          "price": 127,
          "uuid": "4fd6fd19-39d2-46a4-8206-6c76aba1d734"
        },
        {
          "name": "Cloudspire Premium Health",
          "price": 106,
          "uuid": "349b0938-f7f8-4e0b-8a2e-6da366fa8122"
        },
        {
          "name": "Cloudspire: Faction Spire Minatures",
          "price": 254,
          "uuid": "509d3e04-9dda-47db-b95f-ec56a9da5d7c"
        },
        {
          "name": "Cloudspire Vol 1:The Joining War - Hardcover Lore & Scenario Book",
          "price": 127,
          "uuid": "94c97849-5605-495b-99a5-4b3469ae6957"
        },
        {
          "name": "Cloudspire: Horizon's Wrath",
          "price": 127,
          "uuid": "0dbdde66-8b24-4b2e-b579-8c5e9fc9f110"
        },
        {
          "name": "Cloudspire: The Uprising",
          "price": 127,
          "uuid": "745dc872-4bab-4086-aaf6-c290c7096744"
        },
        {
          "name": "Cloudspire: Miniatures Expansion Vol 2.",
          "price": 127,
          "uuid": "501f8045-4857-44eb-bc1d-137b200328e0"
        },
        {
          "name": "Cloudspire Vol. 2: Ankar's Plunder - Hardcover Lore & Scenario Book",
          "price": 127,
          "uuid": "84307f11-e90c-4a52-a8b6-28e8436bedac"
        },
        {
          "name": "Cloudspire: Hero's Bounty",
          "price": 48,
          "uuid": "f71b6296-e161-427a-b3ee-4fdff7eb0b55"
        },
        {
          "name": "Cloudspire",
          "price": 530,
          "uuid": "92d8b5df-6897-4622-a607-1ddce081d21e"
        },
        {
          "name": "Too Many Bones: Ghillie Add-on",
          "price": 106,
          "uuid": "4bab4062-014b-4209-a1c9-4310ef622e66"
        },
        {
          "name": "Too Many Bones: Tink Add-on",
          "price": 106,
          "uuid": "b6101b97-8748-48ab-ad84-f4ea7fb049e3"
        },
        {
          "name": "Too Many Bones: Nugget Add-on",
          "price": 106,
          "uuid": "e396781e-1d2f-4378-a4a9-ade609da6b81"
        },
        {
          "name": "Too Many Bones: Premium Health - 65 qty",
          "price": 106,
          "uuid": "a6eb9a9e-806a-43cc-9e10-92f5e8668c65"
        },
        {
          "name": "Too Many Bones: The Age of Tyranny",
          "price": 106,
          "uuid": "acd51ebb-ae01-4e81-936d-88731691c9e2"
        },
        {
          "name": "Too Many Bones: 40 Days in Daelore",
          "price": 106,
          "uuid": "cdb21bd3-63a9-4364-a37a-8f73b92276d1"
        },
        {
          "name": "Too Many Bones: Gasket Add-on",
          "price": 106,
          "uuid": "bad8c22e-8d11-4f41-9fca-eb1ab8f2d993"
        },
        {
          "name": "Too Many Bones: Adventure Map 2.0",
          "price": 80,
          "uuid": "526d7ed6-9009-4ab9-a9a0-1914f0884b48"
        },
        {
          "name": "Too Many Bones: Ally Pack",
          "price": 48,
          "uuid": "249ca416-eb1e-421a-9585-50e41469fb61"
        },
        {
          "name": "Too Many Bones: Splice & Dice",
          "price": 244,
          "uuid": "055c3af5-0380-4e02-865c-83527c2701bd"
        },
        {
          "name": "Too Many Bones: Dart Add-on",
          "price": 138,
          "uuid": "5f37ef8c-f815-4105-b387-782336b10656"
        },
        {
          "name": "Too Many Bones: Lab Rats Add-on",
          "price": 138,
          "uuid": "9919c200-6d7b-4c3c-8d23-50c1ab0ed98b"
        },
        {
          "name": "Too Many Bones",
          "price": 530,
          "uuid": "9aee8a41-d4cf-47b6-8be8-ba17b706a03e"
        },
        {
          "name": "Too Many Bones: Undertow",
          "price": 371,
          "uuid": "849340b5-87ea-4426-97cb-c378b04b8936"
        },
        {
          "name": "Triplock",
          "price": 130,
          "uuid": "9ef1e10d-ff8d-4759-a3b4-65d05f1e11ff"
        },
        {
          "name": "The Royal HQ Add-on - Episode 3",
          "price": 45,
          "uuid": "7540f719-7390-48a0-b917-2c7339523cc3"
        },
        {
          "name": "The Estates Add-on - Episode 4",
          "price": 45,
          "uuid": "cbbd343a-e420-40b6-b093-d36a28fe00ed"
        },
        {
          "name": "Gearloc Battle Desk Mat",
          "price": 105,
          "uuid": "e4b1db1f-46b7-488f-9ce7-45f97fd4e89d"
        },
        {
          "name": "Militia Ranger Playmat",
          "price": 87,
          "uuid": "47c53831-c5b2-4c0c-a3d1-c32af9b5a4de"
        },
        {
          "name": "Neoprene Control Ur Roll Dice Tray: TMB",
          "price": 68,
          "uuid": "4f417337-94ed-4732-8b32-6fb871c1010c"
        },
        {
          "name": "Neoprene Control Ur Roll Dice Tray: Cloudspire",
          "price": 68,
          "uuid": "6ec1cc79-447d-47cf-b9a8-e64403f516e6"
        }
      ],
      "locked": false
    },
    {
      "uuid": "779e7493-840a-45d8-8cbb-0685e0b5c910",
      "title": "Resurgence",
      "img_url": "/images/resurgence.avif",
      "url": null,
      "items": [],
      "locked": false
    }
  ];

  const orders: {[key: string]: Order[]} = {
    "userX": [
      {campaign_uuid: "97c921aa-d1c3-4e34-8c72-bc620f566970", paid_amount: 100, items: [
        {amount: 1, order_uuid: "1dfb1dae-7b1f-475f-84a9-a562d68d1c22"},
        {amount: 2, order_uuid: "234d4d93-4b36-41f3-b9ef-cc158b10932a"},
        {amount: 3, order_uuid: "4fd6fd19-39d2-46a4-8206-6c76aba1d734"},
      ]}
    ],
    "userA": [
      {campaign_uuid: "97c921aa-d1c3-4e34-8c72-bc620f566970", paid_amount: 200, items: [
        {amount: 1, order_uuid: "1dfb1dae-7b1f-475f-84a9-a562d68d1c22"},
        {amount: 1, order_uuid: "4fd6fd19-39d2-46a4-8206-6c76aba1d734"},
      ]}
    ]
  }

export interface ShopData {
  campaigns: Campaign[],
  orders: {[key: string]: Order[]},
}

export default {
    campaigns: campaigns,
    orders: orders
} as ShopData