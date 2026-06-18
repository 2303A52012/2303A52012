import { Log as middlewareLog } from "logging-middleware";

/**
 * Reusable Log function that redirects logs to the logging middleware package.
 * 
 * @param {string} stack - 'frontend' | 'backend'
 * @param {string} level - 'debug' | 'info' | 'warn' | 'error' | 'fatal'
 * @param {string} packageName - The component/hook/package name (e.g. 'api', 'page')
 * @param {string} message - Descriptive log message
 */
export async function Log(stack, level, packageName, message) {
  return await middlewareLog(stack, level, packageName, message);
}