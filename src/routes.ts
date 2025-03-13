import type { JSX } from "react";

export interface RouteItem {
  name: string;
  path: string;
  aim: string;
  aimText: string;
  component: () => Promise<{ default: () => JSX.Element }>;
}

export const routes: RouteItem[] = [
  {
    name: "Choose Music",
    aim: "",
    aimText: "Choose a local music to play, or...",
    path: "/",
    component: () => import("@/pages/choose-music"),
  },
  {
    name: "Inflator Pump",
    aim: "80,85",
    aimText: "Set the volume to 80 ~ 85",
    path: "/inflator-pump",
    component: () => import("@/pages/inflator-pump"),
  },
  {
    name: "Pi",
    aim: "80",
    aimText: "Set the volume to 80",
    path: "/pi",
    component: () => import("@/pages/Pi"),
  },
  {
    name: "Dice",
    aim: "85",
    aimText: "Set the volume to 85",
    path: "/dice",
    component: () => import("@/pages/dice"),
  },
  {
    name: "Random Change",
    aim: "80,85",
    aimText: "Set the volume to 80 ~ 85",
    path: "/random-change",
    component: () => import("@/pages/random-change"),
  },
  {
    name: "Parabola",
    aim: "80,85",
    aimText: "Set the volume to 80 ~ 85",
    path: "/parabola",
    component: () => import("@/pages/parabola"),
  },
  {
    name: "Inclined Place",
    aim: "80",
    aimText: "Set the volume to 80",
    path: "/inclined-place-and-ball",
    component: () => import("@/pages/inclined-place-and-ball"),
  },
  {
    name: "Whiteboard",
    aim: "80",
    aimText: "Set the volume to 80",
    path: "/whiteboard",
    component: () => import("@/pages/whiteboard"),
  },
  {
    name: "Curling",
    aim: "80,85",
    aimText: "Set the volume to 80",
    path: "/curling",
    component: () => import("@/pages/curling"),
  },
];

export const mapPathToRoute = new Map<
  string,
  { index: number; route: RouteItem }
>(routes.map((route, index) => [route.path, { index, route }]));
