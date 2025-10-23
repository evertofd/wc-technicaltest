export interface GithubUserApi {
  avatar_url: string;
  bio: string | null;
  name: string | null;
  public_repos: number;
  html_url: string;
}

export interface User {
  avatarUrl: string;
  bio: string | null;
  name: string | null;
  publicRepos: number;
  htmlUrl: string;
}
/**
 * Author: @EvertoFarias
 * Descripción: Interface para la respuesta del endpoint /profiles/:username del backend.
 * Contiene la información básica del perfil de usuario de GitHub incluyendo nombre,
 * avatar, biografía, cantidad de repositorios públicos, seguidores y enlace al perfil.
 */
export interface ProfileResponse {
  username: string;
  name: string | null;
  avatar: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  profileUrl: string;
}

export interface MetricsResponse {
  username: string;
  metrics: UserMetrics;
}

export interface UserMetrics {
  totalStars: number;
  followersToReposRatio: number;
  lastPushDaysAgo: number | null;
}
