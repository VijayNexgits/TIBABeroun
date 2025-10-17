// import { type NextRequest, NextResponse } from "next/server"

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json().catch(() => ({}))
//     const {
//       name,
//       surname,
//       email,
//       phone,
//       note,
//       consent,
//     }: {
//       name?: string
//       surname?: string
//       email?: string
//       phone?: string
//       note?: string
//       consent?: boolean
//     } = body

//     // Basic server-side validation mirrors client rules
//     if (!name?.trim() || !surname?.trim()) {
//       return NextResponse.json({ message: "Jméno a Příjmení jsou povinné." }, { status: 400 })
//     }
//     if (!email?.trim() && !phone?.trim()) {
//       return NextResponse.json({ message: "Zadejte alespoň e‑mail nebo telefon." }, { status: 400 })
//     }
//     if (!consent) {
//       return NextResponse.json({ message: "Je nutné udělit souhlas." }, { status: 400 })
//     }

//     const endpoint = process.env.REALPAD_ENDPOINT || "https://cms.realpad.eu/ws/v10/create-lead"
//     const project =  "39264441"
//     const referral = process.env.REALPAD_REFERRAL_ID || "1"
//     const consentsJson = '["39268430","39268447"]'
//     const authorization = process.env.REALPAD_AUTHORIZATION // optional: e.g. "Bearer <token>" or "Basic <base64>"

//     if (!project) {
//       return NextResponse.json(
//         { message: "Chybí REALPAD_PROJECT_ID. Nastavte jej prosím ve Vars a zkuste to znovu." },
//         { status: 500 },
//       )
//     }

//     const fd = new FormData()
//     fd.append("name", name.trim())
//     fd.append("surname", surname.trim())
//     if (phone?.trim()) fd.append("phone", phone.trim())
//     if (email?.trim()) fd.append("email", email.trim())
//     if (note?.trim()) fd.append("note", note.trim())
//     fd.append("project", project)
//     fd.append("referral", referral)
//     if (consentsJson) {
//       // keep as JSON string as shown in the Postman screenshot
//       fd.append("consents", consentsJson)
//     }

//     const headers: Record<string, string> = {}
//     if (authorization) headers["Authorization"] = authorization

//     const res = await fetch(endpoint, {
//       method: "POST",
//       headers,
//       body: fd,
//       // no need to set Content-Type for FormData, the boundary will be set automatically
//     })

//     // Some endpoints return raw text/ids; try json first then text
//     if (!res.ok) {
//       const text = await res.text()
//       return NextResponse.json({ message: text || "Realpad API error." }, { status: res.status })
//     }

//     let payload: any
//     const ct = res.headers.get("content-type") || ""
//     if (ct.includes("application/json")) {
//       payload = await res.json()
//     } else {
//       payload = { result: await res.text() }
//     }

//     return NextResponse.json(payload, { status: 200 })
//   } catch (err: any) {
//     return NextResponse.json({ message: err?.message || "Neočekávaná chyba na serveru." }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const {
      name,
      surname,
      email,
      phone,
      note,
      consent,
    }: {
      name?: string
      surname?: string
      email?: string
      phone?: string
      note?: string
      consent?: boolean
    } = body

    // Basic server-side validation mirrors client rules
    if (!name?.trim() || !surname?.trim()) {
      return NextResponse.json({ message: "Jméno a Příjmení jsou povinné." }, { status: 400 })
    }
    if (!email?.trim() && !phone?.trim()) {
      return NextResponse.json({ message: "Zadejte alespoň e‑mail nebo telefon." }, { status: 400 })
    }
    if (!consent) {
      return NextResponse.json({ message: "Je nutné udělit souhlas." }, { status: 400 })
    }

    // Updated endpoint to match your image
    const endpoint = process.env.REALPAD_ENDPOINT || "https://cms.realpad.eu/ws/v10/create-lead"
    
    // Credentials from your Postman image
    const login = process.env.REALPAD_LOGIN || "petr.tylk.verona.23"
    const password = process.env.REALPAD_PASSWORD || "HupNJf4cGuSCSGf"
    const project = process.env.REALPAD_PROJECT_ID || "39264382"
    const referral = process.env.REALPAD_REFERRAL_ID || "1"
    const consentsJson = '["39268430","39268447"]'

    const fd = new FormData()
    // Add login and password as shown in Postman
    fd.append("login", login)
    fd.append("password", password)
    fd.append("name", name.trim())
    fd.append("surname", surname.trim())
    if (phone?.trim()) fd.append("phone", phone.trim())
    if (email?.trim()) fd.append("email", email.trim())
    if (note?.trim()) fd.append("note", note.trim())
    fd.append("project", project)
    fd.append("referral", referral)
    fd.append("consents", consentsJson)

    const res = await fetch(endpoint, {
      method: "POST",
      body: fd,
      // FormData automatically sets Content-Type with boundary
    })

    // Handle response
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ message: text || "Realpad API error." }, { status: res.status })
    }

    let payload: any
    const ct = res.headers.get("content-type") || ""
    if (ct.includes("application/json")) {
      payload = await res.json()
    } else {
      payload = { result: await res.text() }
    }

    return NextResponse.json(payload, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Neočekávaná chyba na serveru." }, { status: 500 })
  }
}