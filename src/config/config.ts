/**
 * Author: @EvertoFarias
 * Descripción:
 * Define la URL base del backend API que puede ser configurada mediante
 * la variable de entorno VITE_API_BASE_URL, con fallback a localhost:3001.
 * Esto permite cambiar el endpoint del backend sin modificar el código.
 */
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
} as const;
