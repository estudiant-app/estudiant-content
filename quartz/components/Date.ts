import { GlobalConfiguration } from "../cfg"
import { QuartzPluginData } from "../plugins/vfile"

export type ValidDateType = keyof Required<QuartzPluginData>["dates"]

export function getDate(cfg: GlobalConfiguration, data: QuartzPluginData): Date | undefined {
  if (!cfg.defaultDateType) {
    throw new Error(
      `Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.`,
    )
  }
  return new global.Date(
    (data.frontmatter?.date ?? (data.dates?.[cfg.defaultDateType].getDate() ?? 0) / 1000) * 1000,
  )
}

export function formatDate(d: Date, locale = "en-US"): string {
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}
