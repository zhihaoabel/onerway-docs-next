<!-- components/ui/EarthBackground.vue -->
<script setup lang="ts">
import * as THREE from "three";

// 定义组件属性
interface Props {
  earthSize?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "center";
  opacity?: number;
  quality?: "low" | "medium" | "high" | "auto";
  isRotating?: boolean;
  rotationSpeed?: number;
  showClouds?: boolean;
  showAtmosphere?: boolean;
  showStars?: boolean;
  showSatellites?: boolean;
  showLogo?: boolean;
  showLogoGlow?: boolean;
  logoSize?: number;
  companyName?: string;
  responsive?: boolean;
  enableShaders?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  earthSize: 320,
  position: "top-right",
  opacity: 0.8,
  quality: "auto",
  isRotating: true,
  rotationSpeed: 0.005,
  showClouds: true,
  showAtmosphere: true,
  showStars: true,
  showSatellites: true,
  showLogo: true,
  showLogoGlow: true,
  logoSize: 80,
  companyName: "OneRway",
  responsive: true,
  enableShaders: true,
});

// const { t } = useI18n();

// 响应式状态
const earthContainer = ref<HTMLElement>();
const threeContainer = ref<HTMLElement>();
const isLoading = ref(true);
const loadingProgress = ref(0);
const fps = ref(0);
const triangleCount = ref(0);

// 开发环境显示调试信息
const showDebugInfo = computed(() => import.meta.dev);

// Three.js 相关变量
let scene: any = null;
let camera: any = null;
let renderer: any = null;
let earth: any = null;
let clouds: any = null;
let atmosphere: any = null;
let stars: any = null;
// let satellites: any[] = [];
let animationId: number = 0;
let frameCount = 0;
let lastTime = 0;

// 响应式计算属性
const actualEarthSize = ref(props.earthSize);

// 自动质量检测
const detectedQuality = computed(() => {
  if (props.quality !== "auto") return props.quality;

  if (!import.meta.client) return "medium";

  const memory = (navigator as any).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = window.innerWidth < 768;

  if (isMobile || memory < 4 || cores < 4) return "low";
  if (memory >= 8 && cores >= 8) return "high";
  return "medium";
});

const quality = computed(() => detectedQuality.value);

// 质量配置
const qualityConfigs = {
  low: { segments: 32, stars: 500, textureSize: 512 },
  medium: { segments: 64, stars: 1000, textureSize: 1024 },
  high: { segments: 128, stars: 2000, textureSize: 2048 },
};

// 位置样式
const positionClasses = computed(() => {
  const positions = {
    "top-right": "top-8 right-8 lg:top-12 lg:right-12",
    "top-left": "top-8 left-8 lg:top-12 lg:left-12",
    "bottom-right":
      "bottom-8 right-8 lg:bottom-12 lg:right-12",
    "bottom-left":
      "bottom-8 left-8 lg:bottom-12 lg:left-12",
    center:
      "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  };
  return positions[props.position];
});

// 容器样式
const containerStyle = computed(() => ({
  width: `${actualEarthSize.value}px`,
  height: `${actualEarthSize.value}px`,
  opacity: props.opacity,
}));

// 创建高质量地球纹理
const createEarthTexture = (size: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;

  // 创建海洋渐变
  const oceanGradient = ctx.createRadialGradient(
    canvas.width / 3,
    canvas.height / 3,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  oceanGradient.addColorStop(0, "#4FC3F7");
  oceanGradient.addColorStop(0.4, "#29B6F6");
  oceanGradient.addColorStop(0.7, "#1976D2");
  oceanGradient.addColorStop(1, "#0D47A1");

  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制大陆
  const continents = [
    { x: 0.15, y: 0.25, w: 0.12, h: 0.15 }, // 北美
    { x: 0.18, y: 0.6, w: 0.08, h: 0.25 }, // 南美
    { x: 0.5, y: 0.4, w: 0.1, h: 0.3 }, // 非洲
    { x: 0.48, y: 0.2, w: 0.08, h: 0.12 }, // 欧洲
    { x: 0.65, y: 0.25, w: 0.18, h: 0.2 }, // 亚洲
    { x: 0.78, y: 0.72, w: 0.08, h: 0.08 }, // 澳洲
  ];

  ctx.fillStyle = "#2E7D32";
  continents.forEach((continent) => {
    ctx.fillRect(
      continent.x * canvas.width,
      continent.y * canvas.height,
      continent.w * canvas.width,
      continent.h * canvas.height
    );
  });

  // 添加地形细节
  ctx.fillStyle = "#1B5E20";
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 2 + 1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  return canvas;
};

// 创建云层纹理
const createCloudsTexture = (size: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 生成云层
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 25 + 8;
    const opacity = Math.random() * 0.6 + 0.3;

    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  return canvas;
};

// 创建星空
const createStarField = (THREE: any, starCount: number) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const radius = 50 + Math.random() * 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] =
      radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] =
      radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    // 星星颜色变化
    const temp = Math.random();
    if (temp < 0.7) {
      colors[i * 3] =
        colors[i * 3 + 1] =
        colors[i * 3 + 2] =
          1; // 白色
    } else if (temp < 0.9) {
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 0.6; // 黄色
    } else {
      colors[i * 3] = 0.8;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 1; // 蓝色
    }
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3)
  );

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  return new THREE.Points(geometry, material);
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);

  // FPS 计算
  frameCount++;
  const now = performance.now();
  if (now >= lastTime + 1000) {
    fps.value = Math.round(
      (frameCount * 1000) / (now - lastTime)
    );
    frameCount = 0;
    lastTime = now;
  }

  // 地球旋转
  if (earth && props.isRotating) {
    earth.rotation.y += props.rotationSpeed;
  }

  // 云层旋转
  if (clouds && props.isRotating) {
    clouds.rotation.y += props.rotationSpeed * 1.1;
  }

  // 大气层旋转
  if (atmosphere) {
    atmosphere.rotation.y += props.rotationSpeed * 0.3;
  }

  // 星空缓慢旋转
  if (stars) {
    stars.rotation.y += props.rotationSpeed * 0.1;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
};

