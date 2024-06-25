// changes euricom (add endpoint to get smoelenboek)

import { generateJsonFile } from "@/db/files"
import { getApplicationAccessToken } from "@/lib/server/auth"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // const json = await request.json()

  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', {
  //     status: 401,
  //   });
  // }

  // retrieve data from sharepoint (smoelenbook)
  const accessToken = (await getApplicationAccessToken()).access_token

  const s = await fetch(
    "https://graph.microsoft.com/v1.0/sites/euricom.sharepoint.com,f7f41bd5-d192-4a3f-aed3-52f69b021224,9c644b71-f2b7-4af3-8fc7-b12615162907/pages/a7e23c78-b05a-4c1b-8555-5508d032bdff/microsoft.graph.sitepage/webparts",
    {
      method: "GET",
      headers: {
        accept: "*/*",
        "accept-language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7",
        authorization: "Bearer " + accessToken,
        "cache-control": "no-cache",
        "client-request-id": "0c444de4-1c6a-7311-7b71-c0b31d6a4cc9",
        origin: "https://developer.microsoft.com",
        pragma: "no-cache",
        prefer: "ms-graph-dev-mode",
        referer: "https://developer.microsoft.com/",
        sdkversion: "GraphExplorer/4.0, graph-js/3.0.7 (featureUsage=6)",
        "sec-ch-ua":
          '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
      }
    }
  )

  const sm = await s.json()
  const smoelenbook = sm
  const bench = smoelenbook.value.find(
    (value: any) =>
      value.data.serverProcessedContent.searchablePlainTexts[0].value ===
      "Bench"
  )
  const staff = smoelenbook.value.find(
    (value: any) =>
      value.data.serverProcessedContent.searchablePlainTexts[0].value ===
      "Staff"
  )
  if (bench) {
    bench.data.serverProcessedContent.searchablePlainTexts[0].value =
      "Consultants on the bench for Euricom"
  }
  if (staff) {
    staff.data.serverProcessedContent.searchablePlainTexts[0].value =
      "Staff employees for Euricom"
  }

  const formattedsmoelenbook = smoelenbook.value.map((group: any) => {
    return {
      company: group.data.serverProcessedContent.searchablePlainTexts[0].value,
      people: group.data.properties.persons.map((person: any, i: number) => {
        return {
          mail: person.id,
          role: person.role,
          name: group.data.serverProcessedContent.searchablePlainTexts.find(
            (name: any) => name.key === `persons[${i}].name`
          ).value
        }
      })
    }
  })

  generateJsonFile(formattedsmoelenbook, "smoelenboek")

  return new Response(JSON.stringify("success"), {
    status: 200
  })
}

// GET /api/cron?action=smoelenbook&para1=2222
// GET /api/cron/smoelenbook?para1=2222
