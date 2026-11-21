import { useEffect, type RefObject } from 'react'
import * as THREE from 'three'

type City = {
  n: string
  lat: number
  lon: number
  c: 'cn' | 'in'
  side?: 'l' | 'r'
  pos: THREE.Vector3
  el?: HTMLDivElement
}

function glowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const context = canvas.getContext('2d')!
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.25, 'rgba(255,140,80,.85)')
  gradient.addColorStop(1, 'rgba(255,120,60,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function GlobeCanvas({
  hostRef,
  labelsRef,
}: {
  hostRef: RefObject<HTMLElement | null>
  labelsRef: RefObject<HTMLDivElement | null>
}) {
  useEffect(() => {
    const canvas = document.getElementById('globe') as HTMLCanvasElement | null
    const host = hostRef.current
    const labelsEl = labelsRef.current
    if (!canvas || !host || !labelsEl) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200)
    camera.position.set(0, 0, 9)

    const R = 2
    const outer = new THREE.Group()
    scene.add(outer)
    const globe = new THREE.Group()
    outer.add(globe)

    const ll = (lat: number, lon: number, r = R) => {
      const phi = ((90 - lat) * Math.PI) / 180
      const th = ((lon + 180) * Math.PI) / 180
      return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th))
    }

    const loader = new THREE.TextureLoader()
    const tex = loader.load('https://cdn.jsdelivr.net/npm/three-globe@2.31.0/example/img/earth-dark.jpg')
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    const night = loader.load('https://cdn.jsdelivr.net/npm/three-globe@2.31.0/example/img/earth-night.jpg')
    night.colorSpace = THREE.SRGBColorSpace
    night.anisotropy = 8
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(R, 96, 96),
      new THREE.MeshPhongMaterial({
        map: tex,
        color: 0xc8d6f0,
        emissiveMap: night,
        emissive: 0xffd2a0,
        emissiveIntensity: 1.6,
        shininess: 18,
        specular: 0x2a3d66,
      }),
    )
    globe.add(earth)

    const gridMat = new THREE.LineBasicMaterial({ color: 0x3a5a9a, transparent: true, opacity: 0.14 })
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = []
      for (let lon = 0; lon <= 360; lon += 4) pts.push(ll(lat, lon, R * 1.002))
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat))
    }
    for (let lon = 0; lon < 360; lon += 30) {
      const pts: THREE.Vector3[] = []
      for (let lat = -90; lat <= 90; lat += 4) pts.push(ll(lat, lon, R * 1.002))
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat))
    }

    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.12, 64, 64),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec3 vN;void main(){float i=pow(max(.62-dot(vN,vec3(0.,0.,1.)),0.),3.);vec3 c=mix(vec3(.3,.55,1.),vec3(1.,.5,.3),.18);gl_FragColor=vec4(c,1.)*i*1.6;}`,
      }),
    )
    outer.add(atmo)
    const rim = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.01, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `varying vec3 vN;varying vec3 vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
        fragmentShader: `varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-max(dot(vN,vV),0.),3.5);gl_FragColor=vec4(vec3(.35,.6,1.)*f,f*.6);}`,
      }),
    )
    outer.add(rim)

    const starCount = 1400
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + Math.random() * 40)
      starPositions.set([v.x, v.y, v.z], i * 3)
    }
    const stars = new THREE.BufferGeometry()
    stars.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xaab8d8, size: 0.08, transparent: true, opacity: 0.6, depthWrite: false })))

    const cities: Record<string, City> = {
      shanghai: { n: 'Shanghai', lat: 31.23, lon: 121.47, c: 'cn', side: 'r', pos: ll(31.23, 121.47, R * 1.003) },
      yiwu: { n: 'Yiwu', lat: 29.31, lon: 120.08, c: 'cn', side: 'l', pos: ll(29.31, 120.08, R * 1.003) },
      guangzhou: { n: 'Guangzhou', lat: 23.13, lon: 113.26, c: 'cn', side: 'r', pos: ll(23.13, 113.26, R * 1.003) },
      shenzhen: { n: 'Shenzhen', lat: 22.54, lon: 114.06, c: 'cn', pos: ll(22.54, 114.06, R * 1.003) },
      mumbai: { n: 'Nhava Sheva', lat: 18.95, lon: 72.95, c: 'in', side: 'l', pos: ll(18.95, 72.95, R * 1.003) },
      chennai: { n: 'Chennai', lat: 13.08, lon: 80.27, c: 'in', side: 'r', pos: ll(13.08, 80.27, R * 1.003) },
      hyderabad: { n: 'Hyderabad', lat: 17.39, lon: 78.49, c: 'in', side: 'r', pos: ll(17.39, 78.49, R * 1.003) },
      vizag: { n: 'Vizag', lat: 17.69, lon: 83.22, c: 'in', pos: ll(17.69, 83.22, R * 1.003) },
    }

    const glow = glowTexture()
    const markers: { ring: THREE.Mesh; phase: number }[] = []
    Object.values(cities).forEach((city) => {
      const color = city.c === 'cn' ? 0xff4a36 : 0xffa040
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), new THREE.MeshBasicMaterial({ color }))
      dot.position.copy(city.pos)
      globe.add(dot)
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.03, 0.045, 32),
        new THREE.MeshBasicMaterial({ color, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
      )
      ring.position.copy(city.pos)
      ring.lookAt(city.pos.clone().multiplyScalar(2))
      globe.add(ring)
      markers.push({ ring, phase: Math.random() * 2 })
      if (city.side) {
        const el = document.createElement('div')
        el.className = 'glabel'
        el.innerHTML = `<svg class="flag"><use href="#flag-${city.c}"/></svg>${city.n}`
        labelsEl.appendChild(el)
        city.el = el
      }
    })

    const routes: [string, string, number, number][] = [
      ['shanghai', 'chennai', 0xff5a36, 0],
      ['yiwu', 'mumbai', 0xff7a3d, 0.33],
      ['guangzhou', 'vizag', 0xff9933, 0.66],
      ['shenzhen', 'hyderabad', 0x4cc9f0, 0.15],
      ['shanghai', 'hyderabad', 0xff5a36, 0.5],
      ['guangzhou', 'chennai', 0xffb35c, 0.82],
    ]
    const arcMat = (color: number, off: number) =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uT: { value: 0 }, uC: { value: new THREE.Color(color) }, uO: { value: off } },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `uniform float uT;uniform vec3 uC;uniform float uO;varying vec2 vUv;void main(){float h=fract(uT*.16+uO);float d=h-vUv.x;float tr=(d>0.&&d<.35)?pow(1.-d/.35,2.):0.;float a=.16+tr*1.2;a*=smoothstep(0.,.04,vUv.x)*smoothstep(1.,.96,vUv.x);gl_FragColor=vec4(uC*(1.+tr),a);}`,
      })

    const arcs: { curve: THREE.QuadraticBezierCurve3; mat: THREE.ShaderMaterial; head: THREE.Sprite; off: number }[] = []
    routes.forEach(([a, b, color, off]) => {
      const A = cities[a].pos
      const B = cities[b].pos
      const distance = A.distanceTo(B)
      const mid = A.clone().add(B).normalize().multiplyScalar(R + distance * 0.55)
      const curve = new THREE.QuadraticBezierCurve3(A, mid, B)
      const mat = arcMat(color, off)
      globe.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.007, 8, false), mat))
      const head = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glow, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      head.scale.setScalar(0.16)
      globe.add(head)
      arcs.push({ curve, mat, head, off })
    })

    scene.add(new THREE.AmbientLight(0xffffff, 0.55))
    const sun = new THREE.DirectionalLight(0xfff1e0, 1.7)
    sun.position.set(-5, 3, 6)
    scene.add(sun)
    const back = new THREE.DirectionalLight(0xff6a3d, 0.9)
    back.position.set(6, -2, -4)
    scene.add(back)

    const focus = ll(23, 98, 1)
    const baseY = -Math.atan2(focus.x, focus.z)
    const baseX = Math.asin(focus.y)
    outer.rotation.x = baseX
    globe.rotation.y = baseY

    let layoutX = 0
    let layoutY = 0
    let scale = 1
    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      const asp = w / h
      if (w > 820) {
        layoutX = Math.min(2.5, 1.05 * asp + 0.35)
        layoutY = -0.35
        scale = asp < 1.5 ? 1.35 : 1.5
      } else {
        layoutX = 0
        layoutY = 1.7
        scale = Math.min(0.8, asp * 1.12)
      }
      outer.position.set(layoutX, layoutY, 0)
      outer.scale.setScalar(scale)
    }
    resize()
    window.addEventListener('resize', resize)

    let mx = 0
    let my = 0
    const onPointer = (event: PointerEvent) => {
      mx = event.clientX / window.innerWidth - 0.5
      my = event.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    let visible = true
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(host)

    const tmp = new THREE.Vector3()
    const camDir = new THREE.Vector3()
    const center = new THREE.Vector3()
    const clock = new THREE.Clock()
    let intro = 0
    let alive = true
    let raf = 0

    const frame = () => {
      if (!alive) return
      raf = requestAnimationFrame(frame)
      if (!visible) return
      const t = clock.getElapsedTime()
      intro = Math.min(1, intro + 0.012)
      const ei = ease(intro)
      const sway = reduceMotion ? 0 : Math.sin(t * 0.25) * 0.18
      globe.rotation.y += (baseY + sway + mx * 0.35 - (1 - ei) * 1.4 - globe.rotation.y) * 0.05
      outer.rotation.x += (baseX + my * 0.15 - outer.rotation.x) * 0.05
      outer.scale.setScalar(scale * (0.8 + 0.2 * ei))
      arcs.forEach((arc) => {
        arc.mat.uniforms.uT.value = reduceMotion ? 2 : t
        const h = (((reduceMotion ? 2 : t) * 0.16 + arc.off) % 1)
        arc.head.position.copy(arc.curve.getPoint(h))
        arc.head.material.opacity = Math.sin(h * Math.PI)
      })
      markers.forEach((marker) => {
        const k = (t * 0.6 + marker.phase) % 1
        marker.ring.scale.setScalar(1 + k * 2.2)
        ;(marker.ring.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.9
      })
      renderer.render(scene, camera)

      const w = host.clientWidth
      const h = host.clientHeight
      outer.getWorldPosition(center)
      Object.values(cities).forEach((city) => {
        if (!city.el) return
        tmp.copy(city.pos)
        globe.localToWorld(tmp)
        camDir.copy(camera.position).sub(tmp).normalize()
        const normal = tmp.clone().sub(center).normalize()
        const facing = normal.dot(camDir)
        tmp.project(camera)
        const x = (tmp.x * 0.5 + 0.5) * w
        const y = (-tmp.y * 0.5 + 0.5) * h
        const tx = city.side === 'l' ? 'calc(-100% - 10px)' : '10px'
        city.el.style.transform = `translate(${x}px,${y}px) translate(${tx},-50%)`
        city.el.style.opacity = facing > 0.15 && ei > 0.9 ? '1' : '0'
      })
    }
    frame()

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      observer.disconnect()
      labelsEl.replaceChildren()
      renderer.dispose()
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
        const material = mesh.material
        if (Array.isArray(material)) material.forEach((item) => item.dispose())
        else material?.dispose()
      })
    }
  }, [hostRef, labelsRef])

  return <canvas id="globe" aria-hidden="true" />
}