// 初始化 Three.js
const initThreeJS = async () => {
  if (!threeContainer.value) return;

  try {
    loadingProgress.value = 10;

    // 动态导入 Three.js
    loadingProgress.value = 30;

    // 创建场景
    scene = new THREE.Scene();

    // 创建相机
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(
      actualEarthSize.value,
      actualEarthSize.value
    );
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    threeContainer.value.appendChild(renderer.domElement);
    loadingProgress.value = 50;

    const config = qualityConfigs[quality.value];

    // 创建地球
    const earthGeometry = new THREE.SphereGeometry(
      2,
      config.segments,
      config.segments
    );

    const earthCanvas = createEarthTexture(
      config.textureSize
    );
    const earthTexture = new THREE.CanvasTexture(
      earthCanvas
    );
    earthTexture.wrapS = THREE.RepeatWrapping;

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 100,
      specular: new THREE.Color(0x222222),
    });

    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.castShadow = true;
    earth.receiveShadow = true;
    scene.add(earth);
    loadingProgress.value = 70;

    // 云层
    if (props.showClouds) {
      const cloudsGeometry = new THREE.SphereGeometry(
        2.02,
        config.segments / 2,
        config.segments / 2
      );
      const cloudsCanvas = createCloudsTexture(
        config.textureSize
      );
      const cloudsTexture = new THREE.CanvasTexture(
        cloudsCanvas
      );

      const cloudsMaterial = new THREE.MeshLambertMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      });

      clouds = new THREE.Mesh(
        cloudsGeometry,
        cloudsMaterial
      );
      scene.add(clouds);
    }

    // 大气层
    if (props.showAtmosphere) {
      const atmosphereGeometry = new THREE.SphereGeometry(
        2.1,
        config.segments / 2,
        config.segments / 2
      );
      const atmosphereMaterial =
        new THREE.MeshBasicMaterial({
          color: 0x87ceeb,
          transparent: true,
          opacity: 0.15,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
        });

      atmosphere = new THREE.Mesh(
        atmosphereGeometry,
        atmosphereMaterial
      );
      scene.add(atmosphere);
    }

    // 星空
    if (props.showStars) {
      stars = createStarField(THREE, config.stars);
      scene.add(stars);
    }

    loadingProgress.value = 90;

    // 光照
    const ambientLight = new THREE.AmbientLight(
      0x404040,
      0.3
    );
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      1
    );
    directionalLight.position.set(5, 3, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // 更新三角形计数
    triangleCount.value = scene.children.reduce(
      (count: number, child: any) => {
        if (child.geometry) {
          return (
            count +
            (child.geometry.attributes.position?.count ||
              0) /
              3
          );
        }
        return count;
      },
      0
    );

    loadingProgress.value = 100;

    // 开始动画
    animate();

    // 延迟显示，确保平滑过渡
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  } catch (error) {
    console.warn("Three.js Earth failed to load:", error);
    isLoading.value = false;
  }
};

// 清理资源
const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  if (renderer && threeContainer.value) {
    threeContainer.value.removeChild(renderer.domElement);
    renderer.dispose();
  }

  // 清理几何体和材质
  const objects = [earth, clouds, atmosphere, stars];
  objects.forEach((obj) => {
    if (obj) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }
  });

  scene = null;
  renderer = null;
  earth = null;
  clouds = null;
  atmosphere = null;
  stars = null;
};

