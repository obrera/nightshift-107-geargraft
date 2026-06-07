const port = Number(process.env.PORT ?? 3000)
const dist = `${import.meta.dir}/dist`

Bun.serve({
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/healthz') {
      return Response.json({
        build: 107,
        name: 'GearGraft',
        ok: true,
      })
    }

    const pathname = url.pathname === '/' ? '/index.html' : url.pathname
    const file = Bun.file(`${dist}${pathname}`)

    if (await file.exists()) {
      return new Response(file)
    }

    return new Response(Bun.file(`${dist}/index.html`))
  },
  port,
})

console.log(`GearGraft serving on ${port}`)
