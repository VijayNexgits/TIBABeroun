"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

type Errors = Partial<Record<"name" | "surname" | "email" | "phone" | "consent" | "atLeastOne", string>>

export function ContactForm() {
  const { toast } = useToast()
  const [name, setName] = React.useState("")
  const [surname, setSurname] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [note, setNote] = React.useState("")
  const [consent, setConsent] = React.useState(false)
  // const [interest, setInterest] = React.useState<string[]>([])
  // const [preferredTime, setPreferredTime] = React.useState<string[]>([])
  const [interest, setInterest] = React.useState<string[]>(["1+kk"])
  const [preferredTime, setPreferredTime] = React.useState<string[]>(["9-12 hodin"])
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<Errors>({})
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  const interestOptions = ["1+kk", "2+kk", "3+kk", "4+kk"]
  const timeOptions = ["9-12 hodin", "12-15 hodin", "15-18 hodin"]

  const toggleInterest = (option: string) => {
    setInterest((prev) =>
      prev.includes(option) ? prev.filter((i) => i !== option) : [...prev, option]
    )
  }

  const togglePreferredTime = (option: string) => {
    setPreferredTime((prev) =>
      prev.includes(option) ? prev.filter((t) => t !== option) : [...prev, option]
    )
  }

  function validate() {
    const e: Errors = {}

    if (!name.trim()) e.name = "Jméno je povinné."
    if (!surname.trim()) e.surname = "Příjmení je povinné."
    if (!email.trim() && !phone.trim()) {
      e.atLeastOne = "Zadejte alespoň e‑mail nebo telefon."
    }
    if (email.trim()) {
      // naive email regex for basic validation
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      if (!ok) e.email = "Zadejte platný e‑mail."
    }
    if (phone.trim()) {
      // allow +, digits, spaces, dashes and parentheses
      const ok = /^[+]?[\d\s\-()]{6,}$/.test(phone.trim())
      if (!ok) e.phone = "Zadejte platné telefonní číslo."
    }
    if (!consent) e.consent = "Je nutné udělit souhlas."

    setErrors(e)
    return { valid: Object.keys(e).length === 0, errors: e }
  }

  async function onSubmit(evd: React.FormEvent) {
    evd.preventDefault()
    setSuccessMessage(null)
    const { valid, errors: ve } = validate()
    if (!valid) {
      if (ve.atLeastOne) {
        toast({
          title: "Chybějící kontakt",
          description: "Zadejte alespoň e‑mail nebo telefon.",
          variant: "destructive",
        })
      }
      return
    }

    try {
      setLoading(true)

        const interestMap: Record<string, string> = {
        "1+kk": "1",
        "2+kk": "2",
        "3+kk": "3",
        "4+kk": "4"
      }

      // Map preferred time to codes
      const timeMap: Record<string, string> = {
        "9-12 hodin": "1",
        "12-15 hodin": "2",
        "15-18 hodin": "3"
      }


      // Build final note with interest and preferred time
      let finalNote = ""
      
      // if (interest.length > 0) {
      //   finalNote += `Zajímám se o: ${interest.join(", ")}\n`
      // }
      
      // if (preferredTime.length > 0) {
      //   finalNote += `Preferovaný čas hovoru: ${preferredTime.join(", ")}\n`
      // }
      
      if (note.trim()) {
        finalNote += `\nZpráva: ${note.trim()}`
      }

      const inquiryDispositionCodes = interest.map(item => interestMap[item]).filter(Boolean)
      
      // Get preferred time codes
      const preferredTimeCodes = preferredTime.map(item => timeMap[item]).filter(Boolean)

      const res = await fetch("/api/create-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          surname: surname.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          note: finalNote.trim() || undefined,
          consent: consent,
          inquiry_disposition_verona23: inquiryDispositionCodes.length > 0 ? inquiryDispositionCodes : undefined,
          preferred_call_time: preferredTimeCodes.length > 0 ? preferredTimeCodes : undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Odeslání se nezdařilo.")
      }

      setSuccessMessage("Děkujeme za odeslání formuláře. Brzy vás budeme kontaktovat.")

      toast({
        title: "Děkujeme!",
        description: "Brzy se vám ozveme.",
      })

      // reset form
      setName("")
      setSurname("")
      setEmail("")
      setPhone("")
      setNote("")
      setConsent(false)
      setInterest([])
      setPreferredTime([])
      setErrors({})
    } catch (err: any) {
      toast({
        title: "Chyba při odesílání",
        description: err?.message ?? "Zkuste to prosím znovu později.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">
            Jméno{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="name"
            placeholder="Jméno*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="bg-white border-white text-card-foreground placeholder:text-muted-foreground"
          />
          {errors.name ? (
            <p id="name-error" className="text-sm text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="surname">
            Příjmení{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="surname"
            placeholder="Příjmení*"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            aria-invalid={!!errors.surname}
            aria-describedby={errors.surname ? "surname-error" : undefined}
            className="bg-white border-white text-card-foreground placeholder:text-muted-foreground"
          />
          {errors.surname ? (
            <p id="surname-error" className="text-sm text-destructive">
              {errors.surname}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="bg-white border-white text-card-foreground placeholder:text-muted-foreground"
          />
          {errors.email ? (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="bg-white border-white text-card-foreground placeholder:text-muted-foreground"
          />
          {errors.phone ? (
            <p id="phone-error" className="text-sm text-destructive">
              {errors.phone}
            </p>
          ) : null}
        </div>

        {/* Interest Checkboxes */}
        <div className="flex flex-col gap-3">
          <Label>Zajímám se o:</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {interestOptions.map((option) => (
              <div key={option} className="flex items-center gap-2">
                <Checkbox
                  id={`interest-${option}`}
                  checked={interest.includes(option)}
                  onCheckedChange={() => toggleInterest(option)}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-primary"
                />
                <Label
                  htmlFor={`interest-${option}`}
                  className="font-normal cursor-pointer"
                  
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred Time Checkboxes */}
        <div className="flex flex-col gap-3">
          <Label>Preferovaný čas hovoru</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {timeOptions.map((option) => (
              <div key={option} className="flex items-center gap-2">
                <Checkbox
                  id={`time-${option}`}
                  checked={preferredTime.includes(option)}
                  onCheckedChange={() => togglePreferredTime(option)}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-primary"
                />
                <Label
                  htmlFor={`time-${option}`}
                  className="font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="note">Poznámka</Label>
          <Textarea
            id="note"
            placeholder="V případě zájmu nám zde můžete zanechat zprávu. Děkujeme."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            className="bg-white border-white text-card-foreground placeholder:text-muted-foreground"
          />
        </div>

        {errors.atLeastOne && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            {errors.atLeastOne}
          </div>
        )}



       <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(v) => setConsent(Boolean(v))}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-primary mt-1"
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor="consent" className="font-normal text-[#103758] text-sm leading-relaxed">
              Souhlasím se zasíláni novinek k projektům Verona 23 a.s.
            </Label>
            <p className="text-xs text-[#103758] leading-relaxed ">
              Odesláním formuláře souhlasím s poskytnutím osobních údajů. Vaše osobní údaje zpracováváme v souladu s GDPR.
            </p>
            <p className="text-xs text-[#103758] leading-relaxed">
              Více informací o{" "}
              <a href="#" className="underline hover:text-white">
                zpracování osobních údajů naleznete zde
              </a>
            </p>
          </div>
        </div>
        {errors.consent ? (
          <p id="consent-error" className="text-sm text-destructive -mt-2">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className=" bg-primary text-primary-foreground hover:bg-primary/90 h-11"
        disabled={loading}
      >
        {loading ? "Odesílám..." : "Spojte mě s makléřem"}
      </Button>

      {successMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-md border border-success/30 bg-success/10 p-3 text-center text-sm font-medium text-success-foreground"
        >
          {successMessage}
        </div>
      ) : null}

    </form>
  )
}