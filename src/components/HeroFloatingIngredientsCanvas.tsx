import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const HeroFloatingIngredientsCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Renderer with Storefront Orange Tone Mapping
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 720;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.replaceChildren(renderer.domElement);

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 0, 7.5);

    // 4. Procedural Studio Room Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Storefront Orange Lighting Setup
    // Warm storefront orange incandescent glow
    const orangeStorefrontLight = new THREE.DirectionalLight(0xFFA028, 3.2);
    orangeStorefrontLight.position.set(4, 5, 4);
    scene.add(orangeStorefrontLight);

    // Deep warm amber rim light
    const amberRimLight = new THREE.DirectionalLight(0xE65100, 2.4);
    amberRimLight.position.set(-5, -2, -3);
    scene.add(amberRimLight);

    // Soft warm environmental fill
    const warmFillLight = new THREE.HemisphereLight(0xFFE8D6, 0x1B382B, 1.3);
    scene.add(warmFillLight);

    // 6. Procedural Floating Gourmet Deli Ingredients
    const ingredientsGroup = new THREE.Group();
    scene.add(ingredientsGroup);

    interface FloatingItem {
      mesh: THREE.Object3D;
      baseX: number;
      baseY: number;
      baseZ: number;
      floatPhase: number;
      floatSpeed: number;
      parallaxFactor: number;
      rotSpeed: { x: number; y: number; z: number };
    }

    const items: FloatingItem[] = [];

    // --- A. Heirloom Tomato Slice ---
    const createTomatoSlice = () => {
      const group = new THREE.Group();
      // Outer tomato ring
      const tomatoGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.08, 24);
      const tomatoMat = new THREE.MeshStandardMaterial({
        color: 0xC62828, // Deep ripe tomato crimson
        roughness: 0.28,
        metalness: 0.05,
      });
      const slice = new THREE.Mesh(tomatoGeo, tomatoMat);
      slice.rotation.x = Math.PI / 2;
      group.add(slice);

      // Inner flesh segments & seeds
      const seedGeo = new THREE.TorusGeometry(0.28, 0.05, 8, 16);
      const seedMat = new THREE.MeshStandardMaterial({
        color: 0x8E1E1E,
        roughness: 0.2,
      });
      const seedRing = new THREE.Mesh(seedGeo, seedMat);
      seedRing.position.z = 0.02;
      group.add(seedRing);

      return group;
    };

    // --- B. Butterhead Lettuce Leaf ---
    const createLettuceLeaf = () => {
      const geo = new THREE.PlaneGeometry(0.85, 0.7, 8, 8);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // wavy ruffles
        const wave = Math.sin(x * 6) * 0.08 + Math.cos(y * 5) * 0.07;
        pos.setZ(i, wave);
      }
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: 0x4D852C, // Bright fresh deli green
        roughness: 0.55,
        metalness: 0.02,
        side: THREE.DoubleSide,
      });
      return new THREE.Mesh(geo, mat);
    };

    // --- C. Swiss Gruyère Cheese Wedge with Holes ---
    const createCheeseWedge = () => {
      const group = new THREE.Group();
      // Wedge base
      const shape = new THREE.Shape();
      shape.moveTo(-0.4, -0.3);
      shape.lineTo(0.4, -0.3);
      shape.lineTo(0.25, 0.35);
      shape.lineTo(-0.35, 0.3);
      shape.closePath();

      const extrudeSettings = {
        depth: 0.1,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      };
      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xF8D76E, // Warm gruyère gold
        roughness: 0.35,
        metalness: 0.04,
      });
      const wedge = new THREE.Mesh(geo, mat);
      wedge.position.z = -0.05;
      group.add(wedge);

      // 3 characteristic Swiss holes (shallow darkened insets)
      const holeMat = new THREE.MeshBasicMaterial({ color: 0xD8B244 });
      const holeCoords = [
        { x: -0.1, y: 0, r: 0.06 },
        { x: 0.15, y: -0.12, r: 0.09 },
        { x: 0.05, y: 0.15, r: 0.07 },
      ];
      holeCoords.forEach(({ x, y, r }) => {
        const hGeo = new THREE.CircleGeometry(r, 12);
        const hMesh = new THREE.Mesh(hGeo, holeMat);
        hMesh.position.set(x, y, 0.07);
        group.add(hMesh);
      });

      return group;
    };

    // --- D. Toasted Bread Crouton / Rye Crisp ---
    const createBreadPiece = () => {
      const geo = new THREE.BoxGeometry(0.52, 0.42, 0.14, 2, 2, 2);
      const crustMat = new THREE.MeshStandardMaterial({
        color: 0x854A1E, // Toasted hearth crust
        roughness: 0.88,
        metalness: 0.04,
      });
      const crumbMat = new THREE.MeshStandardMaterial({
        color: 0xD9B88F, // Soft warm caraway crumb
        roughness: 0.92,
        metalness: 0.02,
      });
      return new THREE.Mesh(geo, [
        crustMat, crustMat, crumbMat, crumbMat, crustMat, crustMat
      ]);
    };

    // --- E. Crisp Dill Pickle Plank ---
    const createPicklePlank = () => {
      const geo = new THREE.CylinderGeometry(0.16, 0.16, 0.75, 12);
      geo.rotateZ(Math.PI / 2);
      geo.scale(1, 0.45, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x486E31,
        roughness: 0.32,
        metalness: 0.1,
      });
      return new THREE.Mesh(geo, mat);
    };

    // Curated subtle layout: Placed at the natural periphery and corners of the Hero
    // (Never obstructing the central headline or call-to-action buttons)
    const ingredientFactories = [
      // Top Left quadrant (Floating heirloom tomato)
      { factory: createTomatoSlice, x: -3.2, y: 1.8, z: -0.5, speed: 0.8, pFact: 0.0018 },
      // Top Right quadrant (Crisp butterhead lettuce leaf)
      { factory: createLettuceLeaf, x: 3.4, y: 1.9, z: -0.8, speed: 0.7, pFact: 0.0015 },
      // Mid Left flank (Golden Gruyère wedge caught in orange light)
      { factory: createCheeseWedge, x: -3.8, y: -0.4, z: 0.2, speed: 0.6, pFact: 0.0022 },
      // Mid Right flank (Toasted caraway rye crouton)
      { factory: createBreadPiece, x: 3.6, y: -0.5, z: 0.4, speed: 0.65, pFact: 0.0025 },
      // Bottom Left periphery (Crisp dill pickle plank)
      { factory: createPicklePlank, x: -2.8, y: -2.1, z: -0.2, speed: 0.75, pFact: 0.0019 },
      // Bottom Right periphery (Second baby tomato slice)
      { factory: createTomatoSlice, x: 2.9, y: -2.0, z: -0.6, speed: 0.85, pFact: 0.0016 },
      // Deep background ambient piece (soft floating lettuce frond)
      { factory: createLettuceLeaf, x: -1.2, y: 2.6, z: -2.0, speed: 0.5, pFact: 0.0009 },
      // Deep background ambient piece (soft toasted cube)
      { factory: createBreadPiece, x: 1.4, y: 2.5, z: -1.8, speed: 0.55, pFact: 0.0011 },
    ];

    ingredientFactories.forEach(({ factory, x, y, z, speed, pFact }, idx) => {
      const mesh = factory();
      mesh.position.set(x, y, z);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        (idx * 0.4)
      );

      // Subtle scale variation
      const s = 0.85 + Math.random() * 0.25;
      mesh.scale.set(s, s, s);

      ingredientsGroup.add(mesh);

      items.push({
        mesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        floatPhase: idx * 0.9,
        floatSpeed: speed,
        parallaxFactor: pFact,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.004,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.004,
        },
      });
    });

    // 7. Silky Animation Loop with Scroll Parallax and Gentle Damping
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const scrollY = scrollYRef.current;

      // Subtle group tilt from cursor (understated, never aggressive)
      const targetGroupRotY = pointerRef.current.x * 0.08;
      const targetGroupRotX = -pointerRef.current.y * 0.05;
      ingredientsGroup.rotation.y = THREE.MathUtils.damp(ingredientsGroup.rotation.y, targetGroupRotY, 2.5, delta);
      ingredientsGroup.rotation.x = THREE.MathUtils.damp(ingredientsGroup.rotation.x, targetGroupRotX, 2.5, delta);

      // Animate each floating ingredient gently
      items.forEach((item) => {
        // Very slow, soothing tumble rotation
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.z += item.rotSpeed.z;

        // Gentle floating micro-oscillation
        const floatY = Math.sin(elapsed * 0.8 * item.floatSpeed + item.floatPhase) * 0.12;
        const floatX = Math.cos(elapsed * 0.6 * item.floatSpeed + item.floatPhase) * 0.08;

        // Scroll Parallax: Ingredients drift upward as user scrolls down into the menu
        const scrollParallaxY = scrollY * item.parallaxFactor * 1.8;

        item.mesh.position.y = item.baseY + floatY + scrollParallaxY;
        item.mesh.position.x = item.baseX + floatX;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resizing
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-hidden"
    />
  );
};
