/* eslint-disable unicorn/prevent-abbreviations */
export const CARD_TYPE_ARRAY = [
  "de-next-rap8-x86",
  "hbjc386f951t-x86",
  "imx8mm-cgt-sx8m-rev-a",
  "k393x-mini-x86",
  "maaxboard-8ulp-welma",
  "qemuarm-welma",
  "raspberrypi4-64-welma",
  "sm2s-imx8plus-mbep5",
  "sm2s-imx93-mbep5",
  "stm32mp15-disco-welma",
  "tungsten-700-smarc-welma",
  "raspberrypi4-64",
  "",
] as const;

export const CARD_STATUS = ["RUNNING", "IDLE", "OFF"] as const;
export type CardType = (typeof CARD_TYPE_ARRAY)[number];
export type CardStatus = (typeof CARD_STATUS)[number];