// 响应式尺寸调整
const updateSize = () => {
  if (!props.responsive) return;

  const width = window.innerWidth;
  if (width < 640) {
    actualEarthSize.value = Math.min(
      props.earthSize * 0.7,
      220
    );
  } else if (width < 1024) {
    actualEarthSize.value = Math.min(
      props.earthSize * 0.85,
      280
    );
  } else {
    actualEarthSize.value = props.earthSize;
  }

  if (renderer) {
    renderer.setSize(
      actualEarthSize.value,
      actualEarthSize.value
    );
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
};

// 生命周期钩子
onMounted(() => {
  if (import.meta.client) {
    updateSize();
    window.addEventListener("resize", updateSize);

    // 延迟初始化，确保 DOM 准备就绪
    nextTick(() => {
      initThreeJS();
    });
  }
});

onUnmounted(() => {
  cleanup();
  if (import.meta.client) {
    window.removeEventListener("resize", updateSize);
  }
});

// 暴露方法供父组件调用
defineExpose({
  refresh: initThreeJS,
  cleanup,
});
</script>

<template>
  <div
    class="fixed inset-0 pointer-events-none overflow-hidden z-0"
  >
    <!-- 地球容器 -->
    <div
      ref="earthContainer"
      class="absolute"
      :class="positionClasses"
      :style="containerStyle"
    >
      <!-- 加载状态 -->
      <Transition
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isLoading"
          class="flex items-center justify-center h-full"
        >
          <div class="text-center">
            <!-- 优雅的加载动画 -->
            <div class="relative">
              <div
                class="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"
              >
                <div
                  class="absolute inset-2 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"
                  style="
                    animation-direction: reverse;
                    animation-duration: 1.5s;
                  "
                >
                </div>
              </div>
              <div
                class="absolute inset-1/2 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
              ></div>
            </div>
            <p
              class="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              {{ $t("earth.loading", "Loading Earth...") }}
            </p>
            <p
              class="text-xs text-gray-500 dark:text-gray-500 mt-1"
            >
              {{ Math.round(loadingProgress) }}%
            </p>
          </div>
        </div>
      </Transition>

      <!-- Three.js 渲染容器 -->
      <div
        v-show="!isLoading"
        ref="threeContainer"
        class="w-full h-full"
      />

      <!-- Logo 覆盖层 -->
      <Transition
        enter-active-class="transition-all duration-700 delay-300"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
      >
        <div
          v-if="showLogo && !isLoading"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="relative group">
            <!-- Logo 光环背景 -->
            <div
              v-if="showLogoGlow"
              class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-emerald-400/20 blur-xl scale-125 animate-pulse"
              style="animation-duration: 4s"
            />

            <!-- Logo 主体 -->
            <div
              class="relative backdrop-blur-md bg-white/95 dark:bg-white/90 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/60 dark:border-white/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl"
              :style="{
                width: `${logoSize}px`,
                height: `${logoSize}px`,
              }"
            >
              <slot name="logo">
                <!-- 默认 OneRway Logo -->
                <div class="text-center">
                  <div
                    class="font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent leading-tight"
                    :style="{
                      fontSize: `${logoSize * 0.2}px`,
                    }"
                  >
                    OneRway
                  </div>
                  <div
                    class="text-blue-500/80 dark:text-blue-600/80 font-medium tracking-wider"
                    :style="{
                      fontSize: `${logoSize * 0.11}px`,
                    }"
                  >
                    Global Payment
                  </div>
                  <!-- 装饰点 -->
                  <div
                    class="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full animate-pulse opacity-80"
                  ></div>
                </div>
              </slot>
            </div>

            <!-- 多层光环效果 -->
            <div
              v-if="showLogoGlow"
              class="absolute inset-0 rounded-full pointer-events-none"
            >
              <div
                class="absolute inset-0 rounded-full bg-blue-400/10 animate-ping"
                style="animation-duration: 3s"
              ></div>
              <div
                class="absolute inset-2 rounded-full bg-purple-400/10 animate-ping"
                style="
                  animation-duration: 4s;
                  animation-delay: 1s;
                "
              ></div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 性能监控信息（开发环境） -->
    <div
      v-if="showDebugInfo && !isLoading"
      class="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs pointer-events-auto z-50 font-mono"
    >
      <div class="space-y-1">
        <div>FPS: {{ fps }}</div>
        <div>Quality: {{ quality }}</div>
        <div>Triangles: {{ triangleCount }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Three.js canvas 样式 */
:deep(canvas) {
  border-radius: 50%;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15));
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  .animate-spin,
  .animate-pulse,
  .animate-ping {
    animation: none !important;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .bg-white\/95 {
    background-color: rgba(255, 255, 255, 0.98);
  }
}
</style>
