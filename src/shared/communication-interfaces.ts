import { z } from "zod";
export const SyncStorageMessage = z.object({
  action: z.enum(["set", "get", "delete", "sync"]),
  field: z.string(),
  data: z.any(),
});
