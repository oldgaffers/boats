//DBConfig.js|tsx

export const DBConfig = {
  name: "BoatsDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "boats",
      storeConfig: { keyPath: "oga_no", autoIncrement: false },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: false } },
        { name: "rig", keypath: "rig", options: { unique: false } },
      ],
    },
  ],
};