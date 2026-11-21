import { useEffect, type RefObject } from 'react'
import * as THREE from 'three'

const WAVES: [number, number, number, number, number][] = [
  [0.96, 0.28, 0.1, 0.95, 1],
  [-0.37, 0.93, 0.16, 0.55, 1.3],
  [0.71, 0.71, 0.31, 0.22, 1.9],
  [-0.97, 0.24, 0.55, 0.09, 2.5],
  [0.2, -0.98, 0.8, 0.05, 3.1],
]

const waveGLSL = WAVES.map(
  (wave) =>
    `{vec2 dir=normalize(vec2(${wave[0].toFixed(3)},${wave[1].toFixed(3)}));float ph=dot(p,dir)*${wave[2].toFixed(3)}+uTime*${wave[4].toFixed(3)};h+=${wave[3].toFixed(3)}*sin(ph);g+=${wave[3].toFixed(3)}*${wave[2].toFixed(3)}*cos(ph)*dir;}`,
).join('\n')

function waveJS(x: number, z: number, t: number) {
  let h = 0
  let gx = 0
  let gz = 0
  WAVES.forEach((wave) => {
    const length = Math.hypot(wave[0], wave[1])
    const dx = wave[0] / length
    const dz = wave[1] / length
    const phase = (x * dx + z * dz) * wave[2] + t * wave[4]
    h += wave[3] * Math.sin(phase)
    const crest = wave[3] * wave[2] * Math.cos(phase)
    gx += crest * dx
    gz += crest * dz
  })
  return { h, gx, gz }
}

function glowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,120,60,0)') {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const context = canvas.getContext('2d')!
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, inner)
  gradient.addColorStop(0.25, 'rgba(255,140,80,.85)')
  gradient.addColorStop(1, outer)
  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function canvasTex(w: number, h: number, draw: (context: CanvasRenderingContext2D, w: number, h: number) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  draw(canvas.getContext('2d')!, w, h)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

export function ShipCanvas({
  sectionRef,
  hostRef,
}: {
  sectionRef: RefObject<HTMLElement | null>
  hostRef: RefObject<HTMLDivElement | null>
}) {
  useEffect(() => {
    const section = sectionRef.current
    const host = hostRef.current
    const canvas = document.getElementById('sea') as HTMLCanvasElement | null
    if (!section || !host || !canvas) return

    const steps = [...section.querySelectorAll<HTMLElement>('.j-step')]
    const fill = section.querySelector<HTMLElement>('.j-fill')
    const boat = section.querySelector<HTMLElement>('.j-boat')
    const dayEl = section.querySelector<HTMLElement>('.j-day')
    if (!fill || !boat || !dayEl) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 820px)').matches
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const smooth = (t: number) => t * t * (3 - 2 * t)
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    const scene = new THREE.Scene()
    const FOG = new THREE.Color(0x3b3550)
    const FOG_NEAR = 90
    const FOG_FAR = 420
    scene.fog = new THREE.Fog(FOG, FOG_NEAR, FOG_FAR)
    const camera = new THREE.PerspectiveCamera(42, 1, 0.5, 3000)
    const SUN = new THREE.Vector3(1, 0.09, -0.55).normalize()

    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(1500, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { uSun: { value: SUN } },
        vertexShader: `varying vec3 vD;void main(){vD=position;vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position=p.xyww;}`,
        fragmentShader: `uniform vec3 uSun;varying vec3 vD;void main(){vec3 d=normalize(vD);float h=d.y;vec3 top=vec3(.03,.05,.13),mid=vec3(.16,.17,.33),hor=vec3(.98,.5,.32);vec3 c=mix(hor,mid,smoothstep(-.02,.22,h));c=mix(c,top,smoothstep(.22,.75,h));float s=max(dot(d,uSun),0.);c+=vec3(1.,.62,.35)*(pow(s,600.)*6.+pow(s,24.)*.45+pow(s,4.)*.12);if(h<0.)c=mix(hor*.7,vec3(.23,.21,.31),smoothstep(0.,-.08,h));gl_FragColor=vec4(c,1.);}`,
      }),
    )
    sky.frustumCulled = false
    scene.add(sky)

    const OCEAN_SIZE = 900
    const SEG = mobile ? 160 : 240
    const oceanGeo = new THREE.PlaneGeometry(OCEAN_SIZE, OCEAN_SIZE, SEG, SEG)
    oceanGeo.rotateX(-Math.PI / 2)
    const oceanMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSun: { value: SUN },
        uFog: { value: FOG },
        uNear: { value: FOG_NEAR },
        uFar: { value: FOG_FAR },
      },
      vertexShader: `uniform float uTime;varying vec3 vW;varying vec3 vN;void main(){vec4 wp=modelMatrix*vec4(position,1.);vec2 p=wp.xz;float h=0.;vec2 g=vec2(0.);${waveGLSL}float far=clamp(1.-length(p-cameraPosition.xz)/700.,0.,1.);wp.y+=h*far;vW=wp.xyz;vN=normalize(vec3(-g.x*far,1.,-g.y*far));gl_Position=projectionMatrix*viewMatrix*wp;}`,
      fragmentShader: `uniform vec3 uSun,uFog;uniform float uNear,uFar;varying vec3 vW;varying vec3 vN;void main(){vec3 n=normalize(vN);vec3 v=normalize(cameraPosition-vW);float fr=pow(1.-max(dot(n,v),0.),4.);vec3 deep=vec3(.015,.05,.11),shal=vec3(.05,.20,.30);vec3 base=mix(deep,shal,clamp(vW.y*.35+.45,0.,1.));vec3 skyc=mix(vec3(.25,.22,.38),vec3(1.,.55,.33),pow(max(dot(reflect(-v,n),uSun),0.),3.));vec3 c=mix(base,skyc,clamp(fr*.9+.06,0.,1.));vec3 hv=normalize(uSun+v);float sp=pow(max(dot(n,hv),0.),260.)*3.+pow(max(dot(n,hv),0.),40.)*.25;c+=vec3(1.,.72,.45)*sp;float foam=smoothstep(1.05,1.6,vW.y);c=mix(c,vec3(.85,.88,.95),foam*.35);float d=length(cameraPosition-vW);c=mix(c,uFog,smoothstep(uNear,uFar,d));gl_FragColor=vec4(c,1.);}`,
    })
    const ocean = new THREE.Mesh(oceanGeo, oceanMat)
    ocean.frustumCulled = false
    scene.add(ocean)

    scene.add(new THREE.HemisphereLight(0x8fa0d8, 0x2a1e22, 0.9))
    const sunL = new THREE.DirectionalLight(0xffc89a, 2.6)
    sunL.position.copy(SUN).multiplyScalar(200)
    scene.add(sunL)
    scene.add(sunL.target)
    const fillL = new THREE.DirectionalLight(0x6a88ff, 0.6)
    fillL.position.set(-80, 60, 120)
    scene.add(fillL)

    const std = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.15, ...extra })
    const box = (w: number, h: number, d: number, material: THREE.Material, x = 0, y = 0, z = 0, parent: THREE.Object3D = scene) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
      mesh.position.set(x, y, z)
      parent.add(mesh)
      return mesh
    }

    const ship = new THREE.Group()
    scene.add(ship)
    const L = 44
    const W = 7.4
    const H = 4.2
    {
      const geometry = new THREE.BoxGeometry(L, H, W, 40, 10, 4)
      const position = geometry.attributes.position
      const colors: number[] = []
      for (let i = 0; i < position.count; i++) {
        let x = position.getX(i)
        let y = position.getY(i)
        let z = position.getZ(i)
        const bow = L / 2 - 8
        if (x > bow) {
          const k = (x - bow) / 8
          z *= 1 - k * k * 0.92
          if (y < 0) x -= k * 1.6 * (-y / H)
        }
        if (x < -L / 2 + 1) z *= 0.94
        if (y < 0) z *= 1 - (-y / H) * 0.35
        position.setXYZ(i, x, y, z)
        const yy = y + H / 2
        const color = yy < 1.5 ? [0.62, 0.09, 0.07] : yy < 1.75 ? [0.92, 0.92, 0.95] : [0.07, 0.09, 0.14]
        colors.push(...color)
      }
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      geometry.computeVertexNormals()
      const hull = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.25 }))
      hull.position.y = 0.3
      ship.add(hull)
    }

    const DECK = 0.3 + H / 2
    const white = std(0xe9edf3, { roughness: 0.5 })
    const dark = std(0x10151f, { roughness: 0.3, metalness: 0.5 })
    box(6, 8, 6.6, white, -17, DECK + 4, 0, ship)
    box(6.05, 0.55, 6.65, dark, -17, DECK + 6.4, 0, ship)
    box(6.05, 0.55, 6.65, dark, -17, DECK + 4.6, 0, ship)
    box(6.05, 0.55, 6.65, dark, -17, DECK + 2.8, 0, ship)
    box(3.4, 1.1, 10.2, white, -15.6, DECK + 8.4, 0, ship)
    box(3.45, 0.5, 10.25, dark, -15.6, DECK + 8.5, 0, ship)
    const funnel = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 4.4, 20), std(0xd8332a))
    funnel.position.set(-19.2, DECK + 9.6, 0)
    ship.add(funnel)
    const band = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.6, 20), white)
    band.position.set(-19.2, DECK + 10.6, 0)
    ship.add(band)
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 7, 8), white)
    mast.position.set(18, DECK + 3.5, 0)
    ship.add(mast)
    const navLight = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture(),
        color: 0xff5040,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    navLight.position.set(18, DECK + 7.2, 0)
    navLight.scale.setScalar(2.4)
    ship.add(navLight)

    const brand = canvasTex(1024, 128, (context, w, h) => {
      context.clearRect(0, 0, w, h)
      context.fillStyle = '#fff'
      context.font = '800 92px Sora, Arial Black, sans-serif'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText('IMPORTNOW', w / 2, h / 2 + 4)
    })
    const brandMat = new THREE.MeshBasicMaterial({ map: brand, transparent: true, depthWrite: false, fog: true })
    const brandA = new THREE.Mesh(new THREE.PlaneGeometry(17, 2.1), brandMat)
    brandA.position.set(1, DECK - 1.2, W / 2 + 0.02)
    ship.add(brandA)
    const brandB = brandA.clone()
    brandB.rotation.y = Math.PI
    brandB.position.z = -W / 2 - 0.02
    ship.add(brandB)

    const corrugation = canvasTex(256, 128, (context, w, h) => {
      context.fillStyle = '#fff'
      context.fillRect(0, 0, w, h)
      for (let x = 0; x < w; x += 8) {
        context.fillStyle = 'rgba(0,0,0,.16)'
        context.fillRect(x, 0, 3, h)
        context.fillStyle = 'rgba(255,255,255,.4)'
        context.fillRect(x + 4, 0, 1, h)
      }
      context.strokeStyle = 'rgba(0,0,0,.35)'
      context.lineWidth = 6
      context.strokeRect(0, 0, w, h)
    })
    const CW = 3.05
    const CH = 1.32
    const CD = 1.5
    const palette = [0xd64533, 0xef8a24, 0x2f6fb3, 0x1f9e8f, 0xc9ced6, 0x8c2f39, 0xe3b23c, 0xd64533, 0x2f6fb3]
    const slots: { x: number; y: number; z: number; col: number }[] = []
    for (let layer = 0; layer < 3; layer++) {
      for (let column = 0; column < 9; column++) {
        for (let row = 0; row < 4; row++) {
          if (layer === 2 && (column === 0 || column === 8) && (row === 0 || row === 3)) continue
          slots.push({
            x: -11.6 + column * 3.12,
            y: DECK + CH / 2 + layer * (CH + 0.03),
            z: -2.4 + row * 1.6,
            col: palette[(column * 3 + row * 5 + layer * 7) % palette.length],
          })
        }
      }
    }
    const count = slots.length
    const containers = new THREE.InstancedMesh(
      new THREE.BoxGeometry(CW, CH, CD),
      new THREE.MeshStandardMaterial({ map: corrugation, roughness: 0.7, metalness: 0.25 }),
      count,
    )
    containers.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    slots.forEach((slot, index) => containers.setColorAt(index, new THREE.Color(slot.col)))
    ship.add(containers)
    const dummy = new THREE.Object3D()

    const wake = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 16).rotateX(-Math.PI / 2),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uT: { value: 0 }, uA: { value: 0 } },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `uniform float uT,uA;varying vec2 vUv;float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}void main(){float x=vUv.x;float y=abs(vUv.y-.5)*2.;float w=mix(1.,.28,x);float e=smoothstep(w,w-.3,y)*(.55+.45*smoothstep(w-.25,w-.05,y));float n=ns(vec2(x*55.-uT*4.,vUv.y*14.))*.6+ns(vec2(x*120.-uT*7.,vUv.y*30.))*.4;float a=e*smoothstep(0.,.75,x)*smoothstep(1.,.97,x)*n*uA;gl_FragColor=vec4(vec3(.92,.95,1.),a*.75);}`,
      }),
    )
    wake.position.y = 0.9
    scene.add(wake)
    const wakeMat = wake.material as THREE.ShaderMaterial

    const flagCN = canvasTex(150, 100, (context) => {
      context.fillStyle = '#de2910'
      context.fillRect(0, 0, 150, 100)
      context.fillStyle = '#ffde00'
      const star = (cx: number, cy: number, r: number) => {
        context.beginPath()
        for (let i = 0; i < 10; i++) {
          const angle = -Math.PI / 2 + (i * Math.PI) / 5
          const radius = i % 2 ? r * 0.4 : r
          context.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
        }
        context.fill()
      }
      star(25, 25, 15)
      star(50, 10, 5)
      star(60, 20, 5)
      star(60, 35, 5)
      star(50, 45, 5)
    })
    const flagIN = canvasTex(150, 100, (context) => {
      context.fillStyle = '#ff9933'
      context.fillRect(0, 0, 150, 34)
      context.fillStyle = '#fff'
      context.fillRect(0, 33, 150, 34)
      context.fillStyle = '#138808'
      context.fillRect(0, 66, 150, 34)
      context.strokeStyle = '#000080'
      context.lineWidth = 3
      context.beginPath()
      context.arc(75, 50, 13, 0, 7)
      context.stroke()
      for (let i = 0; i < 24; i++) {
        const angle = (i * Math.PI) / 12
        context.beginPath()
        context.moveTo(75, 50)
        context.lineTo(75 + Math.cos(angle) * 13, 50 + Math.sin(angle) * 13)
        context.lineWidth = 1
        context.stroke()
      }
    })

    const flags: THREE.Mesh[] = []
    const port = (x0: number, craneColor: number, flagTex: THREE.Texture) => {
      const group = new THREE.Group()
      group.position.x = x0
      scene.add(group)
      const concrete = std(0x4a4f5c, { roughness: 0.9 })
      const crane = std(craneColor, { roughness: 0.5, metalness: 0.4 })
      box(160, 3.2, 16, concrete, 0, 0.9, -15, group)
      box(160, 0.3, 0.4, std(0xffcf5c, { emissive: 0x5a4010 }), 0, 2.6, -7.2, group)
      ;[-10, 12].forEach((cx) => {
        ;[-2.2, 2.2].forEach((lx) => {
          ;[-9, -20].forEach((lz) => box(0.9, 26, 0.9, crane, cx + lx, 15.5, lz, group))
        })
        box(5.3, 1.2, 1.2, crane, cx, 27, -9, group)
        box(5.3, 1.2, 1.2, crane, cx, 27, -20, group)
        box(1.4, 1.4, 34, crane, cx, 29, -5, group)
        box(2.2, 1.4, 2.6, std(0x222833), cx, 27.6, 1, group)
        box(0.12, 16, 0.12, std(0x111111), cx, 19.5, 1, group)
        box(2.2, 3, 2.2, std(0x223044), cx, 30.5, -21, group)
      })
      const quayCount = 60
      const quay = new THREE.InstancedMesh(
        new THREE.BoxGeometry(CW, CH, CD),
        new THREE.MeshStandardMaterial({ map: corrugation, roughness: 0.7 }),
        quayCount,
      )
      for (let i = 0; i < quayCount; i++) {
        const column = i % 15
        const row = Math.floor(i / 15)
        const stack = 1 + ((i * 7) % 3)
        dummy.position.set(-34 + column * 4.6, 2.5 + CH / 2 + (row % 2) * CH, -12.5 - Math.floor(row / 2) * 1.7 - row * 1.65)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.set(1, 1, 1)
        dummy.updateMatrix()
        quay.setMatrixAt(i, dummy.matrix)
        quay.setColorAt(i, new THREE.Color(palette[(i * 5 + stack) % palette.length]))
      }
      group.add(quay)
      box(30, 9, 10, std(0x6b7385), 40, 7, -19, group)
      box(30.2, 1, 10.2, std(craneColor), 40, 11.6, -19, group)
      box(0.25, 14, 0.25, std(0xdddddd), -28, 8.5, -8.5, group)
      const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(5.4, 3.6, 12, 4),
        new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide }),
      )
      flag.position.set(-25.2, 13.6, -8.5)
      group.add(flag)
      flags.push(flag)
      for (let lx = -70; lx <= 70; lx += 28) {
        box(0.2, 8, 0.2, std(0x999999), lx, 6.6, -7.8, group)
        const lamp = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glowTexture('rgba(255,240,200,1)', 'rgba(255,200,120,0)'),
            color: 0xffe0b0,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        )
        lamp.position.set(lx, 10.8, -7.8)
        lamp.scale.setScalar(3)
        group.add(lamp)
      }
    }

    const SAIL = 420
    port(0, 0xc23b2c, flagCN)
    port(SAIL, 0xf08a24, flagIN)
    const islandMat = std(0x2a2b3d, { roughness: 1, flatShading: true })
    for (let i = 0; i < 14; i++) {
      const radius = 6 + Math.random() * 16
      const island = new THREE.Mesh(new THREE.ConeGeometry(radius, radius * 0.5 + Math.random() * 8, 7), islandMat)
      island.position.set(40 + i * 30 + Math.random() * 20, 0, -120 - Math.random() * 140 * (i % 2 ? 1 : 0))
      if (i % 2 === 0) island.position.z = -150 - Math.random() * 80
      scene.add(island)
    }

    const shipX = (progress: number) => (progress < 0.42 ? 0 : progress > 0.86 ? SAIL : ease((progress - 0.42) / 0.44) * SAIL)
    const keyframes = [
      { p: 0, o: [42, 30, 56], l: [0, 4, 0] },
      { p: 0.14, o: [8, 38, 62], l: [0, 4, -4] },
      { p: 0.28, o: [-38, 22, 46], l: [2, 5, -2] },
      { p: 0.42, o: [-58, 14, 30], l: [6, 4, 0] },
      { p: 0.52, o: [-44, 9, 34], l: [8, 4, 0] },
      { p: 0.64, o: [38, 10, 54], l: [0, 4, 0] },
      { p: 0.76, o: [58, 14, 40], l: [-6, 4, 0] },
      { p: 0.86, o: [30, 24, 58], l: [0, 4, -6] },
      { p: 1, o: [-18, 48, 84], l: [4, 2, -10] },
    ]
    const offset = new THREE.Vector3()
    const look = new THREE.Vector3()
    let camDist = 1.15
    const camAt = (progress: number, sx: number) => {
      let i = 0
      while (i < keyframes.length - 2 && progress > keyframes[i + 1].p) i++
      const a = keyframes[i]
      const b = keyframes[i + 1]
      const t = smooth(clamp((progress - a.p) / (b.p - a.p), 0, 1))
      offset.set(lerp(a.o[0], b.o[0], t), lerp(a.o[1], b.o[1], t), lerp(a.o[2], b.o[2], t))
      look.set(lerp(a.l[0], b.l[0], t), lerp(a.l[1], b.l[1], t), lerp(a.l[2], b.l[2], t))
      camera.position.set(sx + offset.x * camDist, offset.y * camDist, offset.z * camDist)
      camera.lookAt(sx + look.x, look.y, look.z)
    }

    const updateContainers = (progress: number) => {
      for (let i = 0; i < count; i++) {
        const slot = slots[i]
        const loaded = clamp((progress - (0.06 + (i / count) * 0.28)) / 0.035, 0, 1)
        const easedLoad = ease(loaded)
        const unloaded = clamp((progress - (0.885 + ((count - 1 - i) / count) * 0.09)) / 0.02, 0, 1)
        const easedUnload = ease(unloaded)
        let y = slot.y + (1 - easedLoad) * 18
        let z = slot.z
        let scale = loaded > 0 ? 1 : 0
        if (easedUnload > 0) {
          y = slot.y + Math.sin(easedUnload * Math.PI) * 14 + easedUnload * -1.5
          z = lerp(slot.z, -13.5, easedUnload)
          scale = easedUnload > 0.98 ? 0 : 1
        }
        dummy.position.set(slot.x, y, z)
        dummy.rotation.set(0, (1 - easedLoad) * 0.25, 0)
        dummy.scale.setScalar(scale)
        dummy.updateMatrix()
        containers.setMatrixAt(i, dummy.matrix)
      }
      containers.instanceMatrix.needsUpdate = true
    }

    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.fov = w < 820 ? 58 : 42
      if (w > 820) camera.setViewOffset(w, h, -w * 0.17, 0, w, h)
      else camera.clearViewOffset()
      camDist = w < 820 ? 1.25 : 1.15
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    let target = 0
    let progress = 0
    let lastStep = -1
    let lastX = 0
    let visible = false
    const snap = location.hash === '#snap'
    const readScroll = () => {
      const rect = section.getBoundingClientRect()
      target = clamp(-rect.top / (rect.height - window.innerHeight), 0, 1)
    }
    readScroll()
    progress = target
    window.addEventListener('scroll', readScroll, { passive: true })
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { rootMargin: '200px' },
    )
    observer.observe(section)

    const clock = new THREE.Clock()
    let alive = true
    let raf = 0
    const frame = () => {
      if (!alive) return
      raf = requestAnimationFrame(frame)
      const dt = Math.min(clock.getDelta(), 0.05)
      if (!visible) return
      const time = clock.elapsedTime
      progress += (target - progress) * (reduceMotion || snap ? 1 : Math.min(1, dt * 4.5))
      const sx = shipX(progress)
      const speed = Math.abs(sx - lastX) / Math.max(dt, 0.001)
      lastX = sx
      const wave = waveJS(sx, 0, time)
      const waveFront = waveJS(sx + 15, 0, time)
      const waveBack = waveJS(sx - 15, 0, time)
      ship.position.set(sx, wave.h * 0.55 - 0.15, 0)
      ship.rotation.z = Math.atan2(waveFront.h - waveBack.h, 30) * 0.6
      ship.rotation.x = wave.gz * 0.35
      updateContainers(progress)
      const cell = OCEAN_SIZE / SEG
      ocean.position.x = Math.round(sx / cell) * cell
      oceanMat.uniforms.uTime.value = time
      wake.position.x = sx - L / 2 - 44
      wakeMat.uniforms.uT.value = time
      wakeMat.uniforms.uA.value += (clamp(speed / 30, 0, 1) - wakeMat.uniforms.uA.value) * 0.08
      flags.forEach((flag) => {
        const attribute = flag.geometry.attributes.position
        for (let i = 0; i < attribute.count; i++) {
          const x = attribute.getX(i)
          attribute.setZ(i, (Math.sin(x * 1.4 - time * 5) * 0.25 * (x + 2.7)) / 5.4)
        }
        attribute.needsUpdate = true
      })
      navLight.material.opacity = 0.6 + 0.4 * Math.sin(time * 4)
      camAt(progress, sx)
      sky.position.copy(camera.position)
      renderer.render(scene, camera)

      const stepIndex = Math.min(5, Math.floor(progress * 6.0001))
      if (stepIndex !== lastStep) {
        steps.forEach((element, index) => {
          element.classList.toggle('on', index === stepIndex)
          element.classList.toggle('done', index < stepIndex)
        })
        lastStep = stepIndex
      }
      const route = sx / SAIL
      fill.style.width = `${route * 100}%`
      boat.style.left = `${route * 100}%`
      const day =
        progress < 0.42
          ? Math.round((progress / 0.42) * 7)
          : progress < 0.86
            ? 7 + Math.round(((progress - 0.42) / 0.44) * 23)
            : 30 + Math.round(((progress - 0.86) / 0.14) * 5)
      dayEl.textContent = `Day ${day}`
    }
    frame()

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', readScroll)
      observer.disconnect()
      renderer.dispose()
    }
  }, [hostRef, sectionRef])

  return <canvas id="sea" aria-hidden="true" />
}
