import { ContactForm } from "@/components/contact-form"

export default function Page() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <section className="w-full max-w-xl rounded-lg border "   style={{ backgroundColor: '#8EAD96' ,color: '#103758'}}>
        <div className="p-6 md:p-8">
          <header className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-balance " style={{ color: '#103758' }}>Spojte se s námi – rychlý kontakt</h1>
            <p className="mt-2 text-muted-foreground text-pretty" style={{ color: '#103758' }}>
              Stačí pár údajů a náš makléř vám zavolá nebo napíše.
            </p>
          </header>
          <ContactForm />
        </div>
      </section>

      {/* Optional: reference images (not rendered by default). If you want to embed, use Source URLs like below.
      <div className="sr-only">
        <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sRnEVbAjaJx26ztEZsZXmCMRPpOfWf.png" alt="Form design reference" width={644} height={695} />
        <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5KvD3hvklSss7NbrAFAaKIZMi1RIfF.png" alt="API call reference" width={1517} height={705} />
      </div>
      */}
    </main>
  )
}
