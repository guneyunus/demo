import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float time;
uniform vec3 color;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// Rastgele sayı üreteci
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Sparkle efekti için nokta fonksiyonu
float sparkle(vec2 uv, float scale, float speed) {
    vec2 center = vec2(
        random(vec2(floor(time * speed))),
        random(vec2(floor(time * speed) + 1.0))
    );
    
    float dist = length(uv * scale - center * scale);
    return 1.0 - smoothstep(0.0, 0.05, dist);
}

void main() {
    // Temel renk
    vec3 baseColor = color;
    
    // Güçlendirilmiş Fresnel efekti
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDir, vNormal), 1.5);
    
    // Hızlı parlaklık dalgalanması
    float brightness = sin(time * 5.0) * 0.3 + 0.7;
    
    // Multiple sparkle layers
    float sparkles = 0.0;
    for(float i = 0.0; i < 6.0; i++) {
        sparkles += sparkle(vUv, 8.0 + i, 2.0 + i * 0.5) * 0.5;
        sparkles += sparkle(vUv, 12.0 + i, 3.0 - i * 0.3) * 0.3;
    }
    
    // Yüzey parlaklığı için dalgalı desen
    float pattern = sin(vUv.x * 20.0 + time * 3.0) * sin(vUv.y * 20.0 + time * 3.0) * 0.5 + 0.5;
    
    // Parlak highlight rengi
    vec3 highlightColor = vec3(1.0, 1.0, 1.0);
    
    // Son renk hesaplama
    vec3 finalColor = mix(baseColor, highlightColor, fresnel * 0.9);
    finalColor *= (brightness * 0.5 + 0.8);
    finalColor += vec3(pattern * 0.2);
    
    // Sparkle efektini ekle
    finalColor += sparkles * highlightColor * 2.0;
    
    // Ekstra parlaklık boost
    finalColor = pow(finalColor, vec3(0.7)); // Gamma düzeltmesi ile parlaklığı artır
    finalColor *= 1.3; // Genel parlaklık artışı
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const SparklyMaterial = ({ color = "#ffaa00", speed = 1 }) => {
  const materialRef = useRef();

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value += delta * speed * 3; // Daha hızlı animasyon
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={{
        time: { value: 0 },
        color: { value: new THREE.Color(color) },
      }}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      transparent={true}
    />
  );
};
