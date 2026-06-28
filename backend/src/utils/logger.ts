export const logger = {
  info: (msg: string, ...args: any[]) => console.log(`[NOVA CORE // INFO] ${msg}`, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(`[NOVA CORE // WARN] ${msg}`, ...args),
  error: (msg: string, ...args: any[]) => console.error(`[NOVA CORE // ERRR] ${msg}`, ...args),
};
