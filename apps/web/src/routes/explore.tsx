import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { ExploreScreen } from "@/components/explore-screen";

const searchSchema = z.object({
  q: z
    .string()
    .transform((s) => s.trim())
    .default(""),
});

export const Route = createFileRoute("/explore")({
  validateSearch: zodValidator(searchSchema),
  search: { middlewares: [stripSearchParams({ q: "" })] },
  component: ExploreScreen,
});
