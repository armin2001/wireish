/*
 * GLSL for the brand scene. Every fragment shader ends with <colorspace_fragment>
 * so linear-space brand colors come out as the exact sRGB hex values from the logo.
 * (smoothstep is always called with edge0 < edge1; the reverse is undefined in GLSL.)
 */

export const wireVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/** Tube wire: logo gradient along its length plus a travelling message pulse. */
export const wireFragment = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
uniform float uOffset;
uniform float uBoost;
uniform float uIntensity;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec2 vUv;

vec3 ramp(float t) {
  return t < 0.5 ? mix(uColorA, uColorB, t * 2.0) : mix(uColorB, uColorC, (t - 0.5) * 2.0);
}

void main() {
  float t = vUv.x;
  float head = fract(uTime * (uSpeed + uBoost * 0.55) + uOffset);
  float behind = fract(head - t);
  float pulse = exp(-behind * 14.0) * (1.0 + uBoost * 1.6);
  float ends = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.94, 1.0, t));
  float intensity = (0.3 + pulse * 1.8) * ends * uIntensity;
  gl_FragColor = vec4(ramp(t) * intensity, clamp(intensity, 0.0, 1.0));
  #include <colorspace_fragment>
}
`;

export const particleVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
attribute vec3 aColor;
attribute float aPhase;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.25 + aPhase * 6.2831) * 0.12;
  p.x += cos(uTime * 0.18 + aPhase * 6.2831) * 0.08;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio / max(-mv.z, 0.1);
  vColor = aColor;
  vAlpha = 0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * 1.1 + aPhase * 40.0));
}
`;

export const particleFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a * vAlpha * 0.8);
  #include <colorspace_fragment>
}
`;

export const coreVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
void main() {
  vPos = position;
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

/** The AI agent core: fresnel rim in the logo gradient, flaring when a message lands. */
export const coreFragment = /* glsl */ `
uniform float uTime;
uniform float uPulse;
uniform float uRadius;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;

void main() {
  float facing = clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);
  float fresnel = pow(1.0 - facing, 2.2);
  float band = 0.5 + 0.5 * sin(vPos.y * 7.0 + uTime * 1.4 + atan(vPos.z, vPos.x) * 2.0);
  float g = clamp((vPos.y + uRadius) / (2.0 * uRadius), 0.0, 1.0);
  vec3 color = mix(uColorA, uColorB, g);
  color = mix(color, uColorC, band * 0.35);
  float alpha = clamp(fresnel * 1.25 + 0.1 + uPulse * 0.35, 0.0, 1.0);
  gl_FragColor = vec4(color * (0.4 + fresnel * 1.6 + uPulse * 1.2), alpha);
  #include <colorspace_fragment>
}
`;
