// changes euricom (add endpoint to get smoelenboek)

import { generateOwnFile } from "@/db/files"
import { getApplicationAccessToken } from "@/lib/server/auth"

export const dynamic = "force-dynamic" // defaults to auto

export async function GET() {
  // retrieve data from sharepoint (smoelenbook)
  const accessToken = (await getApplicationAccessToken()).access_token
  const siteId =
    "euricom.sharepoint.com,f7f41bd5-d192-4a3f-aed3-52f69b021224,9c644b71-f2b7-4af3-8fc7-b12615162907"
  const pageId = "a7e23c78-b05a-4c1b-8555-5508d032bdff"

  const s = await fetch(
    `https://graph.microsoft.com/v1.0/sites/${siteId}/pages/${pageId}/microsoft.graph.sitepage/webparts`,
    {
      method: "GET",
      headers: {
        authorization: "Bearer " + accessToken
      }
    }
  )

  const sharepointPageDetails = await fetch(
    `https://graph.microsoft.com/v1.0/sites/${siteId}/pages/${pageId}`,
    {
      method: "GET",
      headers: {
        authorization: "Bearer " + accessToken
      }
    }
  )

  const { lastModifiedDateTime } = await sharepointPageDetails.json()

  const smoelenbook = await s.json()

  const formattedsmoelenbook = smoelenbook.value
    .map((group: any) => {
      if (group.data.properties.persons) {
        return {
          company:
            group.data.serverProcessedContent.searchablePlainTexts[0].value ||
            "",
          people: group.data.properties.persons.map(
            (person: any, i: number) => {
              return {
                mail: person.id,
                role: person.role,
                name: group.data.serverProcessedContent.searchablePlainTexts.find(
                  (name: any) => name.key === `persons[${i}].name`
                ).value
              }
            }
          )
        }
      }
    })
    .filter(Boolean)

  let text =
    "Dit is een overzicht van alle werknemers van euricom. Dit overzicht bevat de staff members, de bench en alle klanten waar euricom consultants momenteel aan het werk zijn:\n"
  formattedsmoelenbook.forEach((value: any) => {
    switch (value.company) {
      case "Bench": {
        text +=
          "Deze consultants zitten momenteel op de bench (ookwel bank genoemd) voor Euricom. Dit betekent dat ze even geen klant hebben en dus bezig zijn met interne projecten voor euricom of met bijstuderen:\n"
        break
      }
      case "Staff": {
        text += "Dit zijn alle staff members van Euricom:\n"
        break
      }
      default:
        text += `Dit zijn alle euricom consultants die momenteel bij ${value.company} aan het werk zijn:\n`
    }

    value.people.forEach(
      (person: any) =>
        (text += `\t- ${person.name}: Dit is een ${person.role} en deze persoon is contacteerbaar via ${person.mail}\n`)
    )
  })

  await generateOwnFile(
    { lastModifiedDateTime, ...formattedsmoelenbook },
    "smoelenboek",
    "json"
  )

  return new Response(JSON.stringify("success"), {
    status: 200
  })
}
