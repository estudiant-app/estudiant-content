import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export function byDateAndAlphabetical(
  cfg: GlobalConfiguration,
): (f1: QuartzPluginData, f2: QuartzPluginData) => number {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

type Props = {
  limit?: number
} & QuartzComponentProps

export function PageList({ cfg, fileData, allFiles, limit }: Props) {
  let list = allFiles.sort(byDateAndAlphabetical(cfg))
  if (limit) {
    list = list.slice(0, limit)
  }

  return (
    <ul class="section-ul">
      {list.map((page) => {
        const typeToDisplayTextMapping = {
          subject: 'Assunto',
          homework: 'Atividade'
        }

        type TypeDisplayMapping = 'subject' | 'homework'

        const title = page.frontmatter?.title
        const tags = page.frontmatter?.tags ?? []
        const type = page.frontmatter?.type as TypeDisplayMapping

        return (
          <li class="section-li">
            <div class="section">
              <div class="title">
                <h3>
                  <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                    {title}
                  </a>
                </h3>

                <p class='type'>
                  {typeToDisplayTextMapping[type]}
                </p>
              </div>

              <div class="information">
                <ul class="tags">
                  {tags.map((tag) => (
                    <li>
                      <a
                        class="internal tag-link"
                        href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}>
                        <p class='text'>#{tag}</p>
                      </a>
                    </li>
                  ))}
                </ul>

                {page.dates && (
                  <p class="metadata-date">
                    <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                  </p>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`
