import { ObjectType, RegistrableApp } from "../types";
import { loadEntry } from "../../../loader/src";

export default async function loadApp<T extends ObjectType>(
  app: RegistrableApp<T>
) {
  const { name, entry, container, props } = app;
  //   const { mount, ...otherMicroAppConfigs } = (await loadEntry(entry))(container);
  return {
    bootstrap: async () => {
      console.log(`Bootstrap ${name}`);
    },
    mount: async () => {
      console.log(`Mount ${name}`);
    },
    unmount: async () => {
      console.log(`Unmount ${name}`);
    },
    unload: async () => {
      console.log(`Unload ${name}`);
    },
  };
}
